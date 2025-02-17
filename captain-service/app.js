const express = require('express');
const cors = require('cors');
const app = express();
const captainRouter = require('./routes/captainRoutes');
const connectDB = require('./config/db');


app.use(express.json());
app.use(cors());

connectDB();

app.use('/', captainRouter);

module.exports = app;