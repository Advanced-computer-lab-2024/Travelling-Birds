// generic log out button

import {useNavigate} from "react-router-dom";
import {sessionStorageEvent} from "../utils/sessionStorageEvent";

const LogOut = () => {
	const navigate = useNavigate();
	const handleLogOut = () => {
		const userId = sessionStorage.getItem('user id'); // Retrieve user ID
		const walkthroughExplore = sessionStorage.getItem('walkthrough.explore') === 'true'; // Retrieve walkthrough flags
		const walkthroughFlights = sessionStorage.getItem('walkthrough.flights') === 'true';
		const walkthroughHotels = sessionStorage.getItem('walkthrough.hotels') === 'true';

			fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					walkthrough: {
						explore: walkthroughExplore,
						flights: walkthroughFlights,
						hotels: walkthroughHotels
					}
				})
			})
				.then(response => {
					if (!response.ok) {
						throw new Error(`Failed to update: ${response.statusText}`);
					}
					return response.json();
				})
				.then(data => {
					console.log('Walkthrough flags successfully updated:', data);
				})
				.catch(error => {
					console.error('Error updating walkthrough flags:', error);
				});
		sessionStorage.removeItem('user id');
		sessionStorage.removeItem('role');
		sessionStorage.removeItem('walkthrough.explore');
		sessionStorage.removeItem('walkthrough.flights');
		sessionStorage.removeItem('walkthrough.hotels');
		window.dispatchEvent(sessionStorageEvent);
		navigate('/', {replace: true});
	}
	return (
		<button onClick={handleLogOut} className="bg-red-500 text-white py-2 px-4 rounded justify-center">Log out</button>
	)
}

export default LogOut;