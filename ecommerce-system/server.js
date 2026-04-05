const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

const config = require('./config/config');

//initialize express
const app = express();

//apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

//static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//load json data
const loadJSON = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath));
};
app.locals.products = loadJSON(config.PRODUCTS_FILE);
app.locals.users = loadJSON(config.USERS_FILE);
app.locals.orders = loadJSON(config.ORDERS_FILE);
app.locals.carts = loadJSON(config.CARTS_FILE);

//mount routers
// app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/products', require('./routes/productsRouter'));
// app.use('/api/orders', require('./routes/ordersRouter'));
// app.use('/api/carts', require('./routes/cartsRouter'));

//404 error handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

//global error handler
const { globalLimiter } = require('./middleware/rateLimiter');

app.use(globalLimiter);

//start server
app.listen(config.PORT, () => {
  console.log(`Server running on port http://localhost:${config.PORT}`);
});