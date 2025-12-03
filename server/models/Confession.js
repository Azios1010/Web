const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  reactions: {
    like: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    wow: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Confession', confessionSchema);
