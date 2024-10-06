import React, {useState} from 'react';

const SortSection = ({onSort}) => {
	const [sortBy, setSortBy] = useState('');

	const handleSort = () => {
		onSort(sortBy);
	};

	return (
		<div className="flex flex-col space-y-4 mb-4">
			<select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
				<option value="">Sort By</option>
				<option value="price">Price</option>
				<option value="rating">Rating</option>
			</select>
			<button onClick={handleSort} className="bg-blue-500 text-white p-2 rounded">Sort</button>
		</div>
	);
};

export default SortSection;