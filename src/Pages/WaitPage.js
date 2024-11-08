import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Assets/Logo.png';

const WaitPage = () => {
	const navigate = useNavigate();

	const handleExploreClick = () => {
		navigate('/explore');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			 	
					<img src={Logo} alt="logo" className="w-[600px] h-[600px] object-cover"/>
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
