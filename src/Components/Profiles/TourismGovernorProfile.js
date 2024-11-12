import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sessionStorageEvent } from "../../utils/sessionStorageEvent";
import { userDeletionEvent } from "../../utils/userDeletionEvent";

const TourismGovernorProfile = ({ user, displayOnly }) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [showProfileDetails, setShowProfileDetails] = useState(true);
	const navigate = useNavigate();

	const updateTourismGovernor = async () => {
		try {
			// Create an object to store only the necessary update data
			const updateData = { firstName, lastName, email, username };

			// Only add password to updateData if it has been provided (not empty)
			if (password) {
				updateData.password = password;
			}

			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();

			if (data?._id) {
				toast.success("Profile updated successfully");

				// Clear the password field after a successful update
				setPassword('');

				setIsEditing(false);
				setShowProfileDetails(false);
				navigate('/profile', { replace: true });
			} else {
				toast.error("Failed to update profile");
			}
		} catch (error) {
			toast.error("Failed to update profile");
			console.log(error);
		}
	};

	useEffect(() => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setEmail(user.email);
		setUsername(user.username);
	}, [user]);

	return (
		<div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${!showProfileDetails && 'hidden'}`}>
			{showProfileDetails && (
				<form
					className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl border border-gray-200 z-60 overflow-y-auto max-h-[90vh]"
					onSubmit={(e) => {
						e.preventDefault();
						if (isEditing) updateTourismGovernor(); // Call update function on confirm
						else setIsEditing(true);
					}}
				>
					{!displayOnly && <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">Profile</h1>}

					<div className="grid gap-3 sm:gap-4 mb-4">
						<ReusableInput type="text" name="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="email" name="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={true}/>
						<ReusableInput type="password" name="Password" value={password} onChange={e => setPassword(e.target.value)} disabled={!isEditing}/>
					</div>

					{!displayOnly && (
						<div className="flex justify-between">
							<button
								type="submit"
								className={`w-full py-2 sm:py-3 mb-3 mr-2 rounded-lg font-semibold ${
									isEditing ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
								} text-white transition duration-300`}
							>
								{isEditing ? 'Confirm' : 'Edit'}
							</button>

							<button
								type="button"
								onClick={() => setShowProfileDetails(false)}
								className="w-full py-2 sm:py-3 mb-3 ml-2 rounded-lg font-semibold bg-gray-400 hover:bg-gray-500 text-white transition duration-300"
							>
								Cancel
							</button>
						</div>
					)}
				</form>
			)}
		</div>
	);
};

TourismGovernorProfile.propTypes = {
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		_id: PropTypes.string.isRequired,
	}).isRequired,
	displayOnly: PropTypes.bool.isRequired,
};

export default TourismGovernorProfile;
