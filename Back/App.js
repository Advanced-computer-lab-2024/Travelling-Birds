const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRoutes = require('./Routes/users');
const activitiesRoutes = require('./Routes/activities');
const itineraryRoutes = require('./Routes/itineraries');
const museumsRoutes = require('./Routes/museums');
const historicalPlacesRoutes = require('./Routes/historicalPlaces');
const tagsRoutes = require('./Routes/tags');
const productRoutes = require('./Routes/product');
require('dotenv').config();

app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/museums', museumsRoutes);
app.use('/api/historicalPlaces', historicalPlacesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/products', productRoutes);


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
