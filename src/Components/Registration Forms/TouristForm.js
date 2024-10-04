const {useState} = require("react");

export const TouristForm = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [nationality, setNationality] = useState('');
	const [dob, setDob] = useState('');
	const [job, setJob] = useState('');

	const registerTourist = () => {
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
				mobileNumber,
				nationality,
				dob,
				job,
				role: 'tourist'
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
				registerTourist();
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
				<label className="block mb-2">Mobile Number
					{/**/}
					<input type="text" name="mobileNumber" className="w-full px-3 py-2 border rounded mt-1"
					       value={mobileNumber} onChange={e => setMobileNumber(e.target.value)}/>
				</label>
				<label className="block mb-2">Nationality
					{/**/}
					<input type="text" name="nationality" className="w-full px-3 py-2 border rounded mt-1"
					       value={nationality} onChange={e => setNationality(e.target.value)}/>
				</label>
				<label className="block mb-2">Date of Birth
					{/**/}
					<input type="date" name="dob" className="w-full px-3 py-2 border rounded mt-1" value={dob}
					       onChange={e => setDob(e.target.value)}/>
				</label>
				<label className="block mb-2">Job
					{/**/}
					<input type="text" name="job" className="w-full px-3 py-2 border rounded mt-1" value={job}
					       onChange={e => setJob(e.target.value)}/>
				</label>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}