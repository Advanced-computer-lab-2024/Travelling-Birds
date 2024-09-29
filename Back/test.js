require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

async function run() {
	try {
		// Create a Mongoose client with a MongoClientOptions object to set the Stable API version
		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ping: 1});
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		await mongoose.disconnect();
	}
}

app.use(express.json());

app.listen(3000, () => console.log('Listening to requests on http://localhost:3000'));


run().catch(console.dir);