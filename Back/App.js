const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const usersRoutes = require('./Routes/users');
const activitiesRoutes = require('./Routes/activities');
const itinerariesRoutes = require('./Routes/itineraries');
const museumsRoutes = require('./Routes/museums');
const historicalPlacesRoutes = require('./Routes/historicalPlaces');
const tagsRoutes = require('./Routes/tags');
const productsRoutes = require('./Routes/products');
const categoriesRoutes = require('./Routes/categories');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/museums', museumsRoutes);
app.use('/api/historicalPlaces', historicalPlacesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);



const PORT = process.env.PORT || 5000;
-
mongoose.connect(process.env.MONGO_URI)
	.then(() => { 
        app.listen(PORT, () => {
            console.log(`Connected to MongoDB & Server running on port ${PORT}`)
    })
    })
	.catch((error) => {
        console.log(error)
    })
