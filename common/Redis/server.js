const express = require('express');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

app.use(express.json());
app.use('/', locationRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Redis Server is running on port ${PORT}`);
});