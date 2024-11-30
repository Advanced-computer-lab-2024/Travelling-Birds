import React, {useEffect, useState} from "react";
import MyHistoricalPlaceDisplay from "../../../Components/MyBookings/MyHistoricalPlaceDisplay";
import MyMuseumDisplay from "../../../Components/MyBookings/MyMuseumDisplay";


const PlacesPage = () => {
	const [museums, setMuseums] = useState([]);
	const [historicalPlaces, setHistoricalPlaces] = useState([]);
	const [bookedActivities, setBookedActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const userRole = sessionStorage.getItem('role');
	const userId = sessionStorage.getItem('user id');

	useEffect(() => {
		const fetchData = async () => {
			if (userRole === 'tourist') {

				const museumsApiUrl = `${process.env.REACT_APP_BACKEND}/api/museums`;
				const historicalPlacesApiUrl = `${process.env.REACT_APP_BACKEND}/api/historicalPlaces`;
				const userBookingsApiUrl = `${process.env.REACT_APP_BACKEND}/api/users/activity-bookings/${userId}`;

				try {
					// Fetch user bookings
					const userBookingsRes = await fetch(userBookingsApiUrl);
					const userBookingsData = await userBookingsRes.json();
					setBookedActivities(userBookingsData.map(activity => activity._id));

					// Fetch museums and historical places
					const [museumsRes, historicalPlacesRes] = await Promise.all([
						fetch(museumsApiUrl),
						fetch(historicalPlacesApiUrl),
					]);

					const museumsData = await museumsRes.json();
					const historicalPlacesData = await historicalPlacesRes.json();

					// Filter out only those museums and historical places that have booked activities
					const filteredMuseums = museumsData.filter(museum =>
						museum.activities.some(activityId => userBookingsData.some(booked => booked._id === activityId))
					);

					const filteredHistoricalPlaces = historicalPlacesData.filter(historicalPlace =>
						historicalPlace.activities.some(activityId => userBookingsData.some(booked => booked._id === activityId))
					);

					setMuseums(filteredMuseums);
					setHistoricalPlaces(filteredHistoricalPlaces);


				} catch (err) {
					console.log("Error fetching data", err);
				} finally {
					setLoading(false);
				}
			}
		};


		fetchData();


		window.addEventListener("modelModified", fetchData);


		return () => {
			window.removeEventListener("modelModified", fetchData);

		};
	}, [userId, userRole]);


	return (
		<div>
			<section className="bg-white px-4 py-10">
				<div className="container-xl lg:container m-auto">
					<h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
						My Museums and Historical Places
					</h2>
					<div className="mb-10">
						<h3 className="text-2xl font-semibold text-[#330577] mb-4">
							Historical Places
						</h3>
						<div className="grid grid-cols-1 gap-6">
							{!loading ? (
								historicalPlaces.map((historicalPlace) => (
									<MyHistoricalPlaceDisplay key={historicalPlace._id}
									                          historicalPlace={historicalPlace}/>
								))
							) : (
								<p className="text-[#330577]">Loading historical places...</p>
							)}
						</div>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-[#330577] mb-4">
							Museums
						</h3>
						<div className="grid grid-cols-1 gap-6">
							{!loading ? (
								museums.map((museum) => (
									<MyMuseumDisplay key={museum._id} museum={museum}/>
								))
							) : (
								<p className="text-[#330577]">Loading museums...</p>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default PlacesPage;