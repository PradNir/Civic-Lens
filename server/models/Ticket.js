const mongoose = require('mongoose');

const DEPARTMENT_MAP = {
  Pothole: 'Roads & Transport',
  'Broken Streetlight': 'Utilities',
  Graffiti: 'Public Works',
  Flooding: 'Stormwater Management',
  'Damaged Sidewalk': 'Roads & Transport',
  'Illegal Dumping': 'Sanitation',
  'Noise Complaint': 'Public Safety',
  Other: 'General Services',
};

const logSchema = new mongoose.Schema({
  message: { type: String },
  by: { type: String },
  time: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  userId: { type: String },
  description: { type: String, required: true },
  category: { type: String },
  photoUrl: { type: String },
  location: { type: String },
  status: { type: String, default: 'Open' },
  priority: { type: String, default: 'Medium' },
  department: { type: String },
  createdAt: { type: Date, default: Date.now },
  log: [logSchema],
});

ticketSchema.pre('save', function onSave() {
  if (this.category) {
    this.department = DEPARTMENT_MAP[this.category] || 'General Services';
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
