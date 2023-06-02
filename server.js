const express = require('express');
const server = express();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

//Image serving
server.use('/uploads', express.static('uploads'));

//ENV constants
const PORT = process.env.PORT || 5000;

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_URL = process.env.DB_URL;
const DB_CONNECT_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_URL}?retryWrites=true&w=majority`;

//Database
mongoose.connect(DB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Sucessfully connected to the MongoDB database');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

//Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    // cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({storage: storage});

server.listen(PORT, () => {
  console.log(`Travacka2 API is listening on port ${PORT}`);
});
