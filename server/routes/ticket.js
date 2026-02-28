const express = require('express');
const Ticket = require('../models/Ticket');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function generateTicketId() {
  return `CVL-${Math.floor(1000 + Math.random() * 9000)}`;
}

router.post('/classify', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      },
      'Look at this image of a city infrastructure issue. Classify it into exactly one of these categories: Pothole, Broken Streetlight, Graffiti, Flooding, Damaged Sidewalk, Illegal Dumping, Noise Complaint, Other. Respond with the category name only, nothing else.',
    ]);

    const category = result.response.text().trim();
    return res.json({ category });
  } catch (err) {
    const message = err?.message || 'Classification failed';
    console.error('Gemini classification error:', message);
    return res.status(err?.status || 500).json({ error: message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { description, category, photoUrl, location, userId } = req.body;

    const ticket = new Ticket({
      ticketId: generateTicketId(),
      userId: userId || 'anonymous',
      description,
      category,
      photoUrl,
      location,
      log: [{ message: 'Report submitted by citizen', by: 'Citizen' }],
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id.toUpperCase() });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json(ticket);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

module.exports = router;
