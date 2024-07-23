const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwtVerify = require('./auth');
const jwt = require("jsonwebtoken");

// Create a new user
router.post('/create', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userDetail = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json(userDetail);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {

  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        email,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

// Get all users
router.get('/read', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/readOne', jwtVerify, async (req, res) => {

    try {
      const users = await User.findById(req.id);
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.put('/update', jwtVerify, async(req, res)=> {
    const { username, email, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    };

    // Update the fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete', jwtVerify, async(req, res)=> {

    const del = await User.findByIdAndDelete(req.id);
    res.json(del);
});

module.exports = router;