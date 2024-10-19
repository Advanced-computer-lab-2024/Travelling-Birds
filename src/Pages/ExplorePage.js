import React, {useEffect, useState} from 'react';
import SearchBar from '../Components/Explore Page/SearchBar';
import FilterSection from '../Components/Explore Page/FilterSection';
import SortSection from '../Components/Explore Page/SortSection';
import ResultsList from '../Components/Explore Page/ResultsList';

const ExplorePage = () => {
	const [results, setResults] = useState({activities: [], itineraries: [], museums: [], historicalPlaces: []});
	const [searchResults, setSearchResults] = useState({activities: [], itineraries: [], museums: [], historicalPlaces: []});
	const [loading, setLoading] = useState(true);


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
				activities: data[0]?.message?.includes('No') ? [] : data[0],
				itineraries: data[1]?.message?.includes('No') ? [] : data[1],
				historicalPlaces: data[2],
				museums: data[3]
			});
			setLoading(false);
		} catch (error) {
			console.error('Error fetching initial results:', error);
		}
	}


	const handleSearch = async (searchParams) => {
		try {
			setLoading(true);
			const responses = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND}/api/activities/search?category=${searchParams.activityCategory}&tags=${searchParams.activityTag}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/search?category=${searchParams.itineraryCategory}&tags=${searchParams.itineraryTag}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/search?name=${searchParams.historicalPlaceName}&tags=${searchParams.historicalPlaceTag}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/museums/search?name=${searchParams.museumName}&tags=${searchParams.museumTag}`)
			]);


			const data = await Promise.all(responses.map(res => res.json()));

			setSearchResults({
				activities: data[0]?.message?.includes('No') ? [] : data[0],
				itineraries: data[1]?.message?.includes('No') ? [] : data[1],
				historicalPlaces: data[2]?.message?.includes('No') ? [] : data[2],
				museums: data[3]?.message?.includes('No') ? [] : data[3]
			});

			setLoading(false);
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	};

	const handleFilter = async (filterParams) => {
		setLoading(true);
		try {
			const responses = await Promise.all([
				fetch(`${process.env.REACT_APP_BACKEND}/api/activities/filter?budget=${filterParams.activityBudget}&date=${filterParams.activityDate}&category=${filterParams.activityCategory}&rating=${filterParams.activityRating}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/filter?budget=${filterParams.itineraryBudget}&date=${filterParams.itineraryDate}&preferences=${filterParams.itineraryPreferences}&language=${filterParams.itineraryLanguage}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/historicalPlaces/filter?tag=${filterParams.historicalPlaceTag}`),
				fetch(`${process.env.REACT_APP_BACKEND}/api/museums/filter?tag=${filterParams.museumTag}`)
			]);

			const data = await Promise.all(responses.map(res => res.json()));
			setResults({
				activities: data[0]?.message?.includes('No') ? [] : data[0],
				itineraries: data[1]?.message?.includes('No') ? [] : data[1],
				historicalPlaces: data[2],
				museums: data[3]
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
				const responses = await Promise.all([
					fetch(`${process.env.REACT_APP_BACKEND}/api/activities/sort?sortBy=${sortParams.criterion}`)

            ]);
            const data = await Promise.all(responses.map(res => res.json()));
            setResults({
                activities: data[0]?.message?.includes('No') ? [] : data[0],
				itineraries: [],
                historicalPlaces: [],
                museums: []
            });
        }
        else if (sortParams.type === 'itinerary') {
            const responses = await Promise.all([
                fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/sort?sortBy=${sortParams.criterion}`)
            ]);
            const data = await Promise.all(responses.map(res => res.json()));
            setResults({
                activities: [],
				itineraries: data[0]?.message?.includes('No') ? [] : data[0],
                historicalPlaces: [],
                museums: []
            });
        }
        setLoading(false);
        } catch (error) {
            console.error('Error fetching sort results:', error);
        }
    };

	useEffect(() => {
		fetchInitialResults().then();
	}, []);
	
	return (
		<div className="p-6 bg-gray-50 min-h-screen">
		  <div className="max-w-7xl mx-auto space-y-6">
			{/* SearchBar at the top */}
			<SearchBar onSearch={handleSearch} />
	  
			{/* Display search results directly under the search bar */}
			{!loading && (searchResults.activities.length || searchResults.itineraries.length || searchResults.historicalPlaces.length || searchResults.museums.length) ? (
			  <div>
				<h3 className="text-lg font-semibold">Search Results:</h3>
				<ResultsList
				  activities={searchResults.activities}
				  itineraries={searchResults.itineraries}
				  museums={searchResults.museums}
				  historicalPlaces={searchResults.historicalPlaces}
				/>
			  </div>
			) : null}
	  
			{/* Video underneath the SearchBar */}
			<div className="w-full overflow-hidden rounded-lg shadow-lg mb-6">
			  <video className="w-full h-auto" controls autoPlay muted loop>
				<source src={require('../assests/video.mp4')} type="video/mp4" />
				Your browser does not support the video tag.
			  </video>
			</div>
	  
			{/* Main content with Filter, Sort, and Results */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			  <div className="md:col-span-1 space-y-4">
				<FilterSection onFilter={handleFilter} />
				<SortSection onSort={handleSort} />
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
		</div>
	  );
};


export default ExplorePage;