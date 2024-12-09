# API References
## User Model API Documentation

### Routes:

### POST /api/users
- **Description**: Add a new user.
- **Controller**: `addUser`
- **Request Body**:
 ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "string",
    "profilePicture": "file",
    "backDrop": "file"
  }
  ```
- **Response**: `{ message: 'User added successfully', data: userObject }` or `{ error: 'Error message' }`

### GET /api/users
- **Description**: Get all users.
- **Controller**: `getAllUsers`
- **Response**: `{ [userObjects] }` or `{ error: 'Error message' }`

### GET /api/users/:id
- **Description**: Get a specific user by ID.
- **Controller**: `getUser`
- **Response**: `{ userObject }` or `{ message: 'User not found' }`

### PUT /api/users/:id
- **Description**: Update a user's details.
- **Controller**: `updateUser`
- **Request Body**:
 ```json
  {
  "username": "string",
  "email": "string",
  "password": "string",
  "profilePicture": "file",
  "backDrop": "file"
  }
  ```
- **Response**: `{ updatedUserObject }` or `{ message: 'User not found' }`

### DELETE /api/users/:id
- **Description**: Delete a user by ID.
- **Controller**: `deleteUser`
- **Response**: `{ message: 'User deleted successfully' }`

### POST /api/users/login
- **Description**: User login.
- **Controller**: `login`
- **Request Body**:
```json
  {
  "email": "string",
  "password": "string"
  }
  ```
- **Response**: `{ message: 'Login successful', user: userObject }` or `{ message: 'User not found' }`

### GET /api/users/approved
- **Description**: Get approved users.
- **Controller**: `getApprovedUsers`
- **Response**: `{ [userObjects] }`

### GET /api/users/unapproved
- **Description**: Get unapproved users.
- **Controller**: `getUnapprovedUsers`
- **Response**: `{ [userObjects] }`

### GET /api/users/documents/:id
- **Description**: Get user documents.
- **Controller**: `getUserDocuments`
- **Response**: `{ "documents": "array" }`

### PUT /api/users/requestDelete/:id
- **Description**: Request user deletion.
- **Controller**: `requestDelete`
- **Response**: `{ message: 'User marked for deletion' }` or `{ message: 'User not found' }`

### GET /api/users/toDelete
- **Description**: Get users marked for deletion.
- **Controller**: `getUsersToDelete`
- **Response**: `{ [roleName]: [userObjects] }`

### POST /api/users/activity-booking/:id
- **Description**: Add activity booking to user.
- **Controller**: `addActivityBooking`
- **Request Body**:
```json
  {
  "activityId": "string"
  }
  ```
- **Response**: `{ message: 'Activity booking added successfully' }`

### GET /api/users/activity-bookings/:id
- **Description**: Get activity bookings for user.
- **Controller**: `getActivityBookings`
- **Response**: `{ [activityObjects] }`

### DELETE /api/users/activity-booking/:id
- **Description**: Remove activity booking from user.
- **Controller**: `removeActivityBooking`
- **Request Body**:
```json
  {
  "activityId": "string"
  }
  ```
- **Response**: `{ message: 'Activity booking removed successfully' }`

### POST /api/users/itinerary-booking/:id
- **Description**: Add itinerary booking to user.
- **Controller**: `addItineraryBooking`
- **Request Body**:
```json
  {
  "itineraryId": "string"
  }
  ```
- **Response**: `{ message: 'Itinerary booking added successfully' }`

### GET /api/users/itinerary-bookings/:id
- **Description**: Get itinerary bookings for user.
- **Controller**: `getItineraryBookings`
- **Response**: `{ [itineraryObjects] }`

### DELETE /api/users/itinerary-booking/:id
- **Description**: Remove itinerary booking from user.
- **Controller**: `removeItineraryBooking`
- **Request Body**:
```json
  {
  "itineraryId": "string"
  }
  ```
- **Response**: `{ message: 'Itinerary booking removed successfully' }`

### POST /api/users/product-purchase/:id
- **Description**: Add product purchase to user.
- **Controller**: `addProductPurchase`
- **Request Body**:
```json
  {
  "productId": "string"
  }
  ```
- **Response**: `{ message: 'Product purchase added successfully' }`

### GET /api/users/product-purchases/:id
- **Description**: Get product purchases for user.
- **Controller**: `getProductPurchases`
- **Response**: `{ [productObjects] }`

### DELETE /api/users/product-purchase/:id
- **Description**: Remove product purchase from user.
- **Controller**: `removeProductPurchase`
- **Request Body**:
```json
  {
  "productId": "string"
  }
  ```
- **Response**: `{ message: 'Product purchase removed successfully' }`

### POST /api/users/:id/comments
- **Description**: Add a comment to a specific user (e.g., tour guide).
- **Controller**: `addComment`
- **Request Body**:
```json
  {
  "user": "string",
  "text": "string",
  "stars": "number"
  }
  ```
- **Response**: `{ message: 'Comment added successfully', userWithComment }`

### GET /api/users/:id/comments
- **Description**: Get all comments for a specific user.
- **Controller**: `getComments`
- **Response**: `{ [commentObjects] }`

### GET /api/users/username
- **Description**: Get a specific user using username.
- **Controller**: `getUsername`
- **Request Body**:
```json
  {
  "username": "string",
  }
  ```
- **Response**: `{ userObject }` or `{ message: 'User not found' }`

## Transportation Model API Documentation

### Routes:
### POST /api/transportations
- **Description**: Add a new transportation.
- **Controller**: `addTransportation`
- **Request Body**:
```json
  {
    "name": "string",
    "createdBy": "string"
  }
  ```
- **Response**: `{ transportationObject }` or `{ error: 'Error message' }`

### GET /api/transportations
- **Description**: Get all transportations.
- **Controller**: `getAllTransportations`
- **Response**: `{ [transportationObject] }` or `{ error: 'Error message' }`

### GET /api/transportations/:id
- **Description**: Get a specific transportation.
- **Controller**: `getTransportation`
- **Response**: `{ transportationObject }` or `{ error: 'Error message' }` or `{ "message": "Transportation not found" }`

### PUT /api/transportations/:id
- **Description**: Update a specific transportation.
- **Controller**: `updateTransportation`
- **Request Body**:
```json
  {
    "name": "string",
    "createdBy": "string"
  }
  ```
- **Response**: `{ transportationObject }` or `{ error: 'Error message' }`

### DELETE /api/transportations/:id
- **Description**: Delete a specific transportation.
- **Controller**: `deleteTransportation`
- **Response**: `{ "msg": "Transportation deleted successfully" }` or `{ error: 'Error message' }`

## Tag Model API Documentation

### Routes:
### POST /api/tags
- **Description**: Add a new tag.
- **Controller**: `addTag`
- **Request Body**:
```json
  {
   "name": "string"
  }
  ```
- **Response**: `{ tagObject }` or `{ error: 'Error message' }`

### GET /api/tags
- **Description**: Get all tags.
- **Controller**: `getAllTags`
- **Response**: `{ [tagObject] }` or `{ error: 'Error message' }`

### GET /api/tags/:id
- **Description**: Get a specific tag.
- **Controller**: `getTag`
- **Response**: `{ tagObject }` or `{ error: 'Error message' }` or `{ "message": "Tag not found" }`

### PUT /api/tags/:id
- **Description**: Update a specific tag.
- **Controller**: `updateTag`
- **Request Body**:
```json
  {
   "name": "string"
  }
  ```
- **Response**: `{ tagObject }` or `{ error: 'Error message' }`

### DELETE /api/tags/:id
- **Description**: Delete a specific tag.
- **Controller**: `deleteTag`
- **Response**: `{ "msg": "Tag deleted successfully"  }` or `{ error: 'Error message' }`

## Product Model API Documentation

### Routes:

### POST /api/products
- **Description**: Add a new product.
- **Controller**: `addProduct`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "availableQuantity": "number",
    "seller": "string",
    "ratings": "array of numbers",
    "reviews": "array of objectIds",
    "picture": "file"
  }
  ```
