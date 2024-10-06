//display all users

import {useEffect, useState} from "react";
import TouristProfile from "../Components/Profiles/TouristProfile";
import TourismGovernorProfile from "../Components/Profiles/TourismGovernorProfile";
import AdminProfile from "../Components/Profiles/AdminProfile";
import AdvertiserProfile from "../Components/Profiles/AdvertiserProfile";
import TourGuideProfile from "../Components/Profiles/TourGuideProfile";
import SellerProfile from "../Components/Profiles/SellerProfile";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users`)
			.then((response) => response.json())
			.then((data) => {
				setUsers(data);
				setLoading(false);
			})
	}, []);

	return (
		<div>
			{loading && <p>Loading...</p>}
			{!loading && users.map((user) => (
				// add card display to each profile
				<div key={user._id} className='bg-pink-900 max-w-fit mx-4 px-4 rounded-l py-4'>
					{(user.role === 'tourist') && <TouristProfile user={user} displayOnly={true}/>}
					{(user.role === 'tour_guide') && <TourGuideProfile user={user} displayOnly={true}/>}
					{(user.role === 'advertiser') && <AdvertiserProfile user={user} displayOnly={true}/>}
					{(user.role === 'tourism_governor') && <TourismGovernorProfile user={user} displayOnly={true}/>}
					{(user.role === 'admin') && <AdminProfile user={user} displayOnly={true}/>}
					{(user.role === 'seller') && <SellerProfile user={user} displayOnly={true}/>}
				</div>
			))}
		</div>
	)
}

export default UsersPage;