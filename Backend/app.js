require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Job Portal API is running');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const jobRoutes = require('./routes/job');
app.use('/api/job', jobRoutes);

const applicationRoutes = require('./routes/application');
app.use('/api/application', applicationRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}); 