require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('🔍 Using URI:', process.env.MONGO_URI ? 'Found' : 'NOT FOUND');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('❌ Check your .env file and MongoDB Atlas settings');
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  workouts: [{
    name: String,
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      completed: Boolean
    }]
  }],
  meals: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// MongoDB is now enabled - no need for in-memory storage

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/register', async (req, res) => {
  try {
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user in MongoDB
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      workouts: [],
      meals: []
    });
    
    const savedUser = await newUser.save();
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    // Find user in MongoDB
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In production, use bcrypt.compare() for hashed passwords
    if (req.body.password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all users (for debugging - remove in production)
app.get('/api/users', async (req, res) => {
  try {
    console.log('🔍 Fetching all users from database...');
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    console.log(`📊 Found ${users.length} users in database`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// Add workout to user
app.post('/api/users/:userId/workouts', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.workouts.push(req.body);
    await user.save();
    
    res.json({ message: 'Workout added successfully', workout: req.body });
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ error: 'Server error while adding workout' });
  }
});

// Add meal to user
app.post('/api/users/:userId/meals', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.meals.push(req.body);
    await user.save();
    
    res.json({ message: 'Meal added successfully', meal: req.body });
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ error: 'Server error while adding meal' });
  }
});

// Get user data
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;