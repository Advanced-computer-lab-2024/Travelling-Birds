//display all users

import {useEffect, useState} from "react";
import TouristProfile from "../Components/Profiles/TouristProfile";
import TourismGovernorProfile from "../Components/Profiles/TourismGovernorProfile";
import AdminProfile from "../Components/Profiles/AdminProfile";
import AdvertiserProfile from "../Components/Profiles/AdvertiserProfile";
import TourGuideProfile from "../Components/Profiles/TourGuideProfile";
import SellerProfile from "../Components/Profiles/SellerProfile";
import {useNavigate} from "react-router-dom";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const updateUsers = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/users`)
				.then((response) => response.json())
				.then((data) => {
					setUsers(data);
					setLoading(false);
				})
		}
		updateUsers();
		window.addEventListener('userDeleted', updateUsers);

		return () => {
			window.removeEventListener('userDeleted', updateUsers);
		};
	}, []);

	return (
		<div className="flex flex-col items-center space-y-4">
			<button onClick={() => navigate('/admin')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Add Admin
			</button>
			<button onClick={() => navigate('/tourism-governor')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Add Tourism Governor
			</button>
			{loading && <p>Loading...</p>}
			{!loading && users.map((user) => (
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