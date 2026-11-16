const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all clients with stats
// @route   GET /api/admin/clients
// @access  Private / Admin
const getClients = async (req, res) => {
  try {
    // Find all clients (exclude admin accounts from client list or include with role)
    const clients = await User.find({ role: 'client' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate transaction statistics for each client
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const clientObj = client.toObject();
        
        // Count transactions
        const txCount = await Transaction.countDocuments({ userId: client._id });

        // Calculate balance
        const txStats = await Transaction.aggregate([
          { $match: { userId: client._id } },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
            },
          },
        ]);

        let incoming = 0;
        let outgoing = 0;
        txStats.forEach((t) => {
          if (t._id === 'incoming') incoming = t.total;
          if (t._id === 'outgoing') outgoing = t.total;
        });

        const isPermanent = !client.expiryDate;
        const isExpired = !isPermanent && client.expiryDate && new Date(client.expiryDate) < new Date();
        const now = new Date();
        const diffTime = client.expiryDate ? new Date(client.expiryDate).getTime() - now.getTime() : 0;
        const daysRemaining = isPermanent ? null : (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) < 0 ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        return {
          ...clientObj,
          totalTransactions: txCount,
          totalIncoming: incoming,
          totalOutgoing: outgoing,
          balance: incoming - outgoing,
          isPermanent,
          isExpired,
          daysRemaining,
        };
      })
    );

    res.json({
      success: true,
      count: clientsWithStats.length,
      clients: clientsWithStats,
    });
  } catch (error) {
    console.error('Admin get clients error:', error);
    res.status(500).json({ message: error.message || 'Error fetching client list' });
  }
};

// @desc    Create a new client
// @route   POST /api/admin/create-client
// @access  Private / Admin
const createClient = async (req, res) => {
  try {
    const { name, email, password, expiryOption, customDays } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Determine expiry date
    let expiryDate = new Date();
    if (expiryOption === 'permanent') {
      expiryDate = null; // No expiry, lifetime access
    } else if (expiryOption === '7_days') {
      expiryDate.setDate(expiryDate.getDate() + 7);
    } else if (expiryOption === '30_days') {
      expiryDate.setDate(expiryDate.getDate() + 30);
    } else if (customDays && !isNaN(parseInt(customDays))) {
      expiryDate.setDate(expiryDate.getDate() + parseInt(customDays));
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    const client = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'client',
      isActive: true,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        role: client.role,
        isActive: client.isActive,
        expiryDate: client.expiryDate,
        createdAt: client.createdAt,
      },
    });
  } catch (error) {
    console.error('Admin create client error:', error);
    res.status(500).json({ message: error.message || 'Error creating client' });
  }
};

// @desc    Toggle client active status (Activate / Deactivate)
// @route   PUT /api/admin/toggle-client/:id
// @access  Private / Admin
const toggleClientStatus = async (req, res) => {
  try {
    const client = await User.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate an admin account' });
    }

    // Toggle isActive
    client.isActive = !client.isActive;
    await client.save();

    res.json({
      success: true,
      message: `Client ${client.isActive ? 'activated' : 'deactivated'} successfully`,
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        isActive: client.isActive,
        expiryDate: client.expiryDate,
      },
    });
  } catch (error) {
    console.error('Admin toggle client error:', error);
    res.status(500).json({ message: error.message || 'Error updating client status' });
  }
};

// @desc    Extend client expiry date
// @route   PUT /api/admin/extend-expiry/:id
// @access  Private / Admin
const extendExpiry = async (req, res) => {
  try {
    const { days, permanent } = req.body;
    const client = await User.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (permanent || days === 'permanent') {
      client.expiryDate = null;
      client.isActive = true;
      await client.save();

      return res.json({
        success: true,
        message: 'Client converted to Permanent / Lifetime access',
        client: {
          _id: client._id,
          name: client.name,
          expiryDate: null,
          isPermanent: true,
          isActive: client.isActive,
        },
      });
    }

    const daysToAdd = parseInt(days) || 30; // default 30 days extension

    // If currently expired or no expiry date, start from today.
    // If not expired yet, add to the current expiry date.
    let baseDate = client.expiryDate ? new Date(client.expiryDate) : new Date();
    if (baseDate < new Date()) {
      baseDate = new Date();
    }

    baseDate.setDate(baseDate.getDate() + daysToAdd);
    client.expiryDate = baseDate;
    // Also auto-activate if they were inactive due to expiry
    client.isActive = true;

    await client.save();

    res.json({
      success: true,
      message: `Expiry extended by ${daysToAdd} days`,
      client: {
        _id: client._id,
        name: client.name,
        expiryDate: client.expiryDate,
        isActive: client.isActive,
      },
    });
  } catch (error) {
    console.error('Admin extend expiry error:', error);
    res.status(500).json({ message: error.message || 'Error extending client expiry' });
  }
};

// @desc    Delete a client and their transactions
// @route   DELETE /api/admin/clients/:id
// @access  Private / Admin
const deleteClient = async (req, res) => {
  try {
    const client = await User.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete an admin account' });
    }

    // Delete all associated transactions
    await Transaction.deleteMany({ userId: client._id });
    await client.deleteOne();

    res.json({
      success: true,
      message: 'Client and their transactions deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Admin delete client error:', error);
    res.status(500).json({ message: error.message || 'Error deleting client' });
  }
};

module.exports = {
  getClients,
  createClient,
  toggleClientStatus,
  extendExpiry,
  deleteClient,
};
