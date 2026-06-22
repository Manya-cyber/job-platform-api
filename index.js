const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
require('./db');

const app = express();

app.use(express.json());

// Routes

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userProfileRoutes = require('./routes/users');
const bookmarks = require('./routes/bookmarks');
const scraperRoutes = require('./routes/scraper');


app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/users',userProfileRoutes);
app.use('/bookmarks',bookmarks);
app.use('/scraper', scraperRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});