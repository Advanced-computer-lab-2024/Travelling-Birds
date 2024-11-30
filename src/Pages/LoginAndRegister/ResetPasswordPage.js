import React from 'react';
import Logo from '../../Assets/Logo.png';
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const ResetPasswordPage = () => {
	const [email, setEmail] = React.useState('');
	const [otp, setOtp] = React.useState('');
	const [otpSent, setOtpSent] = React.useState(false);
	const [newPassword, setNewPassword] = React.useState('');
	const [newPasswordConfirm, setNewPasswordConfirm] = React.useState('');
	const navigate = useNavigate();

	const initiateOTP = async (e) => {
		e.preventDefault();
		const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/request-otp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email})
		});

		if (!response.ok) {
			toast.error('Failed to send OTP');
			return;
		}

		toast.info('OTP Sent to provided email');
		setOtpSent(true);
	}

	const checkOTP = async (e) => {
		e.preventDefault();
		if (newPassword !== newPasswordConfirm) {
			toast.error('Passwords do not match');
			return;
		}
		const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/verify-otp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email, otp, newPassword})
		});

		if (!response.ok) {
			toast.error('Failed to verify OTP');
			return;
		}

		toast.success('Password Reset Successfully');

		navigate('/login', {replace: true});
	}

	return (
		<div className="flex items-center justify-center h-[calc(100vh-80px)] bg-[#fcfcfc]">

			{/* Left Side - Logo Placeholder */}
			<div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)] w-[50%]">
				<div className="flex-1 flex items-center justify-center h-max w-max">
					<img src={Logo} alt="logo" className="w-[600px] h-[600px] object-cover"/>
				</div>
			</div>
			{/* Right Side - Card */}
			<div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)] w-[50%]">
				<div className="bg-white shadow-2xl rounded-xl p-8 h-max w-max">
					<h1 className="text-3xl font-bold text-center text-[#330577] mb-8">For Travel Lovers</h1>
					<div className="mb-6">
						{/* Reset Password Form */}
						{otpSent ?
							<form onSubmit={(e) => checkOTP(e)}>
								<div className="mb-4">
									<label className="block text-gray-700">One Time Password</label>
									<input
										type="password"
										className="w-full p-2 border border-gray-300 rounded"
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										required
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700">New Password</label>
									<input
										type="password"
										className="w-full p-2 border border-gray-300 rounded"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
								</div>
								<div className="mb-4">
									<label className="block text-gray-700">Re-Enter Password</label>
									<input
										type="password"
										className="w-full p-2 border border-gray-300 rounded"
										value={newPasswordConfirm}
										onChange={(e) => setNewPasswordConfirm(e.target.value)}
										required
									/>
								</div>
								<button type="submit" className="bg-primary text-white p-2 rounded w-full"
								        onClick={initiateOTP}>Re-Send OTP
								</button>
								<button type="submit" className="bg-primary text-white p-2 rounded w-full">Reset
									Password
								</button>
							</form>
							:
							<form onSubmit={initiateOTP}>
								<div className="mb-4">
									<label className="block text-gray-700">Email</label>
									<input
										type="email"
										className="w-full p-2 border border-gray-300 rounded"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<button type="submit" className="bg-primary text-white p-2 rounded w-full">Request OTP
								</button>
							</form>
						}
					</div>
				</div>
			</div>
		</div>

	);
};

export default ResetPasswordPage;
