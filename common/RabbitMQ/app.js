const express = require('express');
const {connectRabbitMQ} = require('./config/index');

const rabbitmdqRoutes = require('./routes/rabbitmqRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

connectRabbitMQ();


app.use('/', rabbitmdqRoutes);

module.exports = app;