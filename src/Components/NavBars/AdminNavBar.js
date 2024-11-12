import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import { useEffect, useState, useRef } from "react";
import { sessionStorageEvent } from "../../utils/sessionStorageEvent";
import {toast} from "react-toastify";
import Logo from "../../Assets/Logo2.png";

const AdminNavBar = () => {
	const [id, setId] = useState(sessionStorage.getItem('user id'));
	const [user, setUser] = useState({});
	const [currency, setCurrency] = useState(() => sessionStorage.getItem('currency') || 'EGP');
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const navigate = useNavigate();
	const dropdownRef = useRef(null);
	const [adminUrl, setAdminUrl] = useState(window.location.pathname.includes('/admin'));

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
		setAdminUrl(window.location.pathname.includes('/admin'));
	}, [window.location.pathname]);

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
			} catch (err) {
				console.log('Error fetching user profile', err);
			}
		};

		if (!id) {
			console.log('User id not found');
			return;
		}
		fetchUserProfile();
		window.addEventListener("userUpdated", fetchUserProfile);
		return () =>{window.removeEventListener("userUpdated", fetchUserProfile)}
	}, [id]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownVisible(false);
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

	const toggleDropdown = () => {
		setDropdownVisible(!dropdownVisible);
	};

	return (
		!adminUrl && <NavBar>
			<div className="flex items-center justify-between w-full px-16 py-3">
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

				<div className="flex-grow flex justify-center space-x-4 mr-72">
					<NavLink to='/products'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Products
					</NavLink>
					<NavLink to='/admin'
					         className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						Admin
					</NavLink>
				</div>

				{/* Right: Profile picture and EGP button */}
				<div className="flex items-center space-x-6">
					<button
						onClick={() => setIsPopupVisible(true)}
						className="text-black font-semibold hover:bg-[#330577] hover:text-white rounded-md px-4 py-2 text-lg">
						{currency}
					</button>

					{/* Currency Popup */}
					{isPopupVisible && (
						<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
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
					<div className="relative" ref={dropdownRef}>
						<button onClick={toggleDropdown} className="flex items-center focus:outline-none">
							<div
								className="w-12 h-12 rounded-full border border-white transition duration-200 hover:bg-[#330577] flex items-center justify-center">
								<img
									src={imageBase64}
									alt="User Profile"
									className="w-full h-full rounded-full hover:opacity-70 transition duration-200"
								/>
							</div>
						</button>
						{dropdownVisible && (
							<div
								className="absolute right-0 mt-4 w-56 bg-white rounded-lg z-10 shadow-[0px_4px_12px_rgba(0,0,0,0.6)]">
								<ul className="py-2 mt-2">
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
					</div>
				</div>
			</div>
		</NavBar>
	);
};

export default AdminNavBar;
