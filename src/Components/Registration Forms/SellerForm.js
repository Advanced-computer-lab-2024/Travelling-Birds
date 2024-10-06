import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import ReusableInput from "../ReusableInput";

const {useState} = require("react");

export const SellerForm = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [description, setDescription] = useState('');
	const navigate = useNavigate();

	const registerSeller = () => {
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
				role: 'seller',
				description
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.data._id) {
					sessionStorage.setItem('user id', data.data._id);
					sessionStorage.setItem('role', 'seller');
					toast.success('User added successfully');
					navigate('/profile', {replace: true});
				} else {
					toast.error('Failed to register user');
				}
			})
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerSeller();
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
				<ReusableInput type="text" name="Description" value={description}
				               onChange={e => setDescription(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

