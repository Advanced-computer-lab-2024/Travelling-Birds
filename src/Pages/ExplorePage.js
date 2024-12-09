import React, { useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import Explorer from '../Components/ExplorePage/Explorer';
import ResultsList from '../Components/ExplorePage/ResultsList';
import ActivityDisplay from '../Components/Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Components/Models/Displays/ItineraryDisplay';
import HistoricalPlaceDisplay from '../Components/Models/Displays/HistoricalPlaceDisplay';
import MuseumDisplay from '../Components/Models/Displays/MuseumDisplay';
import Modal from 'react-modal';
import LoadingPage from '../Components/LoadingPage/LoadingPage';

const ExplorePage = () => {
	const [results, setResults] = useState({ activities: [], itineraries: [], museums: [], historicalPlaces: [] });
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState(null);

	// Joyride walkthrough state
	const [runTour, setRunTour] = useState(false); // Default is false
	const steps = [
		{
			target: '.video-section',
			content: 'Welcome to the Explore page! This section features an introductory video showcasing the platform.',
			placement: 'bottom',
		},
		{
			target: '.explorer-section',
			content: 'Here you can search, filter, and sort through various travel options.',
			placement: 'top',
		},
		{
			target: '.results-list',
			content: 'This section displays the results of your search, including activities, itineraries, museums, and historical places.',
			placement: 'top',
		},
		{
			target: '.modal-content',
			content: 'Click on any result to view its details in this modal window.',
			placement: 'top',
		},
	];

	const fetchInitialResults = async () => {
		try {
			setLoading(true);
			const responses = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND}/api/activities/upcoming`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/upcoming`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/museums`),
			]);

			const data = await Promise.all(responses.map((res) => res.json()));
			const results = {
				activities: Array.isArray(data[0]) ? data[0] : [],
				itineraries: Array.isArray(data[1]) ? data[1] : [],
				historicalPlaces: Array.isArray(data[2]) ? data[2] : [],
				museums: Array.isArray(data[3]) ? data[3] : [],
			};

			setResults(results);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching initial results:', error);
			setLoading(false);
		}
	};

	const handleSearch = async (searchParams) => {
		try {
			setLoading(true);
			let response;
			if (searchParams.activeSection === 'activities') {
				response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/search?category=${searchParams.activityCategory}&tags=${searchParams.activityTag}`);
			} else if (searchParams.activeSection === 'itineraries') {
				response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/search?category=${searchParams.itineraryCategory}&tags=${searchParams.itineraryTag}`);
			} else if (searchParams.activeSection === 'historicalPlaces') {
				response = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/search?name=${searchParams.historicalPlaceName}&tags=${searchParams.historicalPlaceTag}`);
			} else if (searchParams.activeSection === 'museums') {
				response = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/search?name=${searchParams.museumName}&tags=${searchParams.museumTag}`);
			}

			const data = response ? await response.json() : [];

			setResults({
				activities: searchParams.activeSection === 'activities' ? data.filter((activity) => !activity.flaggedInappropriate) : results.activities,
				itineraries: searchParams.activeSection === 'itineraries' ? data.filter((itinerary) => itinerary.active && !itinerary.flaggedInappropriate) : results.itineraries,
				historicalPlaces: searchParams.activeSection === 'historicalPlaces' ? data : results.historicalPlaces,
				museums: searchParams.activeSection === 'museums' ? data : results.museums,
			});

			setLoading(false);
		} catch (error) {
			console.error('Error fetching search results:', error);
			setLoading(false);
		}
	};

	const renderSelectedItem = () => {
		if (!selectedItem) return null;

		switch (selectedItem.type) {
			case 'activity':
				return <ActivityDisplay activity={selectedItem.data} />;
			case 'itinerary':
				return <ItineraryDisplay itinerary={selectedItem.data} />;
			case 'historicalPlace':
				return <HistoricalPlaceDisplay historicalPlace={selectedItem.data} />;
			case 'museum':
				return <MuseumDisplay museum={selectedItem.data} />;
			default:
				return null;
		}
	};

	// Run walkthrough only once for each session
	useEffect(() => {
		const hasSeenWalkthrough = sessionStorage.getItem('walkthrough.explore');
		console.log('hasSeenWalkthrough:', hasSeenWalkthrough)
		if (hasSeenWalkthrough === 'false' || hasSeenWalkthrough === null) {
			setRunTour(true); // Start Joyride
			sessionStorage.setItem('walkthrough.explore', 'true'); // Set flag in sessionStorage
		}
		fetchInitialResults();
	}, []);

	return (
		<div className="p-6 min-h-screen bg-[#fcfcfc]">
			{/* Joyride Walkthrough */}
			<Joyride
				steps={steps}
				run={runTour}
				continuous={true}
				showSkipButton={true}
				styles={{
					options: {
						arrowColor: '#fff',
						backgroundColor: '#333',
						overlayColor: 'rgba(0, 0, 0, 0.5)',
						textColor: '#fff',
						zIndex: 1000,
					},
				}}
			/>

			{/* Video Section */}
			<div className="video-section relative w-full h-64 rounded-lg overflow-hidden shadow-lg mb-10">
				<video className="w-full h-full object-cover" autoPlay muted loop>
					<source src={require('../Assets/video.mp4')} type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white p-6">
					<div className="text-center space-y-4">
						<p className="text-4xl font-bold">"Explore over 2 million places around the world"</p>
						<p className="text-2xl">Join 5 million users who trust us for their travel plans</p>
						<p className="text-2xl">Covering 200+ destinations globally</p>
					</div>
				</div>
			</div>

			{/* Search and Filter Section */}
			<div className="explorer-section mt-10">
				<Explorer onSearch={handleSearch} />
			</div>

			{/* Modal for Displaying Item Details */}
			<Modal
				isOpen={!!selectedItem}
				onRequestClose={() => setSelectedItem(null)}
				className="modal-content bg-white p-6 w-full max-w-2xl h-[45vh] mx-auto rounded-lg shadow-lg z-50 overflow-auto"
				overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
				ariaHideApp={false}
			>
				{renderSelectedItem()}
				<button
					onClick={() => setSelectedItem(null)}
					className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
				>
					Close
				</button>
			</Modal>

			{/* Results Section */}
			{loading ? (
				<LoadingPage />
			) : (
				<div className="results-list mt-10">
					<ResultsList
						activities={results.activities}
						itineraries={results.itineraries}
						museums={results.museums}
						historicalPlaces={results.historicalPlaces}
					/>
				</div>
			)}
		</div>
	);
};

export default ExplorePage;