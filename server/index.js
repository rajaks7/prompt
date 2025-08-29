// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
const toolRoutes = require('./routes/tools');
app.use('/api/tools', toolRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const typeRoutes = require('./routes/types');
app.use('/api/types', typeRoutes);

const sourceRoutes = require('./routes/sources');
app.use('/api/sources', sourceRoutes);

const promptRoutes = require('./routes/prompts');
app.use('/api/prompts', promptRoutes);

const statsRoutes = require('./routes/stats'); // <-- NEW
app.use('/api/stats', statsRoutes);           // <-- NEW

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the R Prompt Manager API!" });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});