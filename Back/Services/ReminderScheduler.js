const cron = require('node-cron');
const fetch = require('node-fetch');
require('dotenv').config();

const sentActivityReminders = new Set();
const sentProductReminders = new Set();

const start = () => {
    cron.schedule('* * * * *', async () => {
        console.log('Running reminder scheduler...');
        const now = new Date();

        try {
            // Process activities and itineraries
            const usersResponse = await fetch(`${process.env.BACKEND_URL}/api/users`);
            if (!usersResponse.ok) throw new Error('Failed to fetch users');

            const users = await usersResponse.json();

            for (const user of users) {
                const { email, _id } = user;

                // Check activity reminders
                const activitiesResponse = await fetch(`${process.env.BACKEND_URL}/api/users/activity-bookings/${_id}`);
                if (!activitiesResponse.ok) throw new Error('Failed to fetch activity bookings');

                const activities = await activitiesResponse.json();
                for (const activity of activities) {
                    const activityDate = new Date(activity.date);
                    const timeDifference = (activityDate - now) / (1000 * 60 * 60);

                    if (timeDifference > 0 && timeDifference <= 48) {
                        const uniqueKey = `activity-${_id}-${activity._id}`;
                        if (!sentActivityReminders.has(uniqueKey)) {
                            const subject = `Reminder: Upcoming Activity - ${activity.title}`;
                            const htmlContent = `
                                <h1>Reminder: ${activity.title}</h1>
                                <p>Scheduled for ${activityDate.toLocaleString()}.</p>
                                <p>We hope you enjoy it!</p>
                            `;
                            await sendEmail(email, subject, htmlContent);
                            sentActivityReminders.add(uniqueKey);
                            console.log(`Reminder sent for activity: ${activity.title}`);
                        }
                    }
                }

                // Check itinerary reminders
                const itinerariesResponse = await fetch(`${process.env.BACKEND_URL}/api/users/itinerary-bookings/${_id}`);
                if (!itinerariesResponse.ok) throw new Error('Failed to fetch itinerary bookings');

                const itineraries = await itinerariesResponse.json();
                for (const itinerary of itineraries) {
                    const itineraryDate = new Date(itinerary.availableDates[0]);
                    const timeDifference = (itineraryDate - now) / (1000 * 60 * 60);

                    if (timeDifference > 0 && timeDifference <= 48) {
                        const uniqueKey = `itinerary-${_id}-${itinerary._id}`;
                        if (!sentActivityReminders.has(uniqueKey)) {
                            const subject = `Reminder: Upcoming Itinerary - ${itinerary.title}`;
                            const htmlContent = `
                                <h1>Reminder: ${itinerary.title}</h1>
                                <p>Starts on ${itineraryDate.toLocaleString()}.</p>
                                <p>We hope you enjoy it!</p>
                            `;
                            await sendEmail(email, subject, htmlContent);
                            sentActivityReminders.add(uniqueKey);
                            console.log(`Reminder sent for itinerary: ${itinerary.title}`);
                        }
                    }
                }
            }

            // Process out-of-stock products
            const productsResponse = await fetch(`${process.env.BACKEND_URL}/api/products`);
            if (!productsResponse.ok) throw new Error('Failed to fetch products');

            const products = await productsResponse.json();
            for (const product of products) {
                if (product.availableQuantity === 0) {
                    const uniqueKey = `product-${product._id}`;
                    if (!sentProductReminders.has(uniqueKey)) {
                        const sellerResponse = await fetch(`${process.env.BACKEND_URL}/api/users/${product.seller._id}`);
                        if (!sellerResponse.ok) throw new Error('Failed to fetch seller data');

                        const seller = await sellerResponse.json();
                        const sellerEmail = seller.email;

                        const sellerSubject = `Alert: Your product "${product.name}" is out of stock`;
                        const sellerHtmlContent = `
                            <h1>Product Out of Stock</h1>
                            <p>Your product <strong>${product.name}</strong> is out of stock.</p>
                        `;
                        await sendEmail(sellerEmail, sellerSubject, sellerHtmlContent);
                        console.log(`Out-of-stock email sent to seller: ${sellerEmail}`);

                        const adminEmails = users
                            .filter(user => user.role === 'admin')
                            .map(admin => admin.email);

                        for (const adminEmail of adminEmails) {
                            const adminSubject = `Alert: Product "${product.name}" is out of stock`;
                            const adminHtmlContent = `
                                <h1>Product Out of Stock</h1>
                                <p>The product <strong>${product.name}</strong>, offered by ${seller.firstName}, is out of stock.</p>
                            `;
                            await sendEmail(adminEmail, adminSubject, adminHtmlContent);
                            console.log(`Out-of-stock email sent to admin: ${adminEmail}`);
                        }
                        sentProductReminders.add(uniqueKey);
                    }
                }
            }
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
    });
};

// Helper function to send email
const sendEmail = async (email, subject, htmlContent) => {
    await fetch(`${process.env.BACKEND_URL}/api/mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message: '', htmlContent }),
    });
};

module.exports = { start };