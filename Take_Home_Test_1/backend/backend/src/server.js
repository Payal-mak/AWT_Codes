const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./infrastructure/logging/logger');

const authRoutes = require('./presentation/routes/authRoutes');
const bookRoutes = require('./presentation/routes/bookRoutes');
// Add other routes here

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
