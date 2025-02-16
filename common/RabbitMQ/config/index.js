const dotenv = require('dotenv');
dotenv.config();
const amqp = require('amqplib');

let connection, channel;

const connectRabbitMQ = async () => {
    if(channel) return;
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const getChannel = async () => {
    if(!channel) {
        await connectRabbitMQ();
    }
    return channel;
};

module.exports = {
    connectRabbitMQ,
    getChannel
};