// // ExplorePage.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ResultList from '../Components/explorepage components/ResultsList';
// import SearchBar from '../Components/explorepage components/SearchBar';
// import FilterSection from '../Components/explorepage components/FilterSection';
// import SortSection from '../Components/explorepage components/SortSection';
//
// const ExplorePage = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [results, setResults] = useState([]);
//     const [filter, setFilter] = useState({});
//     const [type, setType] = useState('activity'); // default to activities
//
//     const handleSearch = async () => {
//         try {
//             let response;
//             switch (type) {
//                 case 'activity':
//                     response = await axios.get('/api/activities/search', { params: { category: searchTerm, tag: searchTerm } });
//                     break;
//                 case 'itinerary':
//                     response = await axios.get('/api/itineraries/search', { params: { category: searchTerm, tag: searchTerm } });
//                     break;
//                 case 'museum':
//                     response = await axios.get('/api/museums/search', { params: { name: searchTerm, tag: searchTerm } });
//                     break;
//                 case 'historicalPlace':
//                     response = await axios.get('/api/historicalPlaces/search', { params: { name: searchTerm, tag: searchTerm } });
//                     break;
//                 default:
//                     return;
//             }
//             setResults(response.data);
//         } catch (error) {
//             console.error('Error fetching search results:', error);
//         }
//     };
//
//     const handleFilter = async () => {
//         try {
//             let response;
//             switch (type) {
//                 case 'activity':
//                     response = await axios.get('/api/activities/filter', { params: filter });
//                     break;
//                 case 'itinerary':
//                     response = await axios.get('/api/itineraries/filter', { params: filter });
//                     break;
//                 case 'museum':
//                     response = await axios.get('/api/museums/filter', { params: { tag: filter.tag } });
//                     break;
//                 case 'historicalPlace':
//                     response = await axios.get('/api/historicalPlaces/filter', { params: { tag: filter.tag } });
//                     break;
//                 default:
//                     return;
//             }
//             setResults(response.data);
//         } catch (error) {
//             console.error('Error fetching filter results:', error);
//         }
//     };
//
//     const handleSort = async (sortField) => {
//         try {
//             let response;
//             if (type === 'activity') {
//                 response = await axios.get('/api/activities/sort', { params: { sortBy: sortField } });
//             } else if (type === 'itinerary') {
//                 response = await axios.get('/api/itineraries/sort', { params: { sortBy: sortField } });
//             }
//             setResults(response.data);
//         } catch (error) {
//             console.error('Error sorting results:', error);
//         }
//     };
//
//     const handleTypeChange = (event) => {
//         setType(event.target.value);
//         setResults([]); // Clear results when switching types
//     };
//
//     useEffect(() => {
//         // Fetch upcoming activities/itineraries when the page loads
//         const fetchUpcoming = async () => {
//             try {
//                 if (type === 'activity') {
//                     const response = await axios.get('/api/activities/upcoming');
//                     setResults(response.data);
//                 } else if (type === 'itinerary') {
//                     const response = await axios.get('/api/itineraries/upcoming');
//                     setResults(response.data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching upcoming data:', error);
//             }
//         };
//
//         fetchUpcoming();
//     }, [type]);
//
//     return (
//         <div>
//             <h1>Explore</h1>
//             <select onChange={handleTypeChange} value={type}>
//                 <option value="activity">Activities</option>
//                 <option value="itinerary">Itineraries</option>
//                 <option value="museum">Museums</option>
//                 <option value="historicalPlace">Historical Places</option>
//             </select>
//
//             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
//             <FilterSection type={type} filter={filter} setFilter={setFilter} handleFilter={handleFilter} />
//             <SortSection handleSort={handleSort} />
//
//             <ResultList results={results} type={type} />
//         </div>
//     );
// };
//
// export default ExplorePage;