import React, {useEffect, useState} from "react";
import TouristProfile from "../Components/Profiles/TouristProfile";
import ReusableInput from "../Components/ReuseableInput";

const ProfilePage = () => {
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
				console.log('User profile:', data)
			} catch (err) {
				console.log('Error fetching user profile', err);
			}
		}
		fetchUserProfile().then(r => console.log('User profile fetched'));
	}, [id]);
	return (
		<>
			{user.role === 'tourist' && <TouristProfile user={user}/>}
		</>
	);
};

export default ProfilePage;
