import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReuseableInput";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const TourGuideProfile = ({user}) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [yearsOfExperience, setYearsOfExperience] = useState(user.yearsOfExperience || '');
	const [previousWork, setPreviousWork] = useState(user.previousWork || '');
	const [isEditing, setIsEditing] = useState(false);
	const navigate = useNavigate();

	const updateTourGuide = () => {
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
				yearsOfExperience,
				previousWork,
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

	useEffect(() => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setEmail(user.email);
		setUsername(user.username);
		setYearsOfExperience(user.yearsOfExperience);
		setPreviousWork(user.previousWork);
	}, [user]);

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				if (isEditing) {
					updateTourGuide();
				}
				setIsEditing(!isEditing);
			}}>
				<h1 className="text-2xl font-bold mb-4">Update Profile</h1>
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
				<ReusableInput type="number" name="Years of Experience" value={yearsOfExperience}
				               onChange={e => setYearsOfExperience(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Previous Work" value={previousWork}
				               onChange={e => setPreviousWork(e.target.value)} disabled={!isEditing}/>
				<button type="submit"
				        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1">
					{isEditing ? 'Confirm' : 'Update'}
				</button>
			</form>
		</div>
	);
}

TourGuideProfile.propTypes = {
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		yearsOfExperience: PropTypes.string,
		previousWork: PropTypes.string,
		_id: PropTypes.string.isRequired,
	}).isRequired,
};

export default TourGuideProfile;