# Code Examples

## Back End

Here are some examples of the backend functionality in **Travelling Birds**. All examples follow a modular structure with models, controllers, and routes.

---

### **1. User Management**

#### **User Model**
The User model defines the structure and relationships for storing user information in MongoDB. All other models follow a similar structure.
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['tourist', 'admin', 'tour_guide'], 
        required: true 
    },
    profilePicture: { data: Buffer, contentType: String },
    loyaltyPoints: { type: Number, default: 0 },
    activityBookings: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
});

module.exports = mongoose.model('User', userSchema);
```

#### **Add User**
This endpoint creates a new user with password hashing and optional file uploads.
```javascript
const addUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            role 
        });

        if (req.files?.profilePicture) {
            newUser.profilePicture = {
                data: req.files.profilePicture[0].buffer,
                contentType: req.files.profilePicture[0].mimetype,
            };
        }

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

```

#### **Get All Users**
Retrieve all users stored in the database.
```javascript
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
```

#### **Login**
Authentication for logging in using username and password.
```javascript
const login = async (req, res) => {
	const {username, password} = req.body;

	try {
		const user = await User.findOne({username});
		if (!user) {
			return res.status(404).json({message: 'User not found. Please check the username.'});
		}
		if (!await bcrypt.compare(password, user.password)) {
			return res.status(401).json({message: 'Invalid password. Please try again.'});
		}
		if (['tour_guide', 'advertiser', 'seller'].includes(user.role) && user.isApproved === false) {
			return res.status(403).json({message: 'Profile not approved yet. Please wait for admin approval.'});
		}
		res.status(200).json({message: 'Login successful', user});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
```

### **2. Booking Management**
#### **Add activity booking**
This endpoint adds an activity booking to a user while updating loyalty and redeemable points.
```javascript
const addActivityBooking = async (req, res) => {
    const userId = req.params.id;
    const activityId = req.body.activityId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        user.activityBookings.push(activityId);
        user.loyaltyPoints += activity.price * 0.5;
        user.redeemablePoints += activity.price * 0.5;

        await user.save();
        res.status(200).json({ message: 'Activity booking added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

```

#### **Search and filter museums**
Here is an example of searching and filtering a list of museums.
```javascript
const SearchForMuseums = async (req, res) => {
	try {
		const {name, tags} = req.query; // Extract name and tags from query parameters

		if (!name && !tags) {
			return res.status(400).json({message: 'Name or tags are required to search for museums.'});
		}

		// Create a search query object
		const searchQuery = {};

		if (name) {
			// Use a case-insensitive regular expression for name search
			searchQuery.name = {$regex: name, $options: 'i'};
		}

		if (tags) {
			// Use $in to find museums where any of the provided tags match
			searchQuery.tags = {$in: tags.split(',')};
		}

		// Find museums matching the search criteria
		const museums = await MuseumModel.find(searchQuery);

		if (museums.length === 0) {
			return res.status(404).json({message: 'No museums found matching the search criteria.'});
		}

		return res.status(200).json(museums);
	} catch (error) {
		return res.status(500).json({message: 'An error occurred while searching for museums.', error});
	}
}


//filter museums by tag
const filterMuseums = async (req, res) => {
	try {
		const {tag} = req.query; // Extract tag from the query parameters

		if (!tag) {
			return res.status(400).json({message: 'Tag is required to filter museums.'});
		}

		// Find museums where the tags array contains the given tag
		const museums = await MuseumModel.find({tags: tag});

		if (museums.length === 0) {
			return res.status(404).json({message: 'No museums found with the given tag.'});
		}

		return res.status(200).json(museums);
	} catch (error) {
		return res.status(500).json({message: 'An error occurred while filtering museums.', error});
	}
}
```
### **3. Notifications**
#### **Send Mail**
This endpoint sends an email using Nodemailer and Gmail SMTP.
```javascript
const sendMail = async (req, res) => {
	const {email, subject, message} = req.body;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		}
	});

	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: email,
		subject: subject,
		text: message
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({message: 'Email sent successfully'});
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({message: 'Failed to send email', error});
	}
};
```
### **4. Hotel and Flight APIs**
#### **Hotel API**
This example integrates with the Amadeus API to search for hotels in a specified city.
```javascript
const hotel = require('../Services/amadeusService');

exports.searchHotels = async (req, res) => {
    const { cityCode, checkInDate, checkOutDate, adults, currencyCode } = req.body;
    try {
        const response = await hotel.shopping.hotelOffersSearch.get({
            cityCode,
            checkInDate,
            checkOutDate,
            adults,
            currencyCode: currencyCode || 'USD',
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

```

#### **Flight API**
This example integrates with the Amadeus API to search,get and book for flights.
```javascript
// Import the Amadeus flight service
const flight = require('../Services/amadeusService');

exports.searchFlights = async (req, res) => {
	const {origin, destination, departureDate, currencyCode} = req.body;
	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
			adults: "1",
			currencyCode: currencyCode || "EGP",
		});
		res.json(flightOffersResponse.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: error.description});
	}
};

exports.getFlightDetails = async (req, res) => {
	const {flightId} = req.params;
	const {origin, destination, departureDate, currencyCode} = req.params;

	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: origin,
			destinationLocationCode: destination,
			departureDate: departureDate,
			adults: "1",
			currencyCode: currencyCode || "EGP",
		});

		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightId);
		if (!selectedFlight) {
			return res.status(404).json({message: "Flight not found."});
		}

		const response = await flight.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers: [selectedFlight],
			},
		}, {
			include: "credit-card-fees,detailed-fare-rules"
		});

		res.json(response.data);
	} catch (error) {
		console.log(error);
		res.status(500).json({message: error.description});
	}
};

