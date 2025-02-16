const getChannel = require('../config/index').getChannel;

const publishMessage = async (req, res) => {
    
    const { queue, message } = req.body;
    try{
        const channel = await getChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to queue ${queue}: ${message}`);
        res.status(200).json({ message: `Message sent to queue ${queue}: ${message}` });
    }catch(error){
        console.error('Error publishing to queue:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


const subscribeMessage = async (req, res) => {
    const { queue } = req.body;
    try{
        const channel = await getChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(`Message received from queue ${queue}: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });
        console.log(`Subscribed to queue ${queue}`);
        res.status(200).json({ message: `Subscribed to queue ${queue}` });
    }catch(error){
        console.error('Error subscribing to queue:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    publishMessage,
    subscribeMessage
};