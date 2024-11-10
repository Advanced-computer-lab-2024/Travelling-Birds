import React, { useEffect, useState } from "react";
import TouristProfile from "../Components/Profiles/TouristProfile";
import SellerProfile from "../Components/Profiles/SellerProfile";
import AdvertiserProfile from "../Components/Profiles/AdvertiserProfile";
import TourGuideProfile from "../Components/Profiles/TourGuideProfile";
import AdminProfile from "../Components/Profiles/AdminProfile";
import TourismGovernorProfile from "../Components/Profiles/TourismGovernorProfile";

import logo from '../utils/logoTravelingBirds.png';



const ProfilePage = () => {
	const userId = sessionStorage.getItem('user id');
	const [user, setUser] = useState({});
	const [showProfileDetails, setShowProfileDetails] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const [backgroundImage, setBackgroundImage] = useState(
		localStorage.getItem(`backgroundImage_${userId}`) || ''
	);
	const [profilePicture, setProfilePicture] = useState(localStorage.getItem(`profilePicture_${userId}`) || null);


	const [selectedFavoritePlaces, setSelectedFavoritePlaces] = useState(
		JSON.parse(localStorage.getItem(`favoritePlaces_${userId}`)) || []
	);
	const [selectedFavoriteFood, setSelectedFavoriteFood] = useState(
		JSON.parse(localStorage.getItem(`favoriteFood_${userId}`)) || []
	);
	const [selectedBudget, setSelectedBudget] = useState(
		JSON.parse(localStorage.getItem(`budget_${userId}`)) || []
	);
	const [favoritePlacesOptions] = useState(['Historical Places', 'Beaches', 'Museums']);
	const [favoriteFoodOptions] = useState(['Family Friendly', 'Couples only']);
	const [budgetOptions] = useState(['$500-$1000', '$1000-$4000', '$4000-20,000','$20000 or more']);

	useEffect(() => {
		localStorage.setItem(`favoritePlaces_${userId}`, JSON.stringify(selectedFavoritePlaces));
	}, [selectedFavoritePlaces, userId]);

	useEffect(() => {
		localStorage.setItem(`favoriteFood_${userId}`, JSON.stringify(selectedFavoriteFood));
	}, [selectedFavoriteFood, userId]);

	useEffect(() => {
		localStorage.setItem(`budget_${userId}`, JSON.stringify(selectedBudget));
	}, [selectedBudget, userId]);


	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = await res.json();
				setUser(data);

				if (data.profilePicture && !localStorage.getItem(`profilePicture_${userId}`)) {
					setProfilePicture(data.profilePicture);
					localStorage.setItem(`profilePicture_${userId}`, data.profilePicture);
				}
				if (data.backgroundImage && !localStorage.getItem(`backgroundImage_${userId}`)) {
					setBackgroundImage(data.backgroundImage);
					localStorage.setItem(`backgroundImage_${userId}`, data.backgroundImage);
				}
			} catch (err) {
				console.error('Error fetching user profile:', err);
			}
		};
		if (userId) fetchUserProfile();
	}, [userId]);

	const toBase64 = (file) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

	const handleProfilePictureChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = await toBase64(file);
			setProfilePicture(imageUrl);
			localStorage.setItem(`profilePicture_${userId}`, imageUrl);
		}
	};

	const handleBackgroundImageChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = await toBase64(file);
			setBackgroundImage(imageUrl);
			localStorage.setItem(`backgroundImage_${userId}`, imageUrl);
		}
	};

	const handleProfileDetailsClick = () => {
		setShowProfileDetails(false);
		setTimeout(() => setShowProfileDetails(true), 0);
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};



	const handleRemoveProfilePicture = () => {
		setProfilePicture('');  // Remove the profile picture from the state
		localStorage.removeItem(`profilePicture_${userId}`);  // Remove from localStorage
	};

	const handleRemoveBackgroundImage = () => {
		setBackgroundImage('');  // Remove the background image from the state
		localStorage.removeItem(`backgroundImage_${userId}`);  // Remove from localStorage
	};

	const handleFavoritePlaceSelect = (place) => {
		if (!selectedFavoritePlaces.includes(place)) {
			setSelectedFavoritePlaces([...selectedFavoritePlaces, place]);
		}
	};

	const handleFavoriteFoodSelect = (food) => {
		if (!selectedFavoriteFood.includes(food)) {
			setSelectedFavoriteFood([...selectedFavoriteFood, food]);
		}
	};

	const handleBudgetSelect = (budget) => {
		if (!selectedBudget.includes(budget)) {
			setSelectedBudget([...selectedBudget, budget]);
		}
	};

	const handleRemoveFavoritePlace = (place) => {
		setSelectedFavoritePlaces(selectedFavoritePlaces.filter(item => item !== place));
	};

	const handleRemoveFavoriteFood = (food) => {
		setSelectedFavoriteFood(selectedFavoriteFood.filter(item => item !== food));
	};

	const handleRemoveBudget = (budget) => {
		setSelectedBudget(selectedBudget.filter(item => item !== budget));
	};




	return (
		<div style={{ position: 'relative', height: 'auto', backgroundColor: '#f5f5f5' }}>
			{/* Background Image Section */}
			<div
				style={{
					height: '400px',
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					position: 'relative',
				}}
			>
				{!backgroundImage && (
					<label style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 1,
						background: 'rgba(0, 0, 0, 0.5)',
						color: 'white',
						padding: '10px 20px',
						borderRadius: '5px',
						cursor: 'pointer'
					}}>
						Add Background Picture
						<input type="file" onChange={handleBackgroundImageChange} style={{ display: 'none' }} />
					</label>
				)}
			</div>

			{/* Profile Container */}
			<div style={{
				width: '95%',
				maxWidth: '1600px',
				height: '250px',
				backgroundColor: 'white',

				borderRadius: '0px',
				position: 'absolute',
				top: '300px',
				left: '50%',
				transform: 'translateX(-50%)',
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
				padding: '40px',
				zIndex: 2,
				textAlign: 'center'
			}}>
				{/* Profile Picture */}
				<div style={{ position: 'absolute', top: '5px', left: '20px' }}>
					<div style={{
						width: '120px',
						height: '120px',
						borderRadius: '50%',
						overflow: 'hidden',
						border: '2px solid grey',
						backgroundColor: '#f0f0f0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						position: 'relative'
					}}>
						{profilePicture ? (
							<img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
						) : (
							<>
				<span style={{
					color: '#888',
					fontSize: '20px',
					textAlign: 'center'
				}}>
					+
				</span>
								<input type="file" onChange={handleProfilePictureChange} style={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									opacity: 0,
									cursor: 'pointer'
								}} />
							</>
						)}
					</div>
				</div>


				<div style={{ position: 'absolute', top: '20px', left: '160px', textAlign: 'left' }}>
					<h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
						{user.firstName || 'First Name'}
					</h2>
					<h4 style={{ margin: 0, fontSize: '16px', color: '#555' }}>
						{user.username || 'Username'}
					</h4>
				</div>

				<div style={{ position: 'absolute', top: '10px', right: '10px' }}>
					<button style={{ border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer' }} onClick={toggleDropdown}>
						⚙
					</button>

					{dropdownOpen && (
						<div style={{
							position: 'absolute',
							top: '40px',
							right: '0px',
							background: 'white',
							border: '1px solid grey',
							borderRadius: '5px',
							boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
							width: '200px',
							zIndex: 3,
							textAlign: 'left'
						}}>
							<button onClick={handleProfileDetailsClick} style={{
								display: 'block',
								width: '100%',
								padding: '10px',
								border: '1px solid grey',
								textAlign: 'left',
								background: 'white',
								color: 'black',
								cursor: 'pointer'
							}}>View Profile
							</button>
							<label style={{
								display: 'block',
								width: '100%',
								padding: '10px',
								border: '1px solid grey',
								textAlign: 'left',
								color: 'black',
								cursor: 'pointer'
							}}>
								Change Cover Photo
								<input type="file" onChange={handleBackgroundImageChange} style={{display: 'none'}}/>
							</label>
							<label style={{
								display: 'block',
								width: '100%',
								padding: '10px',
								border: '1px solid grey',
								textAlign: 'left',
								color: 'black',
								cursor: 'pointer'
							}}>
								Change Profile Photo
								<input type="file" onChange={handleProfilePictureChange} style={{display: 'none'}}/>
							</label>
							<button onClick={handleRemoveBackgroundImage} style={{
								display: 'block',
								width: '100%',
								padding: '10px',
								border: '1px solid grey',
								textAlign: 'left',
								background: 'white',
								color: 'black',
								cursor: 'pointer'
							}}>
								Remove Cover Photo
							</button>
							<button onClick={handleRemoveProfilePicture} style={{
								display: 'block',
								width: '100%',
								padding: '10px',
								border: '1px solid grey',
								textAlign: 'left',
								background: 'white',
								color: 'black',
								cursor: 'pointer'
							}}>
								Remove Profile Photo
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Intro Container */}
			<div style={{
				width: '300px',
				height: '200px',
				backgroundColor: 'white',
				borderRadius: '0px',
				position: 'absolute',
				top: '912px',
				left: '15.5%',
				transform: 'translateX(-50%)',
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
				padding: '20px',
				textAlign: 'left',
				zIndex: 2,
			}}>
				<h3 style={{
					fontWeight: 'bold',
					color: '#000',
					marginBottom: '15px',  // Add spacing below "About Me"
				}}>
					About Me
				</h3>
				<p style={{
					color: '#777',
					marginBottom: '10px',  // Add spacing between paragraphs
				}}>
					{user.bio || "Write about yourself here."}
				</p>
				<p style={{
					color: '#777',
					marginBottom: '10px',
				}}>
					📍Egypt
				</p>
				<p style={{
					color: '#777',
				}}>
					Joined: {user.joinDate || "Date not available"}
				</p>
			</div>

			{/*  (Fill Out Your Profile container) */}
			<div style={{
				width: '900px',
				height: '150px',
				backgroundColor: 'white',
				borderRadius: '0px',
				position: 'absolute',
				top: '570px',
				left: 'calc(23% + 220px)',  // Position this container next to the "About Me" container
				transform: 'translateX(-15%)',
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
				padding: '20px',
				textAlign: 'center',
				zIndex: 2,
			}}>
				<h3 style={{
					fontWeight: 'bold',
					color: '#000',
					marginBottom: '17px',
					fontSize: '24px',
				}}>
					Fill Out Your Profile
				</h3>
				<p style={{
					color: '#777',
					marginBottom: '10px',
					fontSize: '20px',
				}}>
					Add photos and info to your profile so people can find you easily and get to know you better!
				</p>
			</div>

			{/* (Contact Info container) */}
			<div style={{
				width: '300px',
				height: '200px',
				backgroundColor: 'white',
				borderRadius: '0px',
				position: 'absolute',
				top: '1130px',
				left: '15.5%',  // Position this container next to the "About Me" container
				transform: 'translateX(-50%)',
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
				padding: '20px',
				textAlign: 'left',
				zIndex: 2,
			}}>
				<h3 style={{
					fontWeight: 'bold',
					color: '#000',
					marginBottom: '15px',
				}}>
					Contact Info
				</h3>
				<p style={{
					color: '#777',
					marginBottom: '10px',
				}}>
					Email: {user.email || "Email not set"}
				</p>
				<p style={{
					color: '#777',
					marginBottom: '10px',
				}}>
					Phone: {user.phone || "Phone not set"}
				</p>
				<p style={{
					color: '#777',
				}}>
					Address: {user.address || "Address not set"}
				</p>
			</div>

			{/* Preferences Section */}
			<div style={{
				width: "300px",
				height: "330px",
				backgroundColor: "white",
				borderRadius: "0px",
				position: "absolute",
				top: "570px",
				left: "15.5%",
				transform: "translateX(-50%)",
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
				padding: "20px",
				textAlign: "center",
				zIndex: 2,
			}}>
				<h3 style={{ fontWeight: "bold", color: "#000",marginBottom: '15px', textAlign: "left"}}>Your Preferences</h3>

				{/* Scrollable content container */}
				<div style={{
					maxHeight: "250px",  // Adjust maxHeight as needed
					overflowY: "auto",
				}}>
					{/* Dropdown for selecting favorite places */}
					<div>
						<select onChange={(e) => handleFavoritePlaceSelect(e.target.value)} defaultValue="">
							<option value="" disabled>Preferred Places</option>
							{favoritePlacesOptions.map((place, index) => (
								<option key={index} value={place}>{place}</option>
							))}
						</select>
						{/* Display selected favorite places */}
						<div style={{ marginTop: '10px' }}>
							{selectedFavoritePlaces.map((place, index) => (
								<span key={index} style={{
									display: 'inline-block', padding: '5px 10px', margin: '5px', backgroundColor: '#e0e0e0', borderRadius: '15px',
								}}>
                        {place}
									<button onClick={() => handleRemoveFavoritePlace(place)} style={{
										background: "none", border: "none", color: "red", marginLeft: "5px", cursor: "pointer",
									}}>
                            ✕
                        </button>
                    </span>
							))}
						</div>

						{/* Dropdown for selecting favorite food */}
						<select onChange={(e) => handleFavoriteFoodSelect(e.target.value)} defaultValue="" style={{ marginTop: '10px' }}>
							<option value="" disabled>Preferred Hotels</option>
							{favoriteFoodOptions.map((food, index) => (
								<option key={index} value={food}>{food}</option>
							))}
						</select>
						{/* Display selected favorite food */}
						<div style={{ marginTop: '10px' }}>
							{selectedFavoriteFood.map((food, index) => (
								<span key={index} style={{
									display: 'inline-block', padding: '5px 10px', margin: '5px', backgroundColor: '#e0e0e0', borderRadius: '15px',
								}}>
                        {food}
									<button onClick={() => handleRemoveFavoriteFood(food)} style={{
										background: "none", border: "none", color: "red", marginLeft: "5px", cursor: "pointer",
									}}>
                            ✕
                        </button>
                    </span>
							))}
						</div>

						{/* Dropdown for selecting budget */}
						<select onChange={(e) => handleBudgetSelect(e.target.value)} defaultValue="" style={{ marginTop: '10px' }}>
							<option value="" disabled>Preferred Budget</option>
							{budgetOptions.map((budget, index) => (
								<option key={index} value={budget}>{budget}</option>
							))}
						</select>
						{/* Display selected budget */}
						<div style={{ marginTop: '10px' }}>
							{selectedBudget.map((budget, index) => (
								<span key={index} style={{
									display: 'inline-block', padding: '5px 10px', margin: '5px', backgroundColor: '#e0e0e0', borderRadius: '15px',
								}}>
                        {budget}
									<button onClick={() => handleRemoveBudget(budget)} style={{
										background: "none", border: "none", color: "red", marginLeft: "5px", cursor: "pointer",
									}}>
                            ✕
                        </button>
                    </span>
							))}
						</div>
					</div>
				</div>
			</div>






			{/* Profile Details */}
			{showProfileDetails && (
				<>
					{user.role === 'tourist' && <TouristProfile user={user} />}
					{user.role === 'seller' && <SellerProfile user={user} />}
					{user.role === 'advertiser' && <AdvertiserProfile user={user} />}
					{user.role === 'tour_guide' && <TourGuideProfile user={user} />}
					{user.role === 'admin' && <AdminProfile user={user} />}
					{user.role === 'tourism_governor' && <TourismGovernorProfile user={user} />}
				</>
			)}
		</div>
	);
};

export default ProfilePage;
