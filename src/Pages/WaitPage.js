import React from 'react';
import { useNavigate } from 'react-router-dom';

const WaitPage = () => {
	const navigate = useNavigate();

	const handleExploreClick = () => {
		navigate('/explore');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<h1 className="text-5xl font-bold mb-40">Logo Should be here</h1> {/* Adjusted mb-6 for 15px gap */}
			<p className="text-2xl mb-8 text-center">
				Please wait until your account gets approved. Meanwhile you can:
			</p>
			<button
				onClick={handleExploreClick}
				className="bg-[#330577] text-white py-3 px-8 text-xl rounded hover:bg-[#4a1a99] transition"
			>
				Explore
			</button>
		</div>
	);
};

export default WaitPage;
