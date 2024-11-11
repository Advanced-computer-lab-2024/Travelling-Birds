import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import { useEffect, useState, useRef } from "react";
import { sessionStorageEvent } from "../../utils/sessionStorageEvent";
import Badge1 from '../../Assets/Badge/Badge1.png';
import Badge2 from '../../Assets/Badge/Badge2.png';
import Badge3 from '../../Assets/Badge/Badge3.png';
import {toast} from "react-toastify";
import Logo from "../../Assets/Logo2.png";

const TouristNavBar = () => {
	const [id, setId] = useState(sessionStorage.getItem('user id'));
	const [user, setUser] = useState({});
	const [currency, setCurrency] = useState(() => sessionStorage.getItem('currency') || 'EGP');
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [badgeDropdownVisible, setBadgeDropdownVisible] = useState(false);
	const [redeemPopupVisible, setRedeemPopupVisible] = useState(false);
	const [redeemPoints, setRedeemPoints] = useState(0);
	const [redeemEgp, setRedeemEgp] = useState(0);
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
		window.location.reload();
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
		window.addEventListener("userUpdated", fetchUserProfile);
		return () =>{window.removeEventListener("userUpdated", fetchUserProfile)}
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
	if (user.profilePicture?.data?.data && user.profilePicture?.contentType) {
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
	const handleBadgeClick = () => {
		setRedeemPopupVisible(true);
	};
	const handleRedeemPointsChange = (increment) => {
		const newPoints = Math.max(0, Math.min(user.redeemablePoints, redeemPoints + increment));
		setRedeemPoints(newPoints);
		setRedeemEgp(newPoints / 100); // 10,000 points = 100 EGP, so 1 point = 0.01 EGP
	};

	const handleRedeemEgpChange = (increment) => {
		const newEgp = Math.max(0, Math.min(user.redeemablePoints / 100, redeemEgp + increment));
		setRedeemEgp(newEgp);
		setRedeemPoints(newEgp * 100); // Convert EGP back to points
	};

	const handleRedeem = async () => {
		try {
			const newRedeemablePoints = user.redeemablePoints - redeemPoints;
			const newWalletAmount = user.wallet + redeemEgp;
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ redeemablePoints: newRedeemablePoints, wallet: newWalletAmount }),
			});
			setUser((prevUser) => ({ ...prevUser, redeemablePoints: newRedeemablePoints, wallet: newWalletAmount }));
			setRedeemPopupVisible(false);
			toast.success('Points redeemed successfully');
		} catch (error) {
			console.error('Error redeeming points:', error);
			toast.error('Failed to redeem points');
		}
	};

	return (
		<NavBar>
			<div className="flex items-center justify-between w-full px-16 py-3"> {/* Increased padding for more space and shifted down */}
				{/* Left: Logo */}
				<div className="flex items-center mr-72">
    				 <NavLink to='/explore' replace={true} className="flex items-center space-x-2 group">
        				<div className="flex items-center space-x-2 group-hover:brightness-150 transition duration-200">
            				<img src={Logo} alt="Logo" className="w-16 h-16" />
            				<span className="text-2xl font-bold text-[#330577]">Travelling Birds</span>
        				</div>
   					 </NavLink>
					</div>
				{/* Center: Navigation buttons */}
				<div className="flex-grow flex justify-center space-x-8 mr-80">

					<NavLink to='/products'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Products
					</NavLink>
					<NavLink to='/flights-and-hotels'
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
					{redeemPopupVisible && (
						<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
							<dialog open id="currency_modal" className="modal modal-bottom sm:modal-middle">
								<div className="modal-box">
									<div className="flex flex-col items-center mb-4">
										{/* Bigger header */}
										<h2 className="font-extrabold text-2xl mb-4" style={{color: '#330577'}}>
											Redeem Your Points!
										</h2>
										{user.redeemablePoints >= 10000 ? (
											<p className="self-start mb-2 text-lg font-semibold">
												Your current Redeemable Points: {user.redeemablePoints}
											</p>
										) : (
											<p className="mt-4 text-gray-500 text-center">
												You need at least 10,000 points to redeem.<br/>
												Current Redeemable Points: {user.redeemablePoints}
											</p>
										)}
										{user.redeemablePoints >= 10000 ? (
											<div className="flex justify-center items-center mt-4">
												<div className="flex flex-col items-center">
													{/* Increment/decrement strictly by 10,000 points */}
													<button
														onClick={() => handleRedeemPointsChange(
															Math.min(10000, Math.floor(user.redeemablePoints / 10000) * 10000 - redeemPoints)
														)}
														className="mb-1 px-2 py-1 bg-gray-200 rounded">▲
													</button>
													<input type="text" value={redeemPoints} readOnly
													       className="text-center w-20 border rounded py-1"/>
													<p>Points</p>
													<button
														onClick={() => handleRedeemPointsChange(
															-Math.min(10000, redeemPoints)
														)}
														className="mt-1 px-2 py-1 bg-gray-200 rounded">▼
													</button>
												</div>
												<span className="mx-4">→</span>
												<div className="flex flex-col items-center">
													<button
														onClick={() => handleRedeemEgpChange(
															Math.min(100, (Math.floor(user.redeemablePoints / 100) * 100) - redeemEgp)
														)}
														className="mb-1 px-2 py-1 bg-gray-200 rounded">▲
													</button>
													<input type="text" value={redeemEgp} readOnly
													       className="text-center w-20 border rounded py-1"/>
													<p>EGP</p>
													<button
														onClick={() => handleRedeemEgpChange(
															-Math.min(100, redeemEgp)
														)}
														className="mt-1 px-2 py-1 bg-gray-200 rounded">▼
													</button>
												</div>
											</div>
										) : null}
										<div className="flex justify-center mt-6 space-x-4">
											{user.redeemablePoints >= 10000 && (
												<button onClick={handleRedeem}
												        className="px-4 py-2 bg-[#330577] text-white rounded hover:bg-opacity-85">
													Redeem
												</button>
											)}
											<button onClick={() => setRedeemPopupVisible(false)}
											        className="px-4 py-2 bg-[#330577] text-white rounded hover:bg-opacity-85">
												Close
											</button>
										</div>
									</div>
								</div>
							</dialog>
						</div>
					)}
					<div className="relative flex items-center space-x-4"
					     ref={dropdownRef}> {/* Adjusted spacing */}
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
									<NavLink to='/my-purchases'
									         className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-lg"
									         onClick={() => setDropdownVisible(false)}>
										 My Purchases
									</NavLink>
									</li>
									<li>
									<NavLink to='/bookings'
									         className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-lg"
									         onClick={() => setDropdownVisible(false)}>
										My Bookings
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
									className="w-16 h-16 rounded-full cursor-pointer ml-4"
									onClick={handleBadgeClick}/* Increased size and spacing */
									onMouseEnter={() => setBadgeDropdownVisible(true)}
									onMouseLeave={() => setBadgeDropdownVisible(false)}
								/>
								{badgeDropdownVisible && (
									<div
										className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-30 text-center">
										<p className="font-semibold text-gray-800">Badge Level: {badgeLevel}</p>
										{user.loyaltyPoints <= 500000 ? (
											<p className="text-gray-600">{pointsToNextBadge}</p>
										) : (
											<p className="text-gray-600">You have acquired the highest level!</p>
										)}
										<p className="mt-2 text-gray-600">Click badge to redeem points</p>
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
