const express = require('express');
const expressProxy = require('express-http-proxy');

const app = express();

app.use('/api/users', expressProxy('http://localhost:3001'));
app.use('/api/captain', expressProxy('http://localhost:3002'));
app.use('/api/ride', expressProxy('http://localhost:3003'));
app.use('/api/rabbitmq', expressProxy('http://localhost:3004'));


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Gateway is running on port ${port}`);
});