// Book Flight Controller
exports.bookFlight = async (req, res) => {
	const {flightDetails, travelerInfo} = req.body;
	try {
		const flightOffersResponse = await flight.shopping.flightOffersSearch.get({
			originLocationCode: flightDetails?.itineraries[0].segments[0].departure.iataCode,
			destinationLocationCode: flightDetails?.itineraries[0].segments[flightDetails?.itineraries[0].segments.length - 1].arrival.iataCode,
			departureDate: flightDetails?.itineraries[0].segments[0].departure.at.split('T')[0],
			adults: "1",
		});

		const selectedFlight = flightOffersResponse.data.find(flight => flight.id === flightDetails.id);
		if (!selectedFlight) {
			return res.status(404).json({message: "Flight not found."});
		}

		const pricingResponse = await flight.shopping.flightOffers.pricing.post({
			data: {
				type: "flight-offers-pricing",
				flightOffers: [selectedFlight],
			},
		});
		const bookingResponse = await flight.booking.flightOrders.post({
			data: {
				type: "flight-order",
				flightOffers: [pricingResponse.data.flightOffers[0]],
				travelers: [
					{
						id: "1",
						dateOfBirth: travelerInfo.dateOfBirth,
						name: {
							firstName: travelerInfo.name.firstName,
							lastName: travelerInfo.name.lastName
						},
						gender: travelerInfo.gender,
						contact: {
							emailAddress: travelerInfo.contact.emailAddress,
							phones: [
								{
									deviceType: "MOBILE",
									countryCallingCode: "20",
									number: travelerInfo.contact.phones[0].number
								}
							]
						},
						documents: [
							{
								documentType: "PASSPORT",
								birthPlace: travelerInfo.documents[0].birthPlace,
								issuanceLocation: travelerInfo.documents[0].issuanceLocation,
								issuanceDate: travelerInfo.documents[0].issuanceDate,
								number: travelerInfo.documents[0].number,
								expiryDate: travelerInfo.documents[0].expiryDate,
								issuanceCountry: travelerInfo.documents[0].issuanceCountry,
								validityCountry: travelerInfo.documents[0].validityCountry,
								nationality: travelerInfo.documents[0].nationality,
								holder: true
							}
						]
					}
				]
			},
		});
		res.status(200).json({
			message: "Booking confirmed!",
			bookingDetails: bookingResponse.data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({message: error.description || "An error occurred while booking the flight."});
	}
};
```
### **5. Add image**
#### **Add profile picture**
Here is an example of how to add an image to the database.
```javascript
// Handle setting profilePicture to null
		if (profilePicture === null || profilePicture === '') {
			updatedFields.profilePicture = null;
		}
// Update image data if a new file is uploaded
		if (req.files) {
			if (req.files.profilePicture) {
				updatedFields.profilePicture = {
					data: req.files.profilePicture[0].buffer,
					contentType: req.files.profilePicture[0].mimetype
				};
			}

// Update user (add upload.fields to route)
router.put('/:id', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'backDrop', maxCount: 1 }]), updateUser);
```
### **6. Add Route**
#### **Add a route**
Here’s an example of how routes are defined for user management.
```javascript
const express = require('express');
const router = express.Router();
const { addUser, getAllUsers } = require('../Controllers/UserControllers');

// Add User
router.post('/', addUser);

// Get All Users
router.get('/', getAllUsers);

module.exports = router;
```


## Front End:
