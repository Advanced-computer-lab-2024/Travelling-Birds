import React, {useEffect, useState} from 'react';
import SearchBar from '../Components/Explore Page/SearchBar';
import FilterSection from '../Components/Explore Page/FilterSection';
import SortSection from '../Components/Explore Page/SortSection';
import ResultsList from '../Components/Explore Page/ResultsList';
import ActivityDisplay from '../Components/Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Components/Models/Displays/ItineraryDisplay';
import HistoricalPlaceDisplay from '../Components/Models/Displays/HistoricalPlaceDisplay';
import MuseumDisplay from '../Components/Models/Displays/MuseumDisplay';
import Modal from 'react-modal';

const ExplorePage = () => {
	const [results, setResults] = useState({activities: [], itineraries: [], museums: [], historicalPlaces: []});
	const [searchResults, setSearchResults] = useState({
		activities: [],
		itineraries: [],
		museums: [],
		historicalPlaces: []
	});
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState(null); // State for the selected item

	const fetchInitialResults = async () => {
		try {
			setLoading(true);
			const responses = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND}/api/activities/upcoming`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/upcoming`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/museums`)
			]);

			const data = await Promise.all(responses.map(res => res.json()));

			setResults({
				activities: Array.isArray(data[0]) ? data[0] : [],
				itineraries: Array.isArray(data[1]) ? data[1] : [],
				historicalPlaces: Array.isArray(data[2]) ? data[2] : [],
				museums: Array.isArray(data[3]) ? data[3] : []
			});
			setLoading(false);
		} catch (error) {
			console.error('Error fetching initial results:', error);
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
			setSearchResults({
				activities: searchParams.activeSection === 'activities' ? data : [],
				itineraries: searchParams.activeSection === 'itineraries' ? data : [],
				historicalPlaces: searchParams.activeSection === 'historicalPlaces' ? data : [],
				museums: searchParams.activeSection === 'museums' ? data : []
			});
			setLoading(false);
		} catch (error) {
			console.error('Error fetching search results:', error);
			setLoading(false);
		}
	};

	const handleFilter = async (filterParams) => {
		try {
			setLoading(true);
			const responses = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND}/api/activities/filter?budget=${filterParams.activityBudget}&date=${filterParams.activityDate}&category=${filterParams.activityCategory}&rating=${filterParams.activityRating}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/filter?price=${filterParams.itineraryBudget}&date=${filterParams.itineraryDate}&preferences=${filterParams.itineraryPreferences}&language=${filterParams.itineraryLanguage}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/filter?tag=${filterParams.historicalPlaceTag}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/museums/filter?tag=${filterParams.museumTag}`)
			]);

			const data = await Promise.all(responses.map(res => res.json()));

			setResults({
				activities: Array.isArray(data[0]) ? data[0] : [],
				itineraries: Array.isArray(data[1]) ? data[1] : [],
				historicalPlaces: Array.isArray(data[2]) ? data[2] : [],
				museums: Array.isArray(data[3]) ? data[3] : []
			});
			setLoading(false);
		} catch (error) {
			console.error('Error fetching filter results:', error);
		}
	};

	const handleSort = async (sortParams) => {
		try {
			setLoading(true);
			if (sortParams.type === 'activity') {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/sort?sortBy=${sortParams.criterion}`);
				const data = await response.json();
				setResults({
					activities: Array.isArray(data) ? data : [],
					itineraries: [],
					historicalPlaces: [],
					museums: []
				});
			} else if (sortParams.type === 'itinerary') {
				const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/sort?sortBy=${sortParams.criterion}`);
				const data = await response.json();
				setResults({
					activities: [],
					itineraries: Array.isArray(data) ? data : [],
					historicalPlaces: [],
					museums: []
				});
			}
			setLoading(false);
		} catch (error) {
			console.error('Error fetching sort results:', error);
		}
	};

	const handleItemClick = (item) => {
		setSelectedItem(item);
	};

	const renderSelectedItem = () => {
		if (!selectedItem) return null;

		switch (selectedItem.type) {
			case 'activity':
				return <ActivityDisplay activity={selectedItem.data}/>;
			case 'itinerary':
				return <ItineraryDisplay itinerary={selectedItem.data}/>;
			case 'historicalPlace':
				return <HistoricalPlaceDisplay historicalPlace={selectedItem.data}/>;
			case 'museum':
				return <MuseumDisplay museum={selectedItem.data}/>;
			default:
				return null;
		}
	};

	useEffect(() => {
		fetchInitialResults();
	}, []);

	return (
		<div className="p-6 bg-gray-50 min-h-screen">


			{/* SearchBar with Results Dropdown */}
			<div className="mt-6"> {/* Adds a consistent margin above the search bar */}
				<SearchBar
					onSearch={handleSearch}
					searchResults={searchResults}
					onSelectItem={handleItemClick}
					isModalOpen={!!selectedItem}
				/>
			</div>

			{/* Video Section under SearchBar */}
			<div
				className="relative mt-6 w-full h-80 rounded-lg overflow-hidden shadow-lg"> {/* Kept spacing consistent below the search bar */}
				<video className="w-full h-full object-cover" autoPlay muted loop>
					<source src={require('../assests/video.mp4')} type="video/mp4"/>
				</video>
				<div
					className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white p-6">
					<div className="text-center space-y-2">
						<p className="text-2xl font-semibold">"Explore over 2 million places around the world"</p>
						<p className="text-lg">Join 5 million users who trust us for their travel plans</p>
						<p className="text-lg">Covering 200+ destinations globally</p>
					</div>
				</div>
			</div>

			{/* Modal for Selected Item */}
			<Modal
				isOpen={!!selectedItem}
				onRequestClose={() => setSelectedItem(null)}
				className="bg-white p-6 w-full max-w-2xl h-[45vh] mx-auto rounded-lg shadow-lg z-50 overflow-auto" // Consistent modal size
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

			{/* Main content with Filter, Sort, and Results */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
				<div className="md:col-span-1 space-y-4">
					<FilterSection onFilter={handleFilter}/>
					<SortSection onSort={handleSort}/>
				</div>

				<div className="md:col-span-3">
					{loading ? (
						<p>Loading...</p>
					) : (
						<ResultsList
							activities={results.activities}
							itineraries={results.itineraries}
							museums={results.museums}
							historicalPlaces={results.historicalPlaces}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExplorePage;