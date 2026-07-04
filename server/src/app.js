const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"
// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], // blocks inline JS
      styleSrc: ["'self'", "'unsafe-inline'"], // React inline styles
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:5000"], // API calls
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  })
);
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with production frontend URL
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ]
  })
);
app.use(express.json());
app.disable('x-powered-by');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);



module.exports = app;
