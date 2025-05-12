require('dotenv').config();
const express = require('express');
const app = express();

const notFound = require('./middleware/notFound');
const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user/user');
// const todoRoutes = require('./routes/todos/todos');

// Global middleware
app.use(express.json());

app.use(logger);

// Routes
app.use('/', authRoutes);
app.use('/user', userRoutes);
// app.use('/todos', todoRoutes);

// 404 middleware
app.use(notFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The API is listening on port ${PORT}`)
});
