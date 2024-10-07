import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {sessionStorageEvent} from "../../utils/sessionStorageEvent";
import {userDeletionEvent} from "../../utils/userDeletionEvent";

const TourismGovernorProfile = ({user, displayOnly}) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const navigate = useNavigate();

	const updateTourismGovernor = () => {
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
	const deleteTourismGovernor = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'User deleted successfully') {
					sessionStorage.removeItem('user id');
					sessionStorage.removeItem('role');
					window.dispatchEvent(sessionStorageEvent);
					window.dispatchEvent(userDeletionEvent);
					if (!displayOnly) navigate('/', {replace: true});
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
	}, [user]);

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				if (isEditing) {
					updateTourismGovernor();
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
				{!displayOnly &&
					<button type="submit"
					        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1">
						{isEditing ? 'Confirm' : 'Update'}
					</button>
				}
				<button type="button"
				        onClick={() => {
					        if (window.confirm('Are you sure you wish to delete this item?')) {
						        deleteTourismGovernor();
					        }
				        }}
				        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-1">
					Delete
				</button>
			</form>
		</div>
	);
}

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