const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  toggleClientStatus,
  extendExpiry,
  deleteClient,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/clients', getClients);
router.post('/create-client', createClient);
router.put('/toggle-client/:id', toggleClientStatus);
router.put('/extend-expiry/:id', extendExpiry);
router.delete('/clients/:id', deleteClient);

module.exports = router;
