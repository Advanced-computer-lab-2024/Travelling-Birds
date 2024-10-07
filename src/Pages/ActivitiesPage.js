import React, {useEffect, useState} from 'react';
import {ActivityDisplay} from "../Components/Models/Displays";
import {useNavigate} from "react-router-dom";

const ActivityPage = () => {
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchActivities = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/`;
			try {
				const res = await fetch(apiUrl);
				const activities = await res.json();
				setActivities(activities);
				console.log('Activities:', activities);
			} catch (err) {
				console.log('Error fetching activities', err);
			} finally {
				setLoading(false);
			}
		};
		fetchActivities().then(r => r);
		window.addEventListener('modelModified', fetchActivities);

		return () => {
			window.removeEventListener('modelModified', fetchActivities);
		};
	}, []);

	const handleCreateActivity = () => {
		navigate('/create-activity')
	}
	const handleViewMyActivities = async () => {
		const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/user/${sessionStorage.getItem('user id')}`;
		try {
			const res = await fetch(apiUrl);
			const activities = await res.json();
			setActivities(activities);
			console.log('Activities:', activities);
		} catch (err) {
			console.log('Error fetching activities', err);
		} finally {
			setLoading(false);
		}
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
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-6 mr-4"
							>
								Create New Activity
							</button>
						)
					}
					{
						['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
							<button
								onClick={handleViewMyActivities}
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-6"
							>
								View My Created Activities
							</button>
						)
					}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{!loading ? (
							activities.map((activity) => (
								<ActivityDisplay key={activity._id} activity={activity}/>
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