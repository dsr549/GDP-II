const express = require('express');
const path = require('path');
const authRoutes = require('./src/routes/auth');
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'public'))); // Add this line
app.listen(3000, () => console.log('Server is running on port 3000'));