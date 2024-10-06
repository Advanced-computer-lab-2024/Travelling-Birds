import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ReusableInput from "../ReusableInput";
import {toast} from "react-toastify";

const AdvertiserProfile = ({user, displayOnly}) => {
	const [firstName, setFirstName] = useState(user.firstName || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [email, setEmail] = useState(user.email || '');
	const [username, setUsername] = useState(user.username || '');
	const [password, setPassword] = useState('');
	const [website, setWebsite] = useState(user.website || '');
	const [hotline, setHotline] = useState(user.hotline || '');
	const [companyProfile, setCompanyProfile] = useState(user.companyProfile || '');
	const [isEditing, setIsEditing] = useState(false);

	const updateAdvertiser = () => {
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
				website,
				hotline,
				companyProfile,
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('User updated successfully');
				} else {
					toast.error('Failed to update user');
				}
			}).catch((error) => {
			console.log(error);
		});
	}
	const deleteAdvertiser = () => {
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
		setWebsite(user.website);
		setHotline(user.hotline);
		setCompanyProfile(user.companyProfile);
	}, [user]);

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				if (isEditing) {
					updateAdvertiser();
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
				<ReusableInput type="text" name="Website" value={website}
				               onChange={e => setWebsite(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Hotline" value={hotline}
				               onChange={e => setHotline(e.target.value)} disabled={!isEditing}/>
				<ReusableInput type="text" name="Company Profile" value={companyProfile}
				               onChange={e => setCompanyProfile(e.target.value)} disabled={!isEditing}/>
				{!displayOnly &&
					<button type="submit"
					        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1">
						{isEditing ? 'Confirm' : 'Update'}
					</button>
				}
				<button type="button"
				        onClick={() => {
					        if (window.confirm('Are you sure you wish to delete this item?')) {
						        deleteAdvertiser();
					        }
				        }}
				        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-1">
					Delete
				</button>
			</form>
		</div>
	);
}

AdvertiserProfile.propTypes = {
	user: PropTypes.shape({
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		website: PropTypes.string,
		hotline: PropTypes.string,
		companyProfile: PropTypes.string,
		_id: PropTypes.string.isRequired,
	}).isRequired,
	displayOnly: PropTypes.bool.isRequired,
};

export default AdvertiserProfile;