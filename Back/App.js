const express = require('express');
const app = express();
const userController = require('./Routes/userController');
require('dotenv').config();

app.use(express.json());
app.use('/api/users', userController);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));