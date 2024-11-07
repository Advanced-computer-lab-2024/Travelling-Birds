import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import { useEffect, useState, useRef } from "react";
import { sessionStorageEvent } from "../../utils/sessionStorageEvent";
import Badge1 from '../../Assets/Badge/Badge1.png';
import Badge2 from '../../Assets/Badge/Badge2.png';
import Badge3 from '../../Assets/Badge/Badge3.png';
import {toast} from "react-toastify";

const TouristNavBar = () => {
	const [id, setId] = useState(sessionStorage.getItem('user id'));
	const [user, setUser] = useState({});
	const [currency, setCurrency] = useState('EGP');
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [badgeDropdownVisible, setBadgeDropdownVisible] = useState(false);
	const navigate = useNavigate();
	const dropdownRef = useRef(null);

	const handleLogOut = () => {
		sessionStorage.removeItem('user id');
		sessionStorage.removeItem('role');
		window.dispatchEvent(sessionStorageEvent);
		toast.success('Logged out successfully');
		navigate('/login', { replace: true });
	};

	const handleCurrencyChange = (newCurrency) => {
		setCurrency(newCurrency);
		setIsPopupVisible(false);
		sessionStorage.setItem('currency', newCurrency);
	};

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await res.json();
				setUser(data);
				console.log('User profile:', data);
			} catch (err) {
				console.log('Error fetching user profile', err);
			}
		};

		if (!id) {
			console.log('User id not found');
			return;
		}
		fetchUserProfile().then(() => console.log('User profile fetched'));
	}, [id]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownVisible(false);
				setBadgeDropdownVisible(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	let imageBase64 = null;
	if (user.profilePicture?.data?.data && user.profilePicture.contentType) {
		try {
			const byteArray = new Uint8Array(user.profilePicture.data.data);
			const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
			imageBase64 = `data:${user.profilePicture.contentType};base64,${btoa(binaryString)}`;
		} catch (error) {
			console.error('Error converting image data to base64:', error);
		}
	}

	let badgeImage = null;
	let badgeLevel = '';
	let pointsToNextBadge = '';
	if (user.loyaltyPoints <= 100000) {
		badgeImage = Badge1;
		badgeLevel = 'Level 1';
		pointsToNextBadge = `${100000 - user.loyaltyPoints} points remaining to next badge`;
	} else if (user.loyaltyPoints <= 500000) {
		badgeImage = Badge2;
		badgeLevel = 'Level 2';
		pointsToNextBadge = `${500000 - user.loyaltyPoints} points remaining to next badge`;
	} else if (user.loyaltyPoints > 500000) {
		badgeImage = Badge3;
		badgeLevel = 'Level 3';
		pointsToNextBadge = 'You have acquired the highest level!';
	}

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
	};

	return (
		<NavBar>
			<div className="flex items-center justify-between w-full px-16 py-3"> {/* Increased padding for more space and shifted down */}
				{/* Left: Logo */}
				<div className="mr-80">
					<NavLink to='/explore' replace={true}
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-6 py-3 text-xl">
						Logo
					</NavLink>
				</div>

				{/* Center: Navigation buttons */}
				<div className="flex-grow flex justify-center space-x-8 mr-80">
					<NavLink to='/products'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Discover
					</NavLink>
					<NavLink to='/bookings'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Bookings
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

				{/* Right: Profile picture, EGP button, and Badge */}
				<div className="flex items-center space-x-8">
					<button
						onClick={() => setIsPopupVisible(true)}
						className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						{currency}
					</button>

					{/* Currency Popup */}
					{isPopupVisible && (
						<div className="fixed inset-0  bg-black bg-opacity-30 flex items-center justify-center z-20">
							<dialog open id="currency_modal" className="modal modal-bottom sm:modal-middle">
								<div className="modal-box">
									<div className="flex justify-between items-center mb-4">
										<h2 className="font-bold text-lg" style={{ color: '#330577' }}>Choose a currency</h2>
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
							</dialog>
						</div>
					)}
					<div className="relative flex items-center space-x-4" ref={dropdownRef}> {/* Adjusted spacing */}
						<button onClick={toggleDropdown} className="flex items-center focus:outline-none">
							<div
								className="w-16 h-16 rounded-full border border-white transition duration-200 hover:bg-[#330577] flex items-center justify-center"> {/* Increased size */}
								<img
									src={imageBase64}
									alt="User Profile"
									className="w-full h-full rounded-full hover:opacity-70 transition duration-200"
								/>
							</div>
						</button>
						{dropdownVisible && (
							<div
								className="absolute right-24 top-full mt-2 w-56 bg-white rounded-lg z-10 shadow-[0px_4px_12px_rgba(0,0,0,0.6)]"
							>
								<ul className="py-2">
									<li>
										<NavLink
											to='/profile'
											className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-lg"
											onClick={() => setDropdownVisible(false)}
										>
											Profile
										</NavLink>
									</li>
									<li>
										<NavLink
											to='/complaints'
											className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-lg"
											onClick={() => setDropdownVisible(false)}
										>
											Complaints
										</NavLink>
									</li>
									<li>
										<button
											onClick={() => {
												setDropdownVisible(false);
												handleLogOut();
											}}
											className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-lg"
										>
											Log Out
										</button>
									</li>
								</ul>
							</div>
						)}
						{badgeImage && (
							<div className="relative">
								<img
									src={badgeImage}
									alt="Loyalty Badge"
									className="w-16 h-16 rounded-full cursor-pointer ml-4" /* Increased size and spacing */
									onMouseEnter={() => setBadgeDropdownVisible(true)}
									onMouseLeave={() => setBadgeDropdownVisible(false)}
								/>
								{badgeDropdownVisible && (
									<div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-30">
										<p className="font-semibold text-gray-800">Badge Level: {badgeLevel}</p>
										{user.loyaltyPoints <= 500000 ? (
											<p className="text-gray-600">{pointsToNextBadge}</p>
										) : (
											<p className="text-gray-600">You have acquired the highest level!</p>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</NavBar>
	);
};

export default TouristNavBar;
