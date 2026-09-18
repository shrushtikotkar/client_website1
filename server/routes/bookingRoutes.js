const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
  try {
    const { name, phone, service } = req.body;
    if (!name || !phone || !service) {
      return res.status(400).json({ success: false, error: 'Please fill all fields' });
    }
    const newBooking = await Booking.create({ name, phone, service });
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;