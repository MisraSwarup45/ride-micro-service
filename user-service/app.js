const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(helmet());


app.use('/', userRoutes);


module.exports = app;