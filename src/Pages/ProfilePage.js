import React, {useEffect, useState} from "react";
import TouristProfile from "../Components/Profiles/TouristProfile";
import SellerProfile from "../Components/Profiles/SellerProfile";
import AdvertiserProfile from "../Components/Profiles/AdvertiserProfile";
import TourGuideProfile from "../Components/Profiles/TourGuideProfile";
import AdminProfile from "../Components/Profiles/AdminProfile";
import TourismGovernorProfile from "../Components/Profiles/TourismGovernorProfile";

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
		if(!id) {
			console.log('User id not found');
			return;
		}
		fetchUserProfile().then(r => console.log('User profile fetched'));
	}, [id]);
	return (
		<>
			{user.role === 'tourist' && <TouristProfile user={user}/>}
			{user.role === 'seller' && <SellerProfile user={user}/>}
			{user.role === 'advertiser' && <AdvertiserProfile user={user}/>}
			{user.role === 'tour_guide' && <TourGuideProfile user={user}/>}
			{user.role === 'admin' && <AdminProfile user={user}/>}
			{user.role === 'tourism_governor' && <TourismGovernorProfile user={user}/>}
		</>
	);
};

export default ProfilePage;
