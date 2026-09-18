require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const sampleVehicles = [
  {
    name: 'Sadguru Deluxe Luxury Coach (MH 04 GP 7877)',
    category: 'Luxury Bus',
    seats: '35-45 Seats',
    luggage: 'Large Luggage Hold',
    description: 'Custom decorated luxury 2x2 coach (MH 04 GP 7877) with full AC, illuminated Sadguru LED ambient ceiling, pushback seats, and heavy luggage storage.',
    image: '/cyan-bus-full.jpg',
    tag: 'FLAGSHIP LUXURY'
  },
  {
    name: 'Executive White Tourist Coach (DD 01 Z 9559)',
    category: 'Luxury Bus',
    seats: '32-45 Seats',
    luggage: 'Large Luggage Hold',
    description: 'Mercedes-Benz styled executive tourist coach (DD 01 Z 9559) with luxury blue-beige leather pushback seats, violet mood lighting, and climate control.',
    image: '/white-bus-side.jpg',
    tag: 'EXECUTIVE TOURIST'
  },
  {
    name: 'Force Traveller Executive (DD 01 AC 9837)',
    category: 'Tempo Traveler',
    seats: '17 to 26 Seats',
    luggage: 'Roof & Rear Luggage',
    description: 'Pristine, pushback seating Force Tourist Traveller (DD 01 AC 9837) ideal for outstation family trips, pilgrimage tours, airport transfers, and corporate outings.',
    image: '/force-traveller-exterior.jpg',
    tag: 'FAMILY FAVORITE'
  },
  {
    name: 'BharatBenz Premium Tourist Coach (MH 20 GY 7776)',
    category: 'Luxury Bus',
    seats: '40+ Seats',
    luggage: 'Underbody Storage',
    description: 'Long-distance express BharatBenz tourist coach (MH 20 GY 7776) featuring ultra-comfortable suspensions, clean white headrest seat covers, and full climate control.',
    image: '/bharatbenz-bus-side.jpg',
    tag: 'EXPRESS COMFORT'
  }
];

const autoSeedFleet = async () => {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      console.log('🌱 No vehicles found in database. Auto-seeding initial fleet...');
      await Vehicle.insertMany(sampleVehicles);
      console.log('✅ Auto-seeded initial fleet successfully!');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed note:', err.message);
  }
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    await Vehicle.deleteMany({});
    console.log('Removed all old dummy vehicles...');
    await Vehicle.insertMany(sampleVehicles);
    console.log('Successfully seeded real Sadguru vehicles!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { sampleVehicles, autoSeedFleet };