require('dotenv').config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seed = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ems.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  await User.create({
    name: 'System Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    organization: 'EMS'
  });

  console.log(`Admin user created: ${adminEmail}`);
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});