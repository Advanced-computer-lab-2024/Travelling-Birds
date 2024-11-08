import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import {useState} from "react";

const GeneralNavBar = () => {
	const navigate = useNavigate();
	const [currency, setCurrency] = useState(() => sessionStorage.getItem('currency') || 'USD');
	const [isPopupVisible, setIsPopupVisible] = useState(false);

	const handleSignInClick = () => {
		navigate('/login');
	};

	const handleCurrencyChange = (newCurrency) => {
		setCurrency(newCurrency);
		setIsPopupVisible(false);
		sessionStorage.setItem('currency', newCurrency);
		window.location.reload();
	};

	return (
		<NavBar>
			<div className="flex items-center justify-between w-full px-16 py-3">
				{/* Left: Logo */}
				<div className="mr-72">
					<NavLink to='/explore' replace={true}
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-xl">
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
						onClick={() => setIsPopupVisible(true)}
						className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						{currency}
					</button>

					{/* Currency Popup */}
					{isPopupVisible && (
						<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
							<div className="bg-white rounded-lg p-6 shadow-lg w-96">
								<div className="flex justify-between items-center mb-10">
									<h2 className="text-2xl font-semibold" style={{ color: '#330577' }}>Choose a currency</h2>
									<button
										onClick={() => setIsPopupVisible(false)}
										className="text-gray-500 hover:text-gray-800 font-bold text-3xl"
									>
										&times;
									</button>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<button
										onClick={() => handleCurrencyChange('EGP')}
										className={`w-full px-4 py-2 rounded-lg text-center font-semibold ${currency === 'EGP' ? 'bg-[#330577] text-white' : 'bg-white text-black'} hover:bg-[#330577] hover:text-white hover:bg-opacity-85`}
									>
										Egyptian Pound <span className="block">EGP</span>
									</button>
									<button
										onClick={() => handleCurrencyChange('USD')}
										className={`w-full px-4 py-2 rounded-lg text-center font-semibold ${currency === 'USD' ? 'bg-[#330577] text-white' : 'bg-white text-black'} hover:bg-[#330577] hover:text-white hover:bg-opacity-85`}
									>
										US Dollar <span className="block">USD</span>
									</button>
									<button
										onClick={() => handleCurrencyChange('EUR')}
										className={`w-full px-4 py-2 rounded-lg text-center font-semibold ${currency === 'EUR' ? 'bg-[#330577] text-white' : 'bg-white text-black'} hover:bg-[#330577] hover:text-white hover:bg-opacity-85`}
									>
										Euro <span className="block">EUR</span>
									</button>
								</div>
							</div>
						</div>
					)}
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
