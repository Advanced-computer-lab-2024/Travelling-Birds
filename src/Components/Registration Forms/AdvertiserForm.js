import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import ReusableInput from "../ReusableInput";
import {sessionStorageEvent} from "../../utils/sessionStorageEvent";

const {useState} = require("react");

const AdvertiserForm = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [website, setWebsite] = useState('');
	const [hotline, setHotline] = useState('');
	const [companyProfile, setCompanyProfile] = useState('');
	const navigate = useNavigate();

	const registerAdvertiser = () => {
		console.log('Button clicked');
		fetch(`${process.env.REACT_APP_BACKEND}/api/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				username,
				password,
				role: 'advertiser',
				website,
				hotline,
				companyProfile
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.data._id) {
					sessionStorage.setItem('user id', data.data._id);
					sessionStorage.setItem('role', 'advertiser');
					window.dispatchEvent(sessionStorageEvent);
					toast.success('User added successfully');
					navigate('/profile', {replace: true});
				} else {
					toast.error('Failed to register user');
				}
			});
	};

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerAdvertiser();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register</h1>
				<ReusableInput type="text" name="First Name" value={firstName}
				               onChange={e => setFirstName(e.target.value)}/>
				<ReusableInput type="text" name="Last Name" value={lastName}
				               onChange={e => setLastName(e.target.value)}/>
				<ReusableInput type="email" name="Email" value={email}
				               onChange={e => setEmail(e.target.value)}/>
				<ReusableInput type="text" name="Username" value={username}
				               onChange={e => setUsername(e.target.value)}/>
				<ReusableInput type="password" name="Password" value={password}
				               onChange={e => setPassword(e.target.value)}/>
				<ReusableInput type="text" name="Website" value={website}
				               onChange={e => setWebsite(e.target.value)}/>
				<ReusableInput type="text" name="Hotline" value={hotline}
				               onChange={e => setHotline(e.target.value)}/>
				<ReusableInput type="text" name="Company Profile" value={companyProfile}
				               onChange={e => setCompanyProfile(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
};

export default AdvertiserForm;