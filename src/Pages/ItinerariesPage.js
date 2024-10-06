import React, {useEffect, useState} from "react";
import Itinerary from "../Components/Itinerary";
import {useNavigate} from "react-router-dom";

const ItinerariesPage = () => {
	const [itineraries, setItineraries] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchItineraries = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/itineraries`;
			try {
				const res = await fetch(apiUrl);
				const itineraries = await res.json();
				setItineraries(itineraries);
				console.log('Itineraries:', itineraries);
			} catch (err) {
				console.log('Error fetching itineraries', err);
			} finally {
				setLoading(false);
			}
		};
		fetchItineraries().then(r => r);
	}, []);
	const handleCreateItinerary = () => {
		navigate('/create-itinerary')
	}
	const handleViewMyItineraries = async () => {
		const apiUrl = `${process.env.REACT_APP_BACKEND}/api/itineraries/user/${sessionStorage.getItem('user id')}`;
		try {
			const res = await fetch(apiUrl);
			const data = await res.json();
			setItineraries(data.itineraries);
			console.log('Itineraries:', data.itineraries);
		} catch (err) {
			console.log('Error fetching itineraries', err);
		} finally {
			setLoading(false);
		}
	}
	return (
		<div>
			<section className="bg-blue-50 px-4 py-10">
				<div className="container-xl lg:container m-auto">
					<h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
						All Itineraries
					</h2>
					{
						['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
							<button
								onClick={handleCreateItinerary}
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-6"
							>
								Create New Itinerary
							</button>
						)
					}
					{
						['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
							<button
								onClick={handleViewMyItineraries}
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-6"
							>
								View My Created Itineraries
							</button>
						)
					}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{!loading ? (
							itineraries.map((itinerary) => (
								<Itinerary key={itinerary._id} itinerary={itinerary}/>
							))
						) : (
							<p>Loading activities...</p>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
export default ItinerariesPage;