const express = require('express');
const cors = require('cors');
const app = express();
const captainRouter = require('./routes/captainRoutes');
const connectDB = require('./config/db');
const rabbit = require('./service/rabbit');


app.use(express.json());
app.use(cors());

connectDB();
rabbit.connectRabbitMQ();

app.use('/', captainRouter);

module.exports = app;