- **Response**: `{ productObject }` or `{ error: 'Error message' }`

### GET /api/products
- **Description**: Get all products.
- **Controller**: `getAllProducts`
- **Response**: `{ [productObject] }` or `{ error: 'Error message' }`

### GET /api/products/admin
- **Description**:  Get all products for admin.
- **Controller**: `getProductsAdmin`
- **Response**: `{ [productObject] }` or `{ error: 'Error message' }`

### GET /api/products/picture/:id
- **Description**: Get the picture of a specific product.
- **Controller**: `getProductPicture`
- **Response**: `{ productObject }` or `{ "message": "Product not found" }`

### GET /api/products/search
- **Description**: Search for products by name.
- **Controller**: `searchProducts`
- **Query Params**: name: "string"
- **Response**: `{ [productObject] }` or `{  "message": "No Products Found With This Name" }`

### GET /api/products/filter
- **Description**: Filter products by max price.
- **Controller**: `filterProducts`
- **Query Params**: maxPrice: "number"
- **Response**: `{ [productObject] }` or `{ "message": "No Products Found Within This Specified Price" }`

### GET /api/products/sort
- **Description**: Sort products by average rating.
- **Controller**: `sortProductsByRating`
- **Query Params**: productsOrder: "asc" or "desc"
- **Response**: `{ [productObject] }` or `{ "message": "Product not found" }`

