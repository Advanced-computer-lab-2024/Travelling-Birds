import React, { useState, useEffect } from 'react';
import Activity from "../Components/Activity";
import {useNavigate} from "react-router-dom";

const ActivityPage = ({ isHome = false }) => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchActivities = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/`;
			try {
				const res = await fetch(apiUrl);
				const data = await res.json();
				setActivities(data.activities);
				console.log('Activities:', data.activities);
			} catch (err) {
				console.log('Error fetching activities', err);
			} finally {
				setLoading(false);
			}
		};
		fetchActivities();
	}, []);
	const handleCreateActivity = () => {
		navigate('/create-activity')
	}

	return (
		<div>
			<section className="bg-blue-50 px-4 py-10">
				<div className="container-xl lg:container m-auto">
					<h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
						 All Activities
					</h2>
					{
						['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
							<button
								onClick={handleCreateActivity}
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-6"
							>
								Create New Activity
							</button>
						)
					}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{!loading ? (
								activities.map((activity) => (
									<Activity key={activity._id} activity={activity} />
								))
							) : (
								<p>Loading activities...</p>
							)}
						</div>
				</div>
			</section>
		</div>
	);
};

export default ActivityPage;