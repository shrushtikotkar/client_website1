const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../models/Vehicle');

// Configure Multer storage to save files in 'uploads/'
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP, AVIF, GIF) are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ➕ POST: Upload an image file directly
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Return relative image URL path
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl, filename: req.file.filename });
});

// ➕ POST: Add a new vehicle entry to MongoDB
router.post('/', async (req, res) => {
  try {
    const { name, category, seats, luggage, description, image, tag } = req.body;
    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Name and image are required' });
    }
    const newVehicle = new Vehicle({
      name,
      category: category || 'Luxury Bus',
      seats: seats || 'Available',
      luggage: luggage || 'Available',
      description: description || '',
      image,
      tag: tag || 'NEW'
    });
    await newVehicle.save();
    res.status(201).json({ success: true, data: newVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ➕ PUT: Update vehicle image by ID
router.put('/:id', async (req, res) => {
  try {
    const { image, name, category, seats, luggage, description, tag } = req.body;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { image, name, category, seats, luggage, description, tag },
      { new: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🗑️ DELETE: Delete vehicle by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, message: 'Vehicle deleted successfully', data: deletedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;