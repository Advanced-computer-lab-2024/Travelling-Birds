import React, {useEffect, useState} from 'react';
import {ActivityDisplay} from "../Components/Models/Displays";
import {useNavigate} from "react-router-dom";
import TagDisplay from "../Components/Models/Displays/TagDisplay";
import Popup from "reactjs-popup";
import {TagForm} from "../Components/Models/Forms";

const ActivityPage = () => {
	const [activities, setActivities] = useState([]);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchActivities = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/activities/`;
			setLoading(true);
			try {
				const res = await fetch(apiUrl);
				const activities = await res.json();
				setActivities(activities);
			} catch (err) {
				console.log('Error fetching activities', err);
			} finally {
				setLoading(false);
			}
		};

		const fetchTags = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/tags`;
			setLoading(true);
			try {
				const res = await fetch(apiUrl);
				const tags = await res.json();
				setTags(tags);
			} catch (err) {
				console.log('Error fetching tags', err);
			} finally {
				setLoading(false);
			}
		}

		fetchActivities().then(r => r);
		fetchTags().then(r => r);

		window.addEventListener('modelModified', fetchActivities);
		window.addEventListener('tagModified', fetchTags);

		return () => {
			window.removeEventListener('modelModified', fetchActivities);
			window.removeEventListener('tagModified', fetchTags);
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
					<div className="flex flex-row gap-6 py-4">
						{!loading ? (
							tags.map((tag) => (
								<TagDisplay className='py-4' key={tag._id} tag={tag}/>
							))) : (
							<p>Loading tags...</p>
						)
						}
						<Popup
							className="h-fit overflow-y-scroll"
							trigger={
								<button className="bg-indigo-500 text-white px-4 py-2 rounded-lg mr-4">
									New Tag
								</button>
							}
							modal
							contentStyle={{maxHeight: '80vh', overflowY: 'auto'}} /* Ensures scroll */
							overlayStyle={{background: 'rgba(0, 0, 0, 0.5)'}} /* Darken background for modal */
						>
							<TagForm className="overflow-y-scroll"/>
						</Popup>
					</div>
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