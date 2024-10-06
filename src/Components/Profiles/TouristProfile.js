import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const TouristProfile = ({user, displayOnly}) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [mobileNumber, setMobileNumber] = useState(user.mobileNumber || '');
	const [nationality, setNationality] = useState(user.nationality || '');
	const [dob, setDob] = useState(user.dob || '');
	const [job, setJob] = useState(user.job || '');
	const [isEditing, setIsEditing] = useState(false);
	const navigate = useNavigate();

	const updateTourist = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				username,
				mobileNumber,
				nationality,
				dob,
				job,
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('User updated successfully');
					navigate('/profile', {replace: true});
				} else {
					toast.error('Failed to update user');
				}
			}).catch((error) => {
			console.log(error);
		});
	}
	const deleteTourist = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'User deleted successfully') {
					toast.success('User deleted successfully');
				} else {
					toast.error('Failed to delete user');
				}
			}).catch((error) => {
			console.log(error);
		});
	}

	useEffect(() => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setEmail(user.email);
		setUsername(user.username);
		setMobileNumber(user.mobileNumber);
		setNationality(user.nationality);
		setDob(user.dob);
		setJob(user.job);
	}, [user]);

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				if (isEditing) {
					updateTourist();
				}
				setIsEditing(!isEditing);
			}}>
				{!displayOnly && <h1 className="text-2xl font-bold mb-4">Update Profile</h1>}
				<ReusableInput type="text" name="First Name" value={firstName}
				               onChange={e => setFirstName(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Last Name" value={lastName}
				               onChange={e => setLastName(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="email" name="Email" value={email}
				               onChange={e => setEmail(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Username" value={username}
				               onChange={e => setUsername(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="password" name="Password" value={password}
				               onChange={e => setPassword(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Mobile Number" value={mobileNumber}
				               onChange={e => setMobileNumber(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Nationality" value={nationality}
				               onChange={e => setNationality(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="date" name="Date of Birth" value={dob}
				               onChange={e => setDob(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Job" value={job}
				               onChange={e => setJob(e.target.value)} disabled={!isEditing}/>
				{!displayOnly &&
					<button type="submit"
					        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1">
						{isEditing ? 'Confirm' : 'Update'}
					</button>
				}
				<button type="button"
				        onClick={() => {
					        if (window.confirm('Are you sure you wish to delete this item?')) {
						        deleteTourist();
					        }
				        }}
				        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-1">
					Delete
				</button>
			</form>
		</div>
	);
}

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
		_id: PropTypes.string.isRequired,
	}).isRequired,
	displayOnly: PropTypes.bool.isRequired,
};

export default TouristProfile;