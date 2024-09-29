const express = require('express');
const app = express();
const userController = require('./Routes/userController');
const activitiesroutes = require('./Routes/activities');
require('dotenv').config();

app.use(express.json());
app.use('/api/users', userController);
app.use('/api/activities', activitiesroutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));