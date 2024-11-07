import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TouristRegisterForm = ({ onChangeRole }) => {
	const [username, setUsername] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [nationality, setNationality] = useState('');
	const [dob, setDob] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};
		const currentDate = new Date().toISOString().split("T")[0];

		if (!username) newErrors.username = 'The field above is required';
		if (!firstName) newErrors.firstName = 'The field above is required';
		if (!lastName) newErrors.lastName = 'The field above is required';
		if (!email) newErrors.email = 'The field above is required';
		if (!mobileNumber) newErrors.mobileNumber = 'The field above is required';
		if (!nationality) newErrors.nationality = 'The field above is required';
		if (!dob) {
			newErrors.dob = 'The field above is required';
		} else if (dob >= currentDate) {
			newErrors.dob = 'Date of birth must be in the past';
		}
		if (!password) newErrors.password = 'The field above is required';
		if (!confirmPassword) newErrors.confirmPassword = 'The field above is required';

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Please enter a valid email format.';
		}
		if (password && confirmPassword && password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match.';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleRegister = async () => {
		if (!validateForm()) return;

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/username?username=${encodeURIComponent(username)}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (response.status === 200) {
				setErrors((prevErrors) => ({ ...prevErrors, username: 'User already exists.' }));
				return;
			}
			if (response.status !== 201) {
				throw new Error('Error checking username availability');
			}

			const registerResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, firstName, lastName, email, mobileNumber, nationality, dob, password, role: 'tourist' }),
			});

			if (registerResponse.status === 201) {
				navigate('/wait');
			} else {
				throw new Error('Failed to register');
			}
		} catch (error) {
			console.error('Registration error:', error);
			toast.error('Registration failed. Please try again later.');
		}
	};

	return (
		<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mx-auto">
			<h1 className="text-3xl font-bold text-[#330577] text-center mb-2">Let's Get Started</h1>
			<div className="mb-1">
				<label className="text-2xl font-bold">Register</label>
			</div>
			<div className="mb-1">
				<label className="block text-gray-700">Username</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
			</div>
			<div className="mb-1 flex space-x-2">
				<div className="w-1/2">
					<label className="block text-gray-700">First Name</label>
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded mt-0.5"
					/>
					{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
				</div>
				<div className="w-1/2">
					<label className="block text-gray-700">Last Name</label>
					<input
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded mt-1"
					/>
					{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
				</div>
			</div>
			<div className="mb-1">
				<label className="block text-gray-700">Email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
			</div>
			<div className="mb-1 flex space-x-2">
				<div className="w-1/2">
					<label className="block text-gray-700">Mobile Number</label>
					<input
					type="text"
					value={mobileNumber}
					onChange={(e) => setMobileNumber(e.target.value.replace(/\D/, ''))}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
					/>
					{errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
				</div>
				<div className="w-1/2">
					<label className="block text-gray-700">Nationality</label>
					<input
						type="text"
						value={nationality}
						onChange={(e) => setNationality(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded mt-0.5"
					/>
					{errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
				</div>
			</div>
			<div className="mb-1">
				<label className="block text-gray-700">Date of Birth</label>
				<input
					type="date"
					value={dob}
					onChange={(e) => setDob(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
			</div>
			<div className="mb-1">
				<label className="block text-gray-700">Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
			</div>
			<div className="mb-1">
				<label className="block text-gray-700">Confirm Password</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
			</div>
			<button
				onClick={handleRegister}
				className="w-full bg-[#330577] text-white py-2 mt-1 rounded hover:bg-[#4a1a99]"
			>
				Register
			</button>
			<div className="mt-3 text-center">
				<p className="text-gray-700">
					Not a tourist? <br />
					<span
						className="text-[#330577] underline cursor-pointer hover:text-[#4a1a99]"
						onClick={() => onChangeRole('Tour Guide')}
					>
            Tour Guide
          </span>
					,{' '}
					<span
						className="text-[#330577] underline cursor-pointer hover:text-[#4a1a99]"
						onClick={() => onChangeRole('Advertiser')}
					>
            Advertiser
          </span>,{' '}
					<span
						className="text-[#330577] underline cursor-pointer hover:text-[#4a1a99]"
						onClick={() => onChangeRole('Seller')}
					>
            Seller
          </span>
				</p>
			</div>
		</div>
	);
};

export default TouristRegisterForm;
