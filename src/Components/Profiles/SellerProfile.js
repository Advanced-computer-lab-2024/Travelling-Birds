import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const SellerProfile = ({user}) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [description, setDescription] = useState(user.description || '');
	const [isEditing, setIsEditing] = useState(false);
	const navigate = useNavigate();

	const updateSeller = () => {
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
				description,
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
		setDescription(user.description);
	}, [user]);

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				if (isEditing) {
					updateSeller();
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
				<ReusableInput type="text" name="Description" value={description}
				               onChange={e => setDescription(e.target.value)} disabled={!isEditing}/>
				<button type="submit"
				        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1">
					{isEditing ? 'Confirm' : 'Update'}
				</button>
			</form>
		</div>
	);
}

SellerProfile.propTypes = {
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		description: PropTypes.string,
		_id: PropTypes.string.isRequired,
	}).isRequired,
};

export default SellerProfile;