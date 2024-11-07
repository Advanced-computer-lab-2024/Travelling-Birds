//Generic LogIn component

import {useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import ReusableInput from "./ReusableInput";
import {sessionStorageEvent} from "../utils/sessionStorageEvent";

const LogIn = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [userId, setuserId] = useState('');

	const navigate = useNavigate();

	const handleLogIn = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.user) {
					sessionStorage.setItem('user id', data.user._id);
					sessionStorage.setItem('role', data.user.role);
					if (data.user.termsFlag === false && (data.user.role === "tour_guide" || data.user.role === "advertiser" || data.user.role === "seller")) {
						setuserId(data.user._id);
						setShowTermsModal(true);
						window.dispatchEvent(sessionStorageEvent);
					}

					else{
					window.dispatchEvent(sessionStorageEvent);
					toast.success('Logged in successfully');
					navigate('/explore', {replace: true});
				} }
					else if (data?.message === 'Profile not approved yet. Please wait for admin approval.') {
					toast.error('Profile not approved yet. Please wait for admin approval.');
				} else {
					toast.error('Invalid credentials');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to log in');
			});
	}
	const handleAcceptTerms = async() => {
		try{
			console.log("try to fetch");
			await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ termsFlag: true})
			});

			console.log("we fetched correctly n changed");
		}
		catch(error) {
			console.log(error);
		}
		setShowTermsModal(false);
		toast.success('Terms accepted');
		navigate('/profile', { replace: true });
	};

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				handleLogIn();
			}}>
				<h1 className="text-2xl font-bold mb-4">Log in</h1>
				<ReusableInput type="text" name="Username" value={username}
				               onChange={e => setUsername(e.target.value)}/>
				<ReusableInput type="password" name="Password" value={password}
				               onChange={e => setPassword(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Log in</button>
			</form>
			{showTermsModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
						<h2 className="text-xl font-bold mb-4">Accept Terms and Conditions</h2>
						<p>Please read and accept the terms and conditions to proceed.</p>
						<button
							className="w-full bg-blue-500 text-white py-2 rounded mt-4"
							onClick={handleAcceptTerms}
						>
							Accept
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default LogIn;