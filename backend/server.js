const express = require('express');
const cors = require('cors');
const Todo = require('./database');
const authRoutes = require('./routes/auth');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRoutes);

// All todo routes require a valid JWT
app.use('/api/todos', authMiddleware);

// Get all todos for the logged-in user
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ _id: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const newTodo = new Todo({ text, completed: completed || false, userId: req.userId });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo (only if it belongs to the user)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { text, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo (only if it belongs to the user)
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
