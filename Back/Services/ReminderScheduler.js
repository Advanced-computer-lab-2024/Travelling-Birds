const cron = require('node-cron');
const fetch = require('node-fetch');
require('dotenv').config();

const start = () => {
    cron.schedule('0 * * * *', async () => {
        console.log('Running reminder scheduler...');
        try {
            // Fetch users from backend
            const usersResponse = await fetch(`${process.env.BACKEND_URL}/api/users`);
            if (!usersResponse.ok) throw new Error('Failed to fetch users');

            const users = await usersResponse.json();
            const now = new Date();

            // Iterate through users
            for (const user of users) {
                const { email, _id } = user;

                // Fetch bookings for activities and itineraries
                const activitiesResponse = await fetch(`${process.env.BACKEND_URL}/api/users/activity-bookings/${_id}`);
                const itinerariesResponse = await fetch(`${process.env.BACKEND_URL}/api/users/itinerary-bookings/${_id}`);

                if (!activitiesResponse.ok || !itinerariesResponse.ok) continue;

                const activities = await activitiesResponse.json();
                const itineraries = await itinerariesResponse.json();

                // Filter for upcoming activities
                const upcomingActivities = activities.filter((activity) => {
                    const activityDate = new Date(activity.date);
                    const timeDifference = (activityDate - now) / (1000 * 60 * 60);
                    return timeDifference > 0 && timeDifference <= 48;
                });

                // Filter for upcoming itineraries
                const upcomingItineraries = itineraries.filter((itinerary) => {
                    const itineraryDate = new Date(itinerary.availableDates[0]);
                    const timeDifference = (itineraryDate - now) / (1000 * 60 * 60);
                    return timeDifference > 0 && timeDifference <= 48;
                });

                // Send emails for activities
                for (const activity of upcomingActivities) {
                    const subject = `Reminder: Upcoming Activity - ${activity.title}`;
                    const htmlContent = `
                        <h1>Reminder: ${activity.title}</h1>
                        <p>Scheduled for ${new Date(activity.date).toLocaleString()}</p>
                    `;

                    await fetch(`${process.env.BACKEND_URL}/api/mail`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, subject, message: '', htmlContent }),
                    });
                }

                // Send emails for itineraries
                for (const itinerary of upcomingItineraries) {
                    const subject = `Reminder: Upcoming Itinerary - ${itinerary.title}`;
                    const htmlContent = `
                        <h1>Reminder: ${itinerary.title}</h1>
                        <p>Starts on ${new Date(itinerary.availableDates[0]).toLocaleString()}</p>
                    `;

                    await fetch(`${process.env.BACKEND_URL}/api/mail`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, subject, message: '', htmlContent }),
                    });
                }
            }
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
        try {
            // Fetch products
            const productsResponse = await fetch(`${process.env.BACKEND_URL}/api/products`);
            if (!productsResponse.ok) throw new Error('Failed to fetch products');

            const products = await productsResponse.json();

            // Check for out-of-stock products
            const outOfStockProducts = products.filter(product => product.availableQuantity === 0);

            for (const product of outOfStockProducts) {
                // Notify the seller
                const sellerResponse = await fetch(`${process.env.BACKEND_URL}/api/users/${product.seller}`);
                if (!sellerResponse.ok) {
                    console.error(`Failed to fetch seller data for product ${product.name}`);
                    continue;
                }

                const seller = await sellerResponse.json();
                const sellerEmail = seller.email;

                // Email to the seller
                const sellerSubject = `Alert: Your product "${product.name}" is out of stock`;
                const sellerHtmlContent = `
                    <h1>Product Out of Stock</h1>
                    <p>Your product <strong>${product.name}</strong> is now out of stock.</p>
                    <p>Please restock it as soon as possible to avoid missed sales opportunities.</p>
                `;

                await fetch(`${process.env.BACKEND_URL}/api/mail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: sellerEmail,
                        subject: sellerSubject,
                        message: '', // Plain text fallback
                        htmlContent: sellerHtmlContent,
                    }),
                });

                console.log(`Out of stock notification sent to seller: ${sellerEmail}`);

                // Notify all admins
                const usersResponse = await fetch(`${process.env.BACKEND_URL}/api/users`);
                if (!usersResponse.ok) throw new Error('Failed to fetch users');

                const users = await usersResponse.json();
                const adminEmails = users.filter(user => user.role === 'admin').map(admin => admin.email);

                for (const adminEmail of adminEmails) {
                    const adminSubject = `Alert: Product "${product.name}" is out of stock`;
                    const adminHtmlContent = `
                        <h1>Product Out of Stock</h1>
                        <p>The product <strong>${product.name}</strong>, offered by ${seller.firstName} ${seller.lastName}, is out of stock.</p>
                        <p>Please review and ensure appropriate actions are taken.</p>
                    `;

                    await fetch(`${process.env.BACKEND_URL}/api/mail`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: adminEmail,
                            subject: adminSubject,
                            message: '', // Plain text fallback
                            htmlContent: adminHtmlContent,
                        }),
                    });

                    console.log(`Out of stock notification sent to admin: ${adminEmail}`);
                }
            }
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
    });
};

module.exports = { start };