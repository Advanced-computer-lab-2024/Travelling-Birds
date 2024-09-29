const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userController = require('./Routes/userController');
const activitiesroutes = require('./Routes/activities');
require('dotenv').config();

app.use(express.json());
app.use('/api/users', userController);
app.use('/api/activities', activitiesroutes); 

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
	.then(() => { 
        app.listen(PORT, () => {
            console.log(`Connected to MongoDB & Server running on port ${PORT}`)
    })
    })
	.catch((error) => {
        console.log(error)
    })
