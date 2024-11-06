import { NavLink } from 'react-router-dom';
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

const TouristNavBar = () => {
	const [id, setId] = useState(sessionStorage.getItem('user id'));
	const [user, setUser] = useState({});

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await res.json();
				setUser(data);
				console.log('User profile:', data);
			} catch (err) {
				console.log('Error fetching user profile', err);
			}
		};

		if (!id) {
			console.log('User id not found');
			return;
		}
		fetchUserProfile().then(() => console.log('User profile fetched'));
	}, [id]);

	let imageBase64 = null;
	if (user.profilePicture?.data?.data && user.profilePicture.contentType) {
		try {
			const byteArray = new Uint8Array(user.profilePicture.data.data);
			const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
			imageBase64 = `data:${user.profilePicture.contentType};base64,${btoa(binaryString)}`;
		} catch (error) {
			console.error('Error converting image data to base64:', error);
		}
	}

	return (
		<NavBar>
			{imageBase64 ? (
				<NavLink to='/profile' className="flex items-center">
					<img
						src={imageBase64}
						alt="User Profile"
						className="w-12 h-12 rounded-full border border-white hover:opacity-70 transition duration-200"
					/>
				</NavLink>
			) : (
				<NavLink to='/profile' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">
					Profile
				</NavLink>
			)}
			<NavLink to='/products' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Products</NavLink>
			<NavLink to='/places' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Places</NavLink>
			<NavLink to='/itineraries' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Itineraries</NavLink>
			<NavLink to='/explore' replace={true} className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Explore</NavLink>
			<NavLink to='/complaints' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Complaints</NavLink>
		</NavBar>
	);
};

export default TouristNavBar;