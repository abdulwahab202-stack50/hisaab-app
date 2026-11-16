const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hisab_app';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing test data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing users and transactions');

    // 1. Create Admin
    const adminExpiry = new Date();
    adminExpiry.setFullYear(adminExpiry.getFullYear() + 25);
    const admin = await User.create({
      name: 'Admin Controller',
      email: 'admin@hisab.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      expiryDate: adminExpiry,
    });
    console.log('Created Admin: admin@hisab.com / admin123');

    // 2. Create Active Client
    const activeExpiry = new Date();
    activeExpiry.setDate(activeExpiry.getDate() + 25); // 25 days remaining
    const client = await User.create({
      name: 'Ahmed Khan',
      email: 'client@hisab.com',
      password: 'client123',
      role: 'client',
      isActive: true,
      expiryDate: activeExpiry,
    });
    console.log('Created Active Client: client@hisab.com / client123');

    // 3. Create Expired Client (to test access expiry blocking)
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 2); // Expired 2 days ago
    const expiredClient = await User.create({
      name: 'Bilal Expired',
      email: 'expired@hisab.com',
      password: 'expired123',
      role: 'client',
      isActive: true,
      expiryDate: expiredDate,
    });
    console.log('Created Expired Client: expired@hisab.com / expired123 (Testing expiry check)');

    // 4. Create Sample Transactions for Active Client
    const sampleTransactions = [
      {
        userId: client._id,
        type: 'incoming',
        amount: 85000,
        source: 'Web Development Project',
        note: 'Milestone 1 payment received via bank transfer',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        userId: client._id,
        type: 'incoming',
        amount: 32000,
        source: 'UI/UX Consultation',
        note: 'Design sprint payment from Apex Tech',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      },
      {
        userId: client._id,
        type: 'outgoing',
        amount: 25000,
        source: 'Office Rent',
        note: 'Monthly co-working space fee',
        date: new Date(Date.now() - 1000 * 60 * 60 * 28),
      },
      {
        userId: client._id,
        type: 'outgoing',
        amount: 4500,
        source: 'High-speed Internet',
        note: 'Fiber optic broadband monthly bill',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
      {
        userId: client._id,
        type: 'incoming',
        amount: 15000,
        source: 'Mobile App Bug Fixing',
        note: 'Quick retainer service for retail app',
        date: new Date(Date.now() - 1000 * 60 * 60 * 72),
      },
      {
        userId: client._id,
        type: 'outgoing',
        amount: 8200,
        source: 'Software Subscriptions',
        note: 'Figma, GitHub Copilot & Hosting',
        date: new Date(Date.now() - 1000 * 60 * 60 * 96),
      },
    ];

    await Transaction.insertMany(sampleTransactions);
    console.log(`Seeded ${sampleTransactions.length} sample transactions for ${client.email}`);

    console.log('\n--- Seed Summary ---');
    console.log('Admin Account:   admin@hisab.com / admin123');
    console.log('Active Client:   client@hisab.com / client123');
    console.log('Expired Client:  expired@hisab.com / expired123');
    console.log('--------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
