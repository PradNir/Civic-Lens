const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/tickets', require('./routes/ticket'));

app.get('/', (req, res) => {
  res.json({ message: 'Civic Lens API is running' });
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Missing MONGO_URI in server/.env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Civic Lens server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);

    if (String(err.message).includes('bad auth')) {
      console.error(
        'Auth failed. Verify Atlas Database Access user/password and update MONGO_URI in server/.env.'
      );
    }

    process.exit(1);
  });
