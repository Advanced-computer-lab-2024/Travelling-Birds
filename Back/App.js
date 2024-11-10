const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const usersRoutes = require('./Routes/UserRoutes');
const activitiesRoutes = require('./Routes/ActivityRoutes');
const itinerariesRoutes = require('./Routes/ItineraryRoutes');
const museumsRoutes = require('./Routes/MuseumRoutes');
const historicalPlacesRoutes = require('./Routes/HistoricalPlaceRoutes');
const tagsRoutes = require('./Routes/TagRoutes');
const productsRoutes = require('./Routes/ProductRoutes');
const categoriesRoutes = require('./Routes/CategoryRoutes');
const complaintRoutes = require('./Routes/ComplaintRoutes');
const flightRoutes = require('./routes/FlightRoutes');
const hotelRouter = require('./Routes/HotelRoutes');
const TransportRoutes = require('./Routes/TransportationRoutes');
const emailroutes = require('./Routes/EmailRoutes');
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', usersRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/museums', museumsRoutes);
app.use('/api/historicalPlaces', historicalPlacesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRouter);
app.use('/api/transports', TransportRoutes);
app.use('/api/email', emailroutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

