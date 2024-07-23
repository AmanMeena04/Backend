// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Users = require('./controllers/user');
const Project = require('./controllers/project');
const cookieParser = require("cookie-parser");
 
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 8000;

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/user', Users);
app.use('/project', Project);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
