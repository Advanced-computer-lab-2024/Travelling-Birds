const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersroutes = require('./Routes/users');
const activitiesroutes = require('./Routes/activities');
const itineraryroutes = require('./Routes/itineraries');
const museumsroutes = require('./Routes/museums');
const historicalplacesroutes = require('./Routes/historicalplaces');
require('dotenv').config();

app.use(express.json());
app.use('/api/users', usersroutes);
app.use('/api/activities', activitiesroutes); 
app.use('/api/itineraries', itineraryroutes);
app.use('/api/museums', museumsroutes);
app.use('/api/historicalplaces', historicalplacesroutes);

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
