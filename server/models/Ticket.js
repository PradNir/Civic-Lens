const mongoose = require('mongoose');

const DEPARTMENT_MAP = {
  Pothole: 'Public Works',
  'Broken Streetlight': 'Rolla Municipal Utilities',
  Graffiti: 'Community Development',
  Flooding: 'Environmental Services',
  'Damaged Sidewalk': 'Public Works',
  'Illegal Dumping': 'Environmental Services',
  'Noise Complaint': 'Police Department',
  Other: 'Community Development',
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
  department: { type: String, default: 'Unassigned' },
  assignedTo: { type: String, default: 'Unassigned' },
  internalNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  log: [logSchema],
});

ticketSchema.pre('save', function onSave() {
  if (this.category) {
    this.department = DEPARTMENT_MAP[this.category] || 'Community Development';
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
