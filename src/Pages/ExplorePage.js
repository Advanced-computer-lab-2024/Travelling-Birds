import React, { useEffect, useState } from 'react';
import Explorer from '../Components/Explore Page/Explorer';
import ResultsList from '../Components/Explore Page/ResultsList';
import ActivityDisplay from '../Components/Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Components/Models/Displays/ItineraryDisplay';
import HistoricalPlaceDisplay from '../Components/Models/Displays/HistoricalPlaceDisplay';
import MuseumDisplay from '../Components/Models/Displays/MuseumDisplay';
import Modal from 'react-modal';
import LoadingPage from './LoadingPage'; 

const ExplorePage = () => {
    const [results, setResults] = useState({ activities: [], itineraries: [], museums: [], historicalPlaces: [] });
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

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
                activities: searchParams.activeSection === 'activities' ? (Array.isArray(data) ? data : []) : results.activities,
                itineraries: searchParams.activeSection === 'itineraries' ? (Array.isArray(data) ? data : []) : results.itineraries,
                historicalPlaces: searchParams.activeSection === 'historicalPlaces' ? (Array.isArray(data) ? data : []) : results.historicalPlaces,
                museums: searchParams.activeSection === 'museums' ? (Array.isArray(data) ? data : []) : results.museums
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
            let response;
            if (filterParams.activeSection === 'activities') {
                response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/filter?budget=${filterParams.activityBudget}&date=${filterParams.activityDate}&category=${filterParams.activityCategory}&rating=${filterParams.activityRating}`);
            } else if (filterParams.activeSection === 'itineraries') {
                response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/filter?price=${filterParams.itineraryBudget}&date=${filterParams.itineraryDate}&preferences=${filterParams.itineraryPreferences}&language=${filterParams.itineraryLanguage}`);
            } else if (filterParams.activeSection === 'historicalPlaces') {
                response = await fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/filter?tag=${filterParams.historicalPlaceTag}`);
            } else if (filterParams.activeSection === 'museums') {
                response = await fetch(`${process.env.REACT_APP_BACKEND}/api/museums/filter?tag=${filterParams.museumTag}`);
            }

            const data = response ? await response.json() : [];

            setResults({
                activities: filterParams.activeSection === 'activities' ? (Array.isArray(data) ? data : []) : results.activities,
                itineraries: filterParams.activeSection === 'itineraries' ? (Array.isArray(data) ? data : []) : results.itineraries,
                historicalPlaces: filterParams.activeSection === 'historicalPlaces' ? (Array.isArray(data) ? data : []) : results.historicalPlaces,
                museums: filterParams.activeSection === 'museums' ? (Array.isArray(data) ? data : []) : results.museums
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching filter results:', error);
            setLoading(false);
        }
    };

    const handleSort = async (sortParams) => {
        try {
            setLoading(true);
            let response;
            if (sortParams.type === 'activities') {
                response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities/sort?sortBy=${sortParams.criterion}`);
            } else if (sortParams.type === 'itineraries') {
                response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/sort?sortBy=${sortParams.criterion}`);
            }

            const data = response ? await response.json() : [];

            setResults((prevResults) => ({
                ...prevResults,
                activities: sortParams.type === 'activities' ? (Array.isArray(data) ? data : []) : prevResults.activities,
                itineraries: sortParams.type === 'itineraries' ? (Array.isArray(data) ? data : []) : prevResults.itineraries,
            }));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching sort results:', error);
            setLoading(false);
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
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

    useEffect(() => {
        fetchInitialResults();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Video section */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg mb-10">
                <video className="w-full h-full object-cover" autoPlay muted loop>
                    <source src={require('../assets/video.mp4')} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white p-6">
                    <div className="text-center space-y-4">
                        <p className="text-4xl font-bold">"Explore over 2 million places around the world"</p>
                        <p className="text-2xl">Join 5 million users who trust us for their travel plans</p>
                        <p className="text-2xl">Covering 200+ destinations globally</p>
                    </div>
                </div>
            </div>
    
            {/* Search and Filter section */}
            <div className="mt-10">
                <Explorer onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />
            </div>
    
            {/* Modal for displaying item details */}
            <Modal
                isOpen={!!selectedItem}
                onRequestClose={() => setSelectedItem(null)}
                className="bg-white p-6 w-full max-w-2xl h-[45vh] mx-auto rounded-lg shadow-lg z-50 overflow-auto"
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
    
            {/* Results section */}
            {loading ? (
                <LoadingPage /> 
            ) : (
                <div className="mt-10">
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