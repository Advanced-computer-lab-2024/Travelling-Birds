import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";

const GeneralNavBar = () => {
	const navigate = useNavigate();

	const handleSignInClick = () => {
		navigate('/register');
	};

	return (
		<NavBar>
			<div className="flex items-center justify-between w-full px-4">
				{/* Left: Logo */}
				<div className="mr-72">
					<NavLink to='/explore' replace={true}
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Logo
					</NavLink>
				</div>

				{/* Center: Navigation buttons */}
				<div className="flex-grow flex justify-center space-x-4 mr-72">
					<NavLink to='/products'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Discover
					</NavLink>
					<NavLink to='/places'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Trips
					</NavLink>
					<NavLink to='/itineraries'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Review
					</NavLink>
					<NavLink to='/more'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						More
					</NavLink>
				</div>

				{/* Right: EGP button and Sign In button */}
				<div className="flex items-center space-x-6">
					<button
						className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						EGP
					</button>
					<button
						onClick={handleSignInClick}
						className="px-8 py-2 bg-[#330577] text-white font-semibold rounded-full hover:opacity-85 transition duration-200 whitespace-nowrap">
						Sign In
					</button>
				</div>
			</div>
		</NavBar>
	);
};

export default GeneralNavBar;