### GET /api/products/:id
- **Description**: Get a specific product by ID.
- **Controller**: `getProduct`
- **Response**: `{ productObject }` or `{ "message": "Product not found" }`

### PUT /api/products/:id
- **Description**: Update a specific product by ID.
- **Controller**: `updateProduct`
- **Request Body**:
```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "availableQuantity": "number",
    "seller": "string",
    "ratings": "array of numbers",
    "reviews": "array of objectIds",
    "isArchived": "boolean",
    "picture": "file"
  }
  ```
- **Response**: `{ productObject }` or `{ "message": "Product not found" }`

### DELETE /api/products/:id
- **Description**: Delete a specific product by ID.
- **Controller**: `deleteProduct`
- **Response**: `{ "message": "Product deleted successfully" }` or `{ "message": "Product not found" }`

### GET /api/products/:id/comments
- **Description**: Get comments of a specific product.
- **Controller**: `getComments`
- **Response**: `{ commentObject }` or `{ "message": "Product not found" }`

### POST /api/products/:id/comments
- **Description**: Create a comment for a specific product.
- **Controller**: `addComment`
- **Request Body**:
```json
  {
  "user": "userId",
  "text": "string",
  "stars": "number"
}
  ```
- **Response**: `{ productObject }` or `{ "message": "Product not found" }` or `{ "message": "User not found" }` or `{ "message": "User must purchase the product before commenting" }`

## Museum Model API Documentation

### Routes:

