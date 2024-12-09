
# Jest Test Cases
#### 1. Authentication and User Management:
* Valid login for an existing user.

* Invalid login with incorrect credentials.

*  Fetch all users.
```javascript
 describe('User Login', () => {
    it('should log in with valid credentials', async () => {
      const response = await request(app).post('/users/login').send({
        username: 'testuser',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app).post('/users/login').send({
        username: 'wronguser',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid password. Please try again.');
    });
  });

  describe('User Management', () => {
    it('should fetch all users', async () => {
      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
```
#### 2. Activity Management:
* Fetch all activities.
* Add a new activity.
* Delete an activity

```javascript
describe('Activities', () => {
    it('should fetch all activities', async () => {
      const response = await request(app).get('/activities');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should add a new activity', async () => {
      const response = await request(app).post('/activities').send({
        title: 'Hiking Adventure',
        location: 'Mountain',
        price: 50,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Hiking Adventure');
    });

    it('should delete an activity', async () => {
      const response = await request(app).delete('/activities/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Activity deleted successfully');
    });
  });
```

#### 3. Complaint Handling:
* Add a new complaint.

* Fetch all complaints.

* Update a complaint.
```javascript
  describe('Complaints', () => {
    it('should add a new complaint', async () => {
      const response = await request(app).post('/complaints').send({
        title: 'Service Issue',
        body: 'The service was unsatisfactory.',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Service Issue');
    });

    it('should fetch all complaints', async () => {
      const response = await request(app).get('/complaints');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should update a complaint', async () => {
      const response = await request(app).put('/complaints/123').send({
        status: 'Resolved',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status', 'Resolved');
    });
  });
```
#### 4. Flight Booking:
* Search for flights.

* Book a flight.

* Fetch flight details by ID.
```javascript
  describe('Flights', () => {
    it('should search for flights', async () => {
      const response = await request(app).post('/flights/search').send({
        origin: 'CAI',
        destination: 'JFK',
        departureDate: '2024-12-15',
      });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should book a flight', async () => {
      const response = await request(app).post('/flights/book').send({
        flightDetails: { id: '1' },
        travelerInfo: { name: { firstName: 'John', lastName: 'Doe' } },
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Booking confirmed!');
    });

    it('should fetch flight details by ID', async () => {
      const response = await request(app).get('/flights/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', '1');
    });
  });
```
#### 5. Category Management:
* Add a new category.
* Fetch all categories.
```javascript
  describe('Categories', () => {
    it('should add a new category', async () => {
      const response = await request(app).post('/categories').send({
        name: 'Adventure',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Adventure');
    });

    it('should fetch all categories', async () => {
      const response = await request(app).get('/categories');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

```
#### 6. Historical Places:
* Add a historical place.
* Fetch all historical places.
* Update a historical place.
```javascript
 describe('Historical Places', () => {
    it('should add a historical place', async () => {
      const response = await request(app).post('/historical-places').send({
        name: 'Great Pyramid',
        location: 'Giza',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Great Pyramid');
    });

    it('should fetch all historical places', async () => {
      const response = await request(app).get('/historical-places');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should update a historical place', async () => {
      const response = await request(app).put('/historical-places/123').send({
        name: 'Updated Pyramid',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Pyramid');
    });
  });
```
#### 7. Itineraries:
* Add an itinerary.
* Fetch all itineraries.
```javascript
  describe('Itineraries', () => {
    it('should add an itinerary', async () => {
      const response = await request(app).post('/itineraries').send({
        title: 'Cairo Tour',
        description: 'A day tour in Cairo.',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Cairo Tour');
    });

    it('should fetch all itineraries', async () => {
      const response = await request(app).get('/itineraries');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
```
#### 8.	Comments:
* Add a new comment.
```javascript
 describe('Comments', () => {
    it('should add a new comment', async () => {
      const response = await request(app).post('/comments').send({
        user: 'User1',
        text: 'Great experience!',
        stars: 5,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('text', 'Great experience!');
    });
  });
```
#### 9.	Products:
* Search for products.
```javascript
 describe('Products', () => {
    it('should search for products', async () => {
      const response = await request(app).get('/products/search').query({
        name: 'Tour Guide Book',
      });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
```
