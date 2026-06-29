const mongoose = require('mongoose');

// Connect to local MongoDB instance
mongoose.connect('mongodb://127.0.0.1:27017/todolist')
  .then(() => console.log('Connected to MongoDB database'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the Todo Schema
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
