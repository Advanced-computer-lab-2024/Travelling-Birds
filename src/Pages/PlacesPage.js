import React, { useEffect, useState } from "react";
import MuseumDisplay from "../Components/Models/Displays/MuseumDisplay";
import HistoricalPlaceDisplay from "../Components/Models/Displays/HistoricalPlaceDisplay";
import { useNavigate } from "react-router-dom";

const PlacesPage= () => {
	const [museums, setMuseums] = useState([]);
	const [historicalPlaces, setHistoricalPlaces] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			const museumsApiUrl = `${process.env.REACT_APP_BACKEND}/api/museums`;
			const historicalPlacesApiUrl = `${process.env.REACT_APP_BACKEND}/api/historicalPlaces`;

			try {
				const [museumsRes, historicalPlacesRes] = await Promise.all([
					fetch(museumsApiUrl),
					fetch(historicalPlacesApiUrl),
				]);

				const museumsData = await museumsRes.json();
				const historicalPlacesData = await historicalPlacesRes.json();

				setMuseums(museumsData);
				setHistoricalPlaces(historicalPlacesData);

				console.log("Museums:", museumsData);
				console.log("Historical Places:", historicalPlacesData);
			} catch (err) {
				console.log("Error fetching data", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		window.addEventListener("modelModified", fetchData);
		return () => {
			window.removeEventListener("modelModified", fetchData);
		};
	}, []);

	const handleCreateMuseum = () => {
		navigate("/create-museum");
	};

	const handleCreateHistoricalPlace = () => {
		navigate("/create-historical-place");
	};

	return (
		<div>
			<section className="bg-blue-50 px-4 py-10">
				<div className="container-xl lg:container m-auto">
					<h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
						Museums and Historical Places
					</h2>

					{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(sessionStorage.getItem('role')) && (
						<div className="mb-6">
							<button
								onClick={handleCreateMuseum}
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-4 mr-4"
							>
								Create New Museum
							</button>
							<button
								onClick={handleCreateHistoricalPlace}
								className="bg-indigo-500 text-white px-4 py-2 rounded-md mb-4"
							>
								Create New Historical Place
							</button>
						</div>
					)}

					<div className="mb-10">
						<h3 className="text-2xl font-semibold text-gray-700 mb-4">
							Historical Places
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{!loading ? (
								historicalPlaces.map((historicalPlace) => (
									<HistoricalPlaceDisplay key={historicalPlace._id} historicalPlace={historicalPlace} />
								))
							) : (
								<p>Loading historical places...</p>
							)}
						</div>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-gray-700 mb-4">
							Museums
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{!loading ? (
								museums.map((museum) => (
									<MuseumDisplay key={museum._id} museum={museum} />
								))
							) : (
								<p>Loading museums...</p>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default PlacesPage;
