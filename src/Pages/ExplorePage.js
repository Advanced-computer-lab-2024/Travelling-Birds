import React, {useState} from 'react';
import SearchBar from '../Components/Explore Page/SearchBar';
import FilterSection from '../Components/Explore Page/FilterSection';
import SortSection from '../Components/Explore Page/SortSection';
import ResultsList from '../Components/Explore Page/ResultsList';

const ExplorePage = () => {
	const [results, setResults] = useState([]);

	const handleSearch = async (searchTerms) => {
		let data;
		if (searchTerms.category || searchTerms.tag) {
			// Fetch activities and itineraries by category/tag
			data = await fetch(`/api/activities/search?category=${searchTerms.category}&tag=${searchTerms.tag}`);
		} else if (searchTerms.name || searchTerms.tag) {
			// Fetch historical places and museums by name/tag
			data = await fetch(`/api/museums/search?name=${searchTerms.name}&tag=${searchTerms.tag}`);
		}
		setResults(await data.json());
	};

	const handleFilter = async (filters) => {
		let data;
		if (filters.budget || filters.rating) {
			data = await fetch(`/api/activities/filter?budget=${filters.budget}&date=${filters.date}&category=${filters.category}&rating=${filters.rating}`);
		} else if (filters.preferences || filters.language) {
			data = await fetch(`/api/itineraries/filter?budget=${filters.budget}&date=${filters.date}&preferences=${filters.preferences}&language=${filters.language}`);
		} else if (filters.tags) {
			data = await fetch(`/api/museums/filter?tags=${filters.tags}`);
		}
		setResults(await data.json());
	};

	const handleSort = async (sortBy) => {
		let data = await fetch(`/api/activities/sort?sort=${sortBy}`);
		setResults(await data.json());
	};

	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold mb-4">Explore</h1>
			<SearchBar onSearch={handleSearch}/>
			<FilterSection onFilter={handleFilter}/>
			<SortSection onSort={handleSort}/>
			<ResultsList results={results}/>
		</div>
	);
};

export default ExplorePage;