import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const SellerProfile = ({user, displayOnly}) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [description, setDescription] = useState(user.description || '');
	const [isEditing, setIsEditing] = useState(false);
	const [showProfileDetails, setShowProfileDetails] = useState(true);
	const navigate = useNavigate();

	const updateSeller = () => {
		// Preparing the data object to send in the update request
		const updateData = {firstName, lastName, email, username, description};
		// Include password only if it has been modified
		if (password) updateData.password = password;

		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData)
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('User updated successfully');
					setIsEditing(false);
					setShowProfileDetails(false);
				} else {
					toast.error('Failed to update user');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('An error occurred while updating the user');
			});
	}

	const requestAccountDeletion = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/requestDelete/${user._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			if (response.ok) {
				toast.success('Deletion request sent successfully');
			} else {
				const data = await response.json();
				toast.error(data.message || 'Failed to send deletion request');
			}
		} catch (error) {
			console.log(error);
			toast.error('An error occurred while sending the deletion request');
		}
	};

	const approveSeller = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({isApproved: true})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('User approved successfully');
				} else {
					toast.error('Failed to approve user');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('An error occurred while approving the user');
			});
	};

	useEffect(() => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setEmail(user.email);
		setUsername(user.username);
		setDescription(user.description);
	}, [user]);

	return (
		<div
			className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${!showProfileDetails && 'hidden'}`}>
			{showProfileDetails && (
				<form
					className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl border border-gray-200 z-60 overflow-y-auto max-h-[90vh]"
					onSubmit={(e) => {
						e.preventDefault();
						if (isEditing) updateSeller();
						else setIsEditing(true);
					}}
				>
					{!displayOnly &&
						<h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">Seller
							Profile</h1>}

					<div className="grid gap-3 sm:gap-4 mb-4">
						<ReusableInput type="text" name="First Name" value={firstName}
						               onChange={e => setFirstName(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Last Name" value={lastName}
						               onChange={e => setLastName(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="email" name="Email" value={email} onChange={e => setEmail(e.target.value)}
						               disabled={!isEditing}/>
						<ReusableInput type="text" name="Username" value={username}
						               onChange={e => setUsername(e.target.value)} disabled={true}/>
						<ReusableInput type="password" name="Password" value={password}
						               onChange={e => setPassword(e.target.value)} disabled={!isEditing}
						               placeholder="Leave blank to keep current password"/>
						<ReusableInput type="text" name="Description" value={description}
						               onChange={e => setDescription(e.target.value)} disabled={!isEditing}/>
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

					{displayOnly && !user.isApproved && (
						<button
							type="button"
							onClick={approveSeller}
							className="w-full py-2 sm:py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition duration-300 mb-2"
						>
							Approve User
						</button>
					)}

					<button
						type="button"
						onClick={() => {
							if (window.confirm('Are you sure you wish to delete this account?')) {
								requestAccountDeletion();
							}
						}}
						className="w-full py-2 sm:py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition duration-300"
					>
						Request Deletion
					</button>
				</form>
			)}
		</div>
	);
};

SellerProfile.propTypes = {
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		description: PropTypes.string,
		_id: PropTypes.string.isRequired,
		isApproved: PropTypes.bool,
	}).isRequired,
	displayOnly: PropTypes.bool.isRequired,
};

export default SellerProfile;
