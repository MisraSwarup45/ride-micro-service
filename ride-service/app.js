const express = require('express');
const cors = require('cors');
const rideRoutes = require('./routes/rideRoutes');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/', rideRoutes);


module.exports = app;