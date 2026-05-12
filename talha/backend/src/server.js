require('dotenv').config();

const fs = require('fs');
const path = require('path');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, '..', 'uploads', 'tickets');

fs.mkdirSync(uploadsDir, { recursive: true });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`EMS backend running on port ${PORT}`);
  });
});