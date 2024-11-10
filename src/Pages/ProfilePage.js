import React, { useEffect, useState } from "react";
import TouristProfile from "../Components/Profiles/TouristProfile";
import SellerProfile from "../Components/Profiles/SellerProfile";
import AdvertiserProfile from "../Components/Profiles/AdvertiserProfile";
import TourGuideProfile from "../Components/Profiles/TourGuideProfile";
import AdminProfile from "../Components/Profiles/AdminProfile";
import TourismGovernorProfile from "../Components/Profiles/TourismGovernorProfile";


const ProfilePage = () => {
	const userId = sessionStorage.getItem('user id');
	const [user, setUser] = useState({});
	const [showProfileDetails, setShowProfileDetails] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const [backgroundImage, setBackgroundImage] = useState(
		localStorage.getItem(`backgroundImage_${userId}`) || ''
	);
	const [profilePicture, setProfilePicture] = useState(
		localStorage.getItem(`profilePicture_${userId}`) || ''
	);

	const [favoritePlaces, setFavoritePlaces] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const [interest, setInterest] = useState('');

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

	const handleSearch = async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND}/api/places/search?query=${encodeURIComponent(searchQuery)}`
			);
			if (res.ok) {
				const data = await res.json();
				setSearchResults(Array.isArray(data) ? data : []);
			} else {
				console.error("Error fetching search results");
				setSearchResults([]);
			}
		} catch (err) {
			console.error("Error searching places:", err);
			setSearchResults([]);
		}
	};

	const addFavoritePlace = async (place) => {
		const updatedFavorites = [...favoritePlaces, place];
		setFavoritePlaces(updatedFavorites);
		try {
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}/favorites`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ favoritePlaces: updatedFavorites }),
			});
		} catch (err) {
			console.error("Error adding favorite place:", err);
		}
	};

	const removeFavoritePlace = async (placeId) => {
		const updatedFavorites = favoritePlaces.filter((p) => p.id !== placeId);
		setFavoritePlaces(updatedFavorites);
		try {
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}/favorites`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ favoritePlaces: updatedFavorites }),
			});
		} catch (err) {
			console.error("Error removing favorite place:", err);
		}
	};

	const handleRemoveProfilePicture = () => {
		setProfilePicture('');  // Remove the profile picture from the state
		localStorage.removeItem(`profilePicture_${userId}`);  // Remove from localStorage
	};

	const handleRemoveBackgroundImage = () => {
		setBackgroundImage('');  // Remove the background image from the state
		localStorage.removeItem(`backgroundImage_${userId}`);  // Remove from localStorage
	};



	return (
		<div style={{ position: 'relative', height: '100vh', backgroundColor: '#f5f5f5' }}>
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
							<img src={profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
						) : (
							<>
								<span style={{
									color: '#888',
									fontSize: '14px',
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
				left: '23%',
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
					Location: {user.location || "Location not set"}
				</p>
				<p style={{
					color: '#777',
				}}>
					Joined: {user.joinDate || "Date not available"}
				</p>
			</div>

			{/*  (Fill Out Your Profile container) */}
			<div style={{
				width: '700px',
				height: '150px',
				backgroundColor: 'white',
				borderRadius: '0px',
				position: 'absolute',
				top: '570px',
				left: 'calc(23% + 220px)',  // Position this container next to the "About Me" container
				boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
				padding: '20px',
				textAlign: 'center',
				zIndex: 2,
			}}>
				<h3 style={{
					fontWeight: 'bold',
					color: '#000',
					marginBottom: '17px',
					fontSize: '22px',
				}}>
					Fill Out Your Profile
				</h3>
				<p style={{
					color: '#777',
					marginBottom: '10px',
					fontSize: '16px',
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
				left: '16.77%',  // Position this container next to the "About Me" container
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

			{/* Favorite Places Section */}
			<div style={{
				width: "300px",
				height: "330px",
				backgroundColor: "white",
				borderRadius: "0px",
				position: "absolute",
				top: "570px",
				left: "23%",
				transform: "translateX(-50%)",
				boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
				padding: "20px",
				textAlign: "center",
				zIndex: 2,
			}}>
				<h3 style={{ fontWeight: "bold", color: "#000" }}>Favorite Places</h3>

				{/* Search and Add to Favorites */}
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search places..."
					style={{ padding: "8px", marginBottom: "10px", width: "80%" }}
				/>
				<button onClick={handleSearch} style={{ padding: "8px 10px" }}>Search</button>

				{/* Display Search Results */}
				<div style={{ marginTop: "15px" }}>
					{searchResults.map((place) => (
						<div key={place.id} style={{ marginBottom: "8px" }}>
							<span>{place.name}</span>
							<button
								onClick={() => addFavoritePlace(place)}
								style={{ marginLeft: "10px", padding: "4px 8px" }}
							>
								Add
							</button>
						</div>
					))}
				</div>

				{/* Display Favorite Places */}
				<div style={{ marginTop: "20px" }}>
					{favoritePlaces.length > 0 ? (
						favoritePlaces.map((place) => (
							<div key={place.id} style={{ marginBottom: "8px" }}>
								<span>{place.name}</span>
								<button
									onClick={() => removeFavoritePlace(place.id)}
									style={{ marginLeft: "10px", padding: "4px 8px" }}
								>
									Remove
								</button>
							</div>
						))
					) : (
						<p>No favorite places added yet.</p>
					)}
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
