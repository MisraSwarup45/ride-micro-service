const app = require('./app');

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Rabbit MQ Server is running on port ${PORT}`);
});