### POST /api/museums
- **Description**: Add a new museum.
- **Controller**: `addMuseum`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "openingHours": {
      "startTime": "string (HH:MM:SS)",
      "endTime": "string (HH:MM:SS)"
    },
    "location": "string",
    "ticketPrices": "object (key-value pairs of ticket categories and prices)",
    "tags": "array of strings",
    "activities": "array of activity objects",
    "createdBy": "userId"
  }
  ```
- **Response**: `{ museumObject }` or `{ error: 'Error message' }`

### GET /api/museums
- **Description**: Get all museums.
- **Controller**: `getAllMuseums`
- **Response**: `{ [museumObject] }` or `{ error: 'Error message' }`

### GET /api/museums/brief
- **Description**: Get all museums with brief details (name, description, tags, location, createdBy).
- **Controller**: `getAllMuseumsBrief`
- **Response**: `{ [museumObject] }` or `{ error: 'Error message' }`

### GET /api/museums/brief/:id
- **Description**: Get all museums with brief details for a specific user.
- **Controller**: `getAllMuseumsBriefForUser`
- **Response**: `{ [museumObject] }` or `{ error: 'Error message' }`

### GET /api/museums/search
- **Description**: Search for museums by name or tag.
- **Controller**: `SearchForMuseums`
- **Query Params**: name: "string" , tags: "comma-separated tags"
- **Response**: `{ [museumObject] }` or `{ "message": "No museums found matching the search criteria" }`

### GET /api/museums/filter
- **Description**: Filter museums by a specific tag.
- **Controller**: `filterMuseums`
- **Query Params**: tags: "string"
- **Response**: `{ [museumObject] }` or `{ "message": "No museums found with the given tag" }`

### GET /api/museums/:id
- **Description**: Get a specific museum by ID.
- **Controller**: `getMuseum`
- **Response**: `{ museumObject }` or `{ "message": "Museum not found" }`

### PUT /api/museums/:id
- **Description**: Update a specific museum by ID.
- **Controller**: `updateMuseum`
- **Request Body**:
  ```json
  {
  "name": "string",
  "description": "string",
  "openingHours": {
    "startTime": "string (HH:MM:SS)",
    "endTime": "string (HH:MM:SS)"
  },
  "location": "string",
  "ticketPrices": "object (key-value pairs of ticket categories and prices)",
  "tags": "array of strings",
  "activities": "array of activity objects",
  "createdBy": "userId"
  }```
- **Response**: `{ museumObject }` or `{ "message": "Museum not found" }`

### DELETE /api/museums/:id
- **Description**: Delete a specific museum by ID.
- **Controller**: `deleteMuseum`
- **Response**: `{ "message": "Museum deleted successfully" }` or `{ "message": "Museum not found" }`

### GET /api/museums/user/:id
- **Description**: Get all museums created by a specific user.
- **Controller**: `getAllCreatedMuseums`
- **Response**: `{ [museumObject] }` or `{ "message": "Museum not found" }`

## Mail Model API Documentation

### Routes:
### POST /api/itinerary
- **Description**: Add a new itinerary.
- **Controller**: `addItinerary`
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "activities": "string (comma-separated activity IDs)",
    "locations": "string",
    "language": "string",
    "preferences": "string",
    "price": "number",
    "availableDates": "array of dates (ISO 8601 format)",
    "accessibility": "string",
    "pickupLocation": "string",
    "dropoffLocation": "string",
    "createdBy": "user ID"
  }
  ```
- **Response**: `{ itineraryObject }` or `{ "message": "error message" }`

### GET /api/itinerary
- **Description**: Get all itineraries.
- **Controller**: `getAllItineraries`
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GET /api/itinerary/brief
- **Description**:  Get brief information (title, description, language, price, etc.) of all itineraries.
- **Controller**: `getItineraryBrief`
- **Response**: `{ [itineraryObject] , createdBy }` or `{ "message": "error message" }`

### GET /api/itinerary/brief/:id
- **Description**: Get brief information of itineraries created by a specific user.
- **Controller**: `getItineraryBriefForUser`
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GGET /api/itinerary/search
- **Description**: Search for itineraries by category or tag.
- **Controller**: `SearchForItinerary`
- **Query Params**: category: (optional) Category to search by , tags: (optional) Comma-separated list of tags to search by
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GET /api/itinerary/upcoming
- **Description**: Get upcoming itineraries (where availableDates are in the future).
- **Controller**: `getUpcomingItineraries`
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GET /api/itinerary/sort
- **Description**: Sort itineraries by price or rating
- **Controller**: `sortItineraries`
- **Query Params**: sortBy: (required) "price" or "rating"
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GET /api/itinerary/filter
- **Description**: Filter itineraries by budget, date, preferences, and language
- **Controller**: `filterItineraries`
- **Query Params**: price: (optional) Maximum price to filter by, date: (optional) Specific date to filter itineraries, language: (optional) Language filter, preferences: (optional) Preferences filter
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GET /api/itinerary/:id
- **Description**: Get a specific itinerary by ID.
- **Controller**: `getItinerary`
- **Response**: `{ itineraryObject }` or `{ "message": "error message" }`

