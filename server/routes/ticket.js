const express = require('express');
const Ticket = require('../models/Ticket');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const requireDepartmentAccess = require('../middleware/requireDepartmentAccess');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeDepartment(rawDepartment) {
  if (typeof rawDepartment !== 'string') return '';
  const normalized = rawDepartment.trim().toLowerCase();
  if (!normalized) return '';

  const map = {
    'public works': 'Public Works',
    'public works department': 'Public Works',
    'rolla municipal utilities': 'Rolla Municipal Utilities',
    'municipal utilities': 'Rolla Municipal Utilities',
    utilities: 'Rolla Municipal Utilities',
    'environmental services': 'Environmental Services',
    'environment services': 'Environmental Services',
    police: 'Police Department',
    'police department': 'Police Department',
    parks: 'Parks & Recreation',
    'parks & recreation': 'Parks & Recreation',
    'parks and recreation': 'Parks & Recreation',
    'community development': 'Community Development',
  };

  return map[normalized] || rawDepartment.trim();
}

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

router.get('/', requireDepartmentAccess, async (req, res) => {
  try {
    const { status, department } = req.query;
    const { isAdmin, department: userDepartment } = req.authContext;
    const filter = {};

    if (status) filter.status = status;
    if (isAdmin) {
      if (department) filter.department = department;
    } else {
      filter.department = { $regex: `^${escapeRegex(userDepartment)}$`, $options: 'i' };
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    return res.json(tickets);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.patch('/:id', requireDepartmentAccess, async (req, res) => {
  try {
    const { isAdmin, department: userDepartment } = req.authContext;
    const { status, department, assignedTo, internalNote } = req.body;
    const ticket = await Ticket.findOne({ ticketId: req.params.id.toUpperCase() });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (!isAdmin && normalizeDepartment(ticket.department) !== normalizeDepartment(userDepartment)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (typeof status === 'string') ticket.status = status;
    if (typeof department === 'string') ticket.department = department;
    if (typeof assignedTo === 'string') ticket.assignedTo = assignedTo;
    if (typeof internalNote === 'string') ticket.internalNote = internalNote;

    await ticket.save();

    return res.json(ticket);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to update ticket' });
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
