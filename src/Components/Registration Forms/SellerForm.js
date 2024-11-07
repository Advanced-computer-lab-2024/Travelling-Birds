import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SellerRegisterForm = ({ onChangeRole }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [identityCard, setIdentityCard] = useState(null);
	const [taxRegCard, setTaxRegCard] = useState(null);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};

		if (!username) newErrors.username = 'The field above is required';
		if (!email) newErrors.email = 'The field above is required';
		if (!firstName) newErrors.firstName = 'The field above is required';
		if (!lastName) newErrors.lastName = 'The field above is required';
		if (!password) newErrors.password = 'The field above is required';
		if (!confirmPassword) newErrors.confirmPassword = 'The field above is required';

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Please enter a valid email format.';
		}

		if (password && confirmPassword && password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match.';
		}

		if (!identityCard) newErrors.identityCard = 'The field above is required';
		if (!taxRegCard) newErrors.taxRegCard = 'The field above is required';

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
				setErrors((prevErrors) => ({ ...prevErrors, username: 'User already exists.' }));;
				return;
			}
			if (response.status !== 201) {
				throw new Error('Error checking username availability');
			}

			// Proceed with registration if all checks pass
			const formData = new FormData();
			formData.append('username', username);
			formData.append('firstName', firstName);
			formData.append('lastName', lastName);
			formData.append('email', email);
			formData.append('password', password);
			formData.append('role', 'seller');
			formData.append('isApproved', false);
			formData.append('identityCard', identityCard);
			formData.append('taxRegCard', taxRegCard);

			const registerResponse = await fetch(`${process.env.REACT_APP_BACKEND}/api/users`, {
				method: 'POST',
				body: formData,
			});

			if (registerResponse.ok) {
				navigate('/wait');
			} else {
				throw new Error('Failed to register');
			}
		} catch (error) {
			console.error('Registration error:', error);
			toast.error('Registration failed. Please try again later.');
		}
	};

	const handleIdentityCardChange = (e) => {
		setIdentityCard(e.target.files[0]);
	};

	const handleTaxRegCardChange = (e) => {
		setTaxRegCard(e.target.files[0]);
	};

	return (
		<div className="bg-white shadow-lg rounded-lg  p-4 w-full max-w-sm mx-auto">
			<h1 className="text-3xl font-bold text-[#330577] text-center mb-4">Let's Get Started</h1>
			<div className="mb-2">
				<label className="text-2xl font-bold mb-2">Register</label>
			</div>
			<div className="mb-2">
				<label className="block text-gray-700">Username</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
			</div>
			<div className="mb-2 flex space-x-2">
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
						className="w-full p-2 border border-gray-300 rounded mt-0.5"
					/>
					{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
				</div>
			</div>
			<div className="mb-2">
				<label className="block text-gray-700">Email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
			</div>
			<div className="mb-2">
				<label className="block text-gray-700">Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
			</div>
			<div className="mb-2">
				<label className="block text-gray-700">Confirm Password</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
			</div>
			<div className="mb-2">
				<label className="block text-gray-700">ID File</label>
				<input
					type="file"
					onChange={handleIdentityCardChange}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.identityCard && <p className="text-red-500 text-sm">{errors.identityCard}</p>}
			</div>
			<div className="mb-2">
				<label className="block text-gray-700">Tax Registration Card</label>
				<input
					type="file"
					onChange={handleTaxRegCardChange}
					className="w-full p-2 border border-gray-300 rounded mt-0.5"
				/>
				{errors.taxRegCard && <p className="text-red-500 text-sm">{errors.taxRegCard}</p>}
			</div>
			<button
				onClick={handleRegister}
				className="w-full bg-[#330577] text-white py-2 mt-2 rounded hover:bg-[#4a1a99]"
			>
				Register
			</button>
			<div className="mt-3 text-center">
				<p className="text-gray-700">
					Not a seller?<br/>
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
						onClick={() => onChangeRole('Tourist')}
					>
            Tourist
          </span>
				</p>
			</div>
		</div>
	);
};

export default SellerRegisterForm;
