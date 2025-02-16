const dotenv = require('dotenv');
dotenv.config();
const amqp = require('amqplib');

let connection, channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const publishToQueue = async (queue, message) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to queue ${queue}: ${message}`);
    } catch (error) {
        console.error('Error publishing to queue:', error);
    }
};

const subscribeToQueue = async (queue, callback) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                channel.ack(msg);
            }
        });
        console.log(`Subscribed to queue ${queue}`);
    } catch (error) {
        console.error('Error subscribing to queue:', error);
    }
};

module.exports = {
    connectRabbitMQ,
    publishToQueue,
    subscribeToQueue
};