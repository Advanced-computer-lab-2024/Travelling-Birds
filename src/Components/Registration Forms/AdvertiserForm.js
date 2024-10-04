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
			.then((data) => console.log(data))
			.catch((error) => console.error('Error:', error));
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerAdvertiser();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register</h1>
				<label className="block mb-2">First Name
					{/**/}
					<input type="text" name="firstName" className="w-full px-3 py-2 border rounded mt-1"
					       value={firstName} onChange={e => setFirstName(e.target.value)}/>
				</label>
				<label className="block mb-2">Last Name
					{/**/}
					<input type="text" name="lastName" className="w-full px-3 py-2 border rounded mt-1" value={lastName}
					       onChange={e => setLastName(e.target.value)}/>
				</label>
				<label className="block mb-2">Email
					{/**/}
					<input type="email" name="email" className="w-full px-3 py-2 border rounded mt-1" value={email}
					       onChange={e => setEmail(e.target.value)}/>
				</label>
				<label className="block mb-2">Username
					{/**/}
					<input type="text" name="username" className="w-full px-3 py-2 border rounded mt-1" value={username}
					       onChange={e => setUsername(e.target.value)}/>
				</label>
				<label className="block mb-2">Password
					{/**/}
					<input type="password" name="password" className="w-full px-3 py-2 border rounded mt-1"
					       value={password} onChange={e => setPassword(e.target.value)}/>
				</label>
				<label className="block mb-2">Website
					{/**/}
					<input type="text" name="website" className="w-full px-3 py-2 border rounded mt-1" value={website}
					       onChange={e => setWebsite(e.target.value)}/>
				</label>
				<label className="block mb-2">Hotline
					{/**/}
					<input type="text" name="hotline" className="w-full px-3 py-2 border rounded mt-1" value={hotline}
					       onChange={e => setHotline(e.target.value)}/>
				</label>
				<label className="block mb-2">Company Profile
					{/**/}
					<input type="text" name="companyProfile" className="w-full px-3 py-2 border rounded mt-1"
					       value={companyProfile} onChange={e => setCompanyProfile(e.target.value)}/>
				</label>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

module.exports = AdvertiserForm;