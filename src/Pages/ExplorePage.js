import React, { useEffect, useState } from 'react';
import SearchBar from '../Components/Explore Page/SearchBar';
import FilterSection from '../Components/Explore Page/FilterSection';
import SortSection from '../Components/Explore Page/SortSection';
import ResultsList from '../Components/Explore Page/ResultsList';
import ActivityDisplay from '../Components/Models/Displays/ActivityDisplay';
import ItineraryDisplay from '../Components/Models/Displays/ItineraryDisplay';
import { set } from 'mongoose';

const ExplorePage = () => {
    const [results, setResults] = useState({ activities: [], itineraries: [], museums: [], historicalPlaces: [] });
    const [loading, setLoading] = useState(true);

    
        const fetchInitialResults = async () => {
            try {
                setLoading(true);
                const responses = await Promise.all([
                    fetch(`${process.env.REACT_APP_BACKEND}/api/activities/upcoming`),
                    //fetch(`${process.env.REACT_APP_BACKEND}/api/activities/search?category=${encodeURIComponent("sdfdfasad")}&tag=${encodeURIComponent("fdasfdas")}`),
                    fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/upcoming`),
                    fetch(`${process.env.REACT_APP_BACKEND}/api/historicalplaces`),
                    fetch(`${process.env.REACT_APP_BACKEND}/api/museums`)
                ]);

                const data = await Promise.all(responses.map(res => res.json()));
                setResults({
                    activities: data[0],
                    itineraries: data[1],
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
                fetch(`${process.env.REACT_APP_BACKEND}/api/activities/search?category=${searchParams.activityCategory}&tag=${searchParams.activityTag}`),
                fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/search?category=${searchParams.itineraryCategory}&tag=${searchParams.itineraryTag}`),
                fetch(`${process.env.REACT_APP_BACKEND}/api/historical-places/search?name=${searchParams.historicalPlaceName}&tag=${searchParams.historicalPlaceTag}`),
                fetch(`${process.env.REACT_APP_BACKEND}/api/museums/search?name=${searchParams.museumName}&tag=${searchParams.museumTag}`)
            ]);


            const data = await Promise.all(responses.map(res => res.json()));
            console.log(data[0]);
            setResults({
                activities: data[0],
                itineraries: data[1],
                historicalPlaces: data[2],
                museums: data[3]
            });

            console.log(data[0]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleFilter = async (filterParams) => {
        try {
            const responses = await Promise.all([
                fetch(`${process.env.REACT_APP_BACKEND}/api/activities/filter?budget=${filterParams.activityBudget}&date=${filterParams.activityDate}&category=${filterParams.activityCategory}&rating=${filterParams.activityRating}`),
                fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries/filter?budget=${filterParams.itineraryBudget}&date=${filterParams.itineraryDate}&preferences=${filterParams.itineraryPreferences}&language=${filterParams.itineraryLanguage}`),
                fetch(`${process.env.REACT_APP_BACKEND}/api/historical-places/filter?tag=${filterParams.historicalPlaceTag}`),
                fetch(`${process.env.REACT_APP_BACKEND}/api/museums/filter?tag=${filterParams.museumTag}`)
            ]);

            const data = await Promise.all(responses.map(res => res.json()));
            setResults({
                activities: data[0],
                itineraries: data[1],
                historicalPlaces: data[2],
                museums: data[3]
            });
        } catch (error) {
            console.error('Error fetching filter results:', error);
        }
    };

    const handleSort = async (sortParams) => {
        try {
            let sortURL = '';
            if (sortParams.type === 'activity') {
                sortURL = `${process.env.REACT_APP_BACKEND}/api/activities/sort?criterion=${sortParams.criterion}`;
            } else if (sortParams.type === 'itinerary') {
                sortURL = `${process.env.REACT_APP_BACKEND}/api/itineraries/sort?criterion=${sortParams.criterion}`;
            }
            
            const response = await fetch(sortURL);
            const sortedData = await response.json();
    
            setResults(prevResults => ({
                ...prevResults,
                [sortParams.type + 's']: sortedData, // activities or itineraries
            }));
        } catch (error) {
            console.error('Error fetching sort results:', error);
        }
    };

 
    
    useEffect(() => {
         
            fetchInitialResults();
        
    }
    , []);
   

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <SearchBar onSearch={handleSearch} />
            <FilterSection onFilter={handleFilter} />
            <SortSection onSort={handleSort} />
            {!loading && <ResultsList   
                activities={results.activities} 
                itineraries={results.itineraries}
                museums={results.museums}
                historicalPlaces={results.historicalPlaces} 
            />}
        </div>
    );
};

      

export default ExplorePage;