### PUT /api/itinerary/:id
- **Description**: Update an existing itinerary by ID.
- **Controller**: `updateItinerary`
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "activities": "string (comma-separated activity IDs)",
    "locations": "string",
    "language": "string",
    "preferences": "string",
    "price": "number",
    "availableDates": "array of dates (ISO 8601 format)",
    "accessibility": "string",
    "pickupLocation": "string",
    "dropoffLocation": "string",
    "createdBy": "user ID"
  }
  ```
- **Response**: `{ itineraryObject }` or `{ "message": "error message" }`

### DELETE /api/itinerary/:id
- **Description**: Delete an itinerary by ID.
- **Controller**: `deleteItinerary `
- **Response**: `{ "message": "Itinerary deleted successfully" }` or `{ "message": "error message" }`

### GET /api/itinerary/user/:id
- **Description**: Get all itineraries created by a specific user.
- **Controller**: `getAllCreatedItineraries`
- **Response**: `{ [itineraryObject] }` or `{ "message": "error message" }`

### GET /api/itinerary/:id/comments
- **Description**: Get all comments for a specific itinerary.
- **Controller**: `getComments`
- **Response**: `{ [commentObjects] }` or `{ "message": "error message" }`

### POST /api/itinerary/:id/comments
- **Description**: Add a comment to a specific itinerary.
- **Controller**: `addComment`
- **Request Body**:
  ```json
  {
    "user": "userId",
  "text": "string",
  "stars": "number (1 to 5)"
  }
  ```
- **Response**: `{ itineraryObject  }` or `{ "message": "error message" }`

### GET /api/itinerary/:id/activities
- **Description**:  Get all activities for a specific itinerary.
- **Controller**: `getActivities`
- **Response**: `{ [activityObjects] }` or `{ "message": "error message" }`

## Historical Museum Model API Documentation

### Routes:

### POST /api/historicalPlace
- **Description**: Add a new historical place.
- **Controller**: `addHistoricalPlace`
- **Request Body**:
 ```json
  {
    "name": "string",
  "description": "string",
  "openingHours": "string (JSON formatted with startTime and endTime)",
  "location": "string",
  "ticketPrices": "number",
  "tags": "array of strings",
  "activities": "string (comma-separated activity IDs)",
  "createdBy": "user ID"
  }
  ```
- **Response**: `{ historicalPlaceObject }` or `{ error: 'Error message' }`

### GET /api/historicalPlace
- **Description**: Get all historical places.
- **Controller**: `getAllHistoricalPlaces`
- **Response**: `{ [historicalPlaceObject] }` or `{ error: 'Error message' }`

### GET /api/historicalPlace/brief
- **Description**: Get all historical places with brief details.
- **Controller**: `getHistoricalPlacesBrief`
- **Response**: `{ [historicalPlaceObject] }` or `{ error: 'Error message' }`

### GET /api/historicalPlace/brief/:id
- **Description**: Get brief details of all historical places created by a specific user.
- **Controller**: `getHistoricalPlaceBriefForUser`
- **Response**: `{ [historicalPlaceObject] }` or `{ error: 'Error message' }`

### GET /api/historicalPlace/search
- **Description**: Search for historical places by name or tag.
- **Controller**: `SearchForHistoricalPlace`
- **Query Params**: name: (optional) Name of the historical place to search for, tags: (optional) Tags associated with the historical place (comma-separated).
- **Response**: `{ [historicalPlaceObject] }` or `{ error: 'Error message' }`

### GET /api/historicalPlace/filter
- **Description**:  Filter historical places by tag.
- **Controller**: `filterHistoricalPlaces`
- **Query Params**: tag: (required) Tag to filter historical places by
- **Response**: `{ [historicalPlaceObject] }` or `{ error: 'Error message' }`

### GET /api/historicalPlace/:id
- **Description**: Get a specific historical place by ID.
- **Controller**: `getHistoricalPlace`
- **Response**: `{ historicalPlaceObject }` or `{ error: 'Error message' }`

### PUT /api/historicalPlace/:id
- **Description**: Description: Update an existing historical place by ID.
- **Controller**: `updateHistoricalPlace`
- **Request Body**:
 ```json
  {
    "name": "string",
  "description": "string",
  "openingHours": "string (JSON formatted with startTime and endTime)",
  "location": "string",
  "ticketPrices": "number",
  "tags": "array of strings",
  "activities": "string (comma-separated activity IDs)",
  "createdBy": "user ID"
  }
  ```
- **Response**: `{ historicalPlaceObject }` or `{ error: 'Error message' }`

### DELETE /api/historicalPlace/:id
- **Description**: Delete a historical place by ID.
- **Controller**: `deleteHistoricalPlace`
- **Response**: `{ "message": "Historical Place deleted successfully" }` or `{ error: 'Error message' }`

### GET /api/historicalPlace/user/:id
- **Description**: Get all historical places created by a specific user.
- **Controller**: `getAllCreatedHistoricalPlaces`
- **Response**: `{ [historicalPlaceObject] }` or `{ error: 'Error message' }`

## Complaint Model API Documentation

### Routes:

### POST /api/complaints
- **Description**: Add a new complaint.
- **Controller**: `addComplaint`
- **Request Body**:
 ```json
  {
    "title": "string",
  "body": "string",
  "createdBy": "user ID"
  }
  ```
- **Response**: `{ complaintObject  }` or `{ error: 'Error message' }`

### GET /api/complaints
- **Description**:  Get all complaints.
- **Controller**: `getAllComplaints`
- **Response**: `{ [complaintObject]  }` or `{ error: 'Error message' }`

### GET /api/complaints/filter
- **Description**:  Filter complaints by status.
- **Controller**: `filterComplaint`
- **Query Params**: status: (required) Status of the complaint
- **Response**: `{ [complaintObject]  }` or `{ error: 'Error message' }`

### GET /api/complaints/sort
- **Description**:   Sort complaints by date.
- **Controller**: `sortComplaint`
- **Response**: `{ [complaintObject]  }` or `{ error: 'Error message' }`

### GET /api/complaints/user/:id
- **Description**: Get all complaints created by a specific user.
- **Controller**: `getAllCreatedComplaints`
- **Response**: `{ [complaintObject]  }` or `{ error: 'Error message' }`

### PUT /api/complaints/:id
- **Description**:  Update an existing complaint by ID.
- **Controller**: `updateComplaint`
- **Request Body**:
 ```json
  {
  "title": "string",
  "body": "string",
  "status": "string (e.g., 'Pending', 'Resolved')",
  "reply": "string"
  }
  ```
- **Response**: `{ complaintObject  }` or `{ error: 'Error message' }`

### DELETE /api/complaints/:id
- **Description**:  Delete a complaint by ID.
- **Controller**: `deleteComplaint`
- **Response**: `{ message": "Complaint deleted successfully"  }` or `{ error: 'Error message' }`

## Category Model API Documentation

### Routes:

### POST /api/categories
- **Description**: Add a new category.
- **Controller**: `addCategory`
- **Request Body**:
 ```json
  {
    "name": "string"
  }
  ```
- **Response**: `{ categoryObject  }` or `{ error: 'Error message' }`


### GET /api/categories
- **Description**: Get all categories.
- **Controller**: `getAllCategories`
- **Response**: `{ [categoryObject] }` or `{ error: 'Error message' }`

### GET /api/categories/:id
- **Description**: Get a specific category by ID.
- **Controller**: `getCategory`
- **Response**: `{ categoryObject }` or `{ error: 'Error message' }`

### PUT /api/categories/:id
- **Description**: Update an existing category by ID.
- **Controller**: `updateCategory`
- **Request Body**:
 ```json
  {
    "name": "string"
  }
  ```
- **Response**: `{ categoryObject }` or `{ error: 'Error message' }`

### DELETE /api/categories/:id
- **Description**: Delete a category by ID.
- **Controller**: `deleteCategory`
- **Response**: `{ "message": "Category deleted successfully" }` or `{ error: 'Error message' }`

## Activity Model API Documentation

### Routes:

### POST /api/activities
- **Description**: Add a new activity.
- **Controller**: `addActivity`
- **Request Body**:
 ```json
  {
    "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "price": "number",
  "date": "string (ISO 8601 format)",
  "image": "file (optional)"
  }
  ```
- **Response**: `{ activityObject  }` or `{ error: 'Error message' }`

### GET /api/activities
- **Description**: Get all activities.
- **Controller**: `getAllActivities`
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/brief
- **Description**: Get brief details of all activities (admin view).
- **Controller**: `getActivitiesBrief`
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/brief/:id
- **Description**: Get brief details of all activities created by a specific user.
- **Controller**: `getActivitiesBriefForUser`
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/upcoming
- **Description**: Get upcoming activities.
- **Controller**: `getUpcomingActivities`
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/search
- **Description**: Search for an activity by category or tag.
- **Controller**: `SearchForActivity`
- **Query Params**: category: (optional) Activity category to search by, tags: (optional) Comma-separated tags to search by
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/filter
- **Description**: Filter upcoming activities by budget, date, category, or rating.
- **Controller**: `filterUpcomingActivities`
- **Query Params**: budget: (optional) Max budget to filter by, date: (optional) Date filter, category: (optional) Category to filter by, rating: (optional) Rating to filter by
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/sort
- **Description**: Sort activities by price or rating.
- **Controller**: `sortActivities`
- **Query Params**: sortBy: (required) "price" or "rating"
- **Response**: `{ [activityObject]  }` or `{ error: 'Error message' }`

### GET /api/activities/:id
- **Description**: Get a specific activity by ID.
- **Controller**: `getActivity`
- **Response**: `{ activityObject   }` or `{ error: 'Error message' }`

### PUT /api/activities/:id
- **Description**: Update an existing activity by ID.
- **Controller**: `updateActivity`
- **Request Body**:
 ```json
  {
    "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "price": "number",
  "date": "string (ISO 8601 format)",
  "image": "file (optional)"
  }
  ```
- **Response**: `{ activityObject }` or `{ error: 'Error message' }`

### DELETE /api/activities/:id
- **Description**: Delete an activity by ID.
- **Controller**: `deleteActivity`
- **Response**: `{ "message": "Activity deleted successfully"  }` or `{ error: 'Error message' }`

### GET /api/activities/user/:id
- **Description**: Get all activities created by a specific user.
- **Controller**: `getAllCreatedActivities`
- **Response**: `{ [activityObject]   }` or `{ error: 'Error message' }`

### GET /api/activities/:id/comments
- **Description**: Get all comments of a specific activity.
- **Controller**: `getComments`
- **Response**: `{ [commentObject]  }` or `{ error: 'Error message' }`

### POST /api/activities/:id/comments
- **Description**: Create a comment for a specific activity.
- **Controller**: `addComment`
- **Request Body**:
 ```json
  {
    "text": "string",
  "createdBy": "userId"
  }
  ```
- **Response**: `{ commentObject    }` or `{ error: 'Error message' }`
