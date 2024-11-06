import React, {useState} from 'react';
import {toast} from "react-toastify";

const AdminForm = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const registerAdmin = (e) => {
		e.preventDefault();
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
				role: 'admin'
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.data?._id) {
					toast.success('User added successfully');
				} else {
					toast.error('Failed to register user');
				}
			})
	}

	return (
		<div className="card w-96 bg-base-100 shadow-xl mx-auto mt-10">
			<div className="card-body">
				<h2 className="card-title text-2xl font-bold mb-4">Add Admin</h2>
				<form onSubmit={registerAdmin}>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">First Name</span>
						</div>
						<input className="input input-bordered" placeholder="John" value={firstName}
						       onChange={e => setFirstName(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Last Name</span>
						</div>
						<input className="input input-bordered" placeholder="Doe" value={lastName}
						       onChange={e => setLastName(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Email</span>
						</div>
						<input className="input input-bordered" placeholder="" value={email}
						       onChange={e => setEmail(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Username</span>
						</div>
						<input className="input input-bordered" placeholder="Admin" value={username}
						       onChange={e => setUsername(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Password</span>
						</div>
						<input type="password" className="input input-bordered" placeholder="Admin" value={password}
						       onChange={e => setPassword(e.target.value)}/>
					</label>

					<button type="submit" className="btn btn-primary mt-4">Create Account</button>
				</form>
			</div>
		</div>
	);
}
const TourismGovernorForm = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const registerTourismGovernor = (e) => {
		e.preventDefault()
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
				role: 'tourism_governor'
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data?.data?._id) {
					toast.success('User added successfully');
				} else {
					toast.error('Failed to register user');
				}
			})
	}

	return (
		<div className="card w-96 bg-base-100 shadow-xl mx-auto mt-10">
			<div className="card-body">
				<h2 className="card-title text-2xl font-bold mb-4">Add Tourism Governor</h2>
				<form onSubmit={registerTourismGovernor}>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">First Name</span>
						</div>
						<input className="input input-bordered" placeholder="John" value={firstName}
						       onChange={e => setFirstName(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Last Name</span>
						</div>
						<input className="input input-bordered" placeholder="Doe" value={lastName}
						       onChange={e => setLastName(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Email</span>
						</div>
						<input className="input input-bordered" placeholder="" value={email}
						       onChange={e => setEmail(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Username</span>
						</div>
						<input className="input input-bordered" placeholder="Admin" value={username}
						       onChange={e => setUsername(e.target.value)}/>
					</label>

					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Password</span>
						</div>
						<input type="password" className="input input-bordered" placeholder="Admin" value={password}
						       onChange={e => setPassword(e.target.value)}/>
					</label>

					<button type="submit" className="btn btn-primary mt-4">Create Account</button>
				</form>
			</div>
		</div>
	);
}

const CreateNewAccounts = () => {
	return (
		<div className="container mx-auto mt-10">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold">Create New Accounts</h1>
				<p className="text-lg mt-2">Please fill out the forms below to create new admin and tourism governor
					accounts.</p>
			</div>
			<div className="flex justify-around">
				<AdminForm/>
				<TourismGovernorForm/>
			</div>
		</div>
	);
}

export default CreateNewAccounts;

