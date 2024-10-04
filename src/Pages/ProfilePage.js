import React, {useEffect, useState} from "react";

const ProfilePage = () => {
	const [user, setUser] = useState({});
	// useEffect(() => {
	// 	const fetchJobs = async () => {
	// 		const apiUrl = isHome ? 'http://localhost:3001/jobs?_limit=3' : 'http://localhost:3001/jobs';
	// 		try {
	// 			const res = await fetch(apiUrl);
	// 			const data = await res.json();
	// 			setJobs(data);
	// 		} catch (err) {
	// 			console.log('Error fetching jobs', err);
	// 		}
	// 		finally {
	// 			setLoading(false);}
	// 	}
	// 	fetchJobs();
	// }, []);
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await fetch('`${process.env.REACT_APP_BACKEND}/api/users/profile/${id}`');
				const data = await res.json();
				setUser(data);
				console.log(data);
			} catch (err) {
				console.log('Error fetching user profile', err);
			}
		}
	}, []);
	return (
		<div className="bg-gray-100 min-h-screen p-6">
			{/* Profile Header */}
			<div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
				<div>
					<h1 className="text-3xl font-bold">{user.firstName}</h1>
					<p className="text-xl text-gray-700">{user.role}</p>
					<p className="text-gray-500"></p>
				</div>
			</div>

			{/* Summary Section */}
			<div className="mt-8 bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-2xl font-bold mb-4">Summary</h2>
				<p>
					Experienced Civil Engineer with a demonstrated history of working in
					the engineering consultancy industry. Skilled in project management,
					structural analysis, and construction engineering.
				</p>
			</div>

			{/* Experience Section */}
			<div className="mt-8 bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-2xl font-bold mb-4">Experience</h2>
				<div className="mb-6">
					<h3 className="text-xl font-semibold">Senior Civil Engineer</h3>
					<p className="text-gray-700">Surbana Jurong - Nov 2023 - Present</p>
					<p className="text-gray-500">Cairo, Egypt</p>
					<p className="mt-2">
						Working as a PMC consultant on large-scale infrastructure projects.
					</p>
				</div>
				<div className="mb-6">
					<h3 className="text-xl font-semibold">Intern</h3>
					<p className="text-gray-700">
						Digital Factory, Arab African International Bank - Summer 2024
					</p>
					<p className="text-gray-500">Cairo, Egypt</p>
					<p className="mt-2">
						Worked on the development of a merchant portal using React and
						Node.js.
					</p>
				</div>
			</div>

			{/* Education Section */}
			<div className="mt-8 bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-2xl font-bold mb-4">Education</h2>
				<div className="mb-6">
					<h3 className="text-xl font-semibold">German University in Cairo</h3>
					<p className="text-gray-700">B.Sc. in Computer Engineering</p>
					<p className="text-gray-500">2021 - 2025</p>
				</div>
			</div>

			{/* Skills Section */}
			<div className="mt-8 bg-white shadow-lg rounded-lg p-6">
				<h2 className="text-2xl font-bold mb-4">Skills</h2>
				<ul className="list-disc list-inside">
					<li>Project Management</li>
					<li>Structural Analysis</li>
					<li>React & Node.js</li>
					<li>Agile Methodologies</li>
				</ul>
			</div>
		</div>
	);
};

export default ProfilePage;
