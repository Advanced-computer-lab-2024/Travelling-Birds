import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import { toast } from "react-toastify";

const TouristProfile = ({ user, displayOnly }) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || '');
	const [nationality, setNationality] = useState(user.nationality || '');
	const [dob, setDob] = useState(user.dob || '');
	const [job, setJob] = useState(user.job || '');
	const [wallet, setWallet] = useState(user.wallet || 0);
	const [isEditing, setIsEditing] = useState(false);
	const [showProfileDetails, setShowProfileDetails] = useState(true);

	const updateTourist = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					username,
					password,
					mobileNumber,
					nationality,
					dob,
					job,
					wallet
				})
			});
			const data = await response.json();

			if (data?._id) {
				setFirstName(data.firstName);
				setLastName(data.lastName);
				setEmail(data.email);
				setUsername(data.username);
				setMobileNumber(data.mobileNumber);
				setNationality(data.nationality);
				setDob(data.dob);
				setJob(data.job);
				setWallet(data.wallet);

				toast.success("Profile updated successfully");
				setIsEditing(false);
				setShowProfileDetails(false);
			} else {
				toast.error("Failed to update profile");
			}
		} catch (error) {
			toast.error("Failed to update profile");
			console.log(error);
		}
	};
	const requestAccountDeletion = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				requestToDelete: true,
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data?.requestToDelete === true) {
					toast.success('Account deletion requested successfully');
				} else {
					toast.error('Failed to request account deletion');
				}
			}).catch((error) => {
			console.log(error);
			toast.error('An error occurred while requesting account deletion');
		});
	};

	useEffect(() => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setEmail(user.email);
		setUsername(user.username);
		setMobileNumber(user.mobileNumber);
		setNationality(user.nationality);
		setDob(user.dob);
		setJob(user.job);
		setWallet(user.wallet);
	}, [user]);

	return (
		<div className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ${!showProfileDetails && 'hidden'}`}>
			{showProfileDetails && (
				<form
					className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl border border-gray-200 z-60 overflow-y-auto max-h-[90vh]"
					onSubmit={(e) => {
						e.preventDefault();
						if (isEditing) updateTourist(); // Call update function on confirm
						else setIsEditing(true);
					}}
				>
					{!displayOnly && <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">Profile</h1>}

					<div className="grid gap-3 sm:gap-4 mb-4">
						<ReusableInput type="text" name="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="email" name="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="password" name="Password" value={password} onChange={e => setPassword(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Mobile Number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Nationality" value={nationality} onChange={e => setNationality(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="date" name="Date of Birth" value={dob} onChange={e => setDob(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="text" name="Job" value={job} onChange={e => setJob(e.target.value)} disabled={!isEditing}/>
						<ReusableInput type="number" name="Wallet" value={wallet} onChange={e => setWallet(e.target.value)} disabled={true}/>
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

					<button
						type="button"
						onClick={() => {
							if (window.confirm('Are you sure you want to request account deletion? This requires admin approval.')) {
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

TouristProfile.propTypes = {
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		mobileNumber: PropTypes.string,
		nationality: PropTypes.string,
		dob: PropTypes.string,
		job: PropTypes.string,
		wallet: PropTypes.number,
		_id: PropTypes.string.isRequired,
	}).isRequired,
	displayOnly: PropTypes.bool.isRequired,
};

export default TouristProfile;
