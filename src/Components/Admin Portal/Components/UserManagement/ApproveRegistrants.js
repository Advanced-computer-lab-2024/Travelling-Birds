import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

const ApproveRegistrants = () => {
	const [tourGuides, setTourGuides] = useState([]);
	const [advertisers, setAdvertisers] = useState([]);
	const [sellers, setSellers] = useState([]);
	const [loading, setLoading] = useState(true);

	const approveUser = (userId) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				isApproved: true
			})
		})
			.then((response) => response.json())
			.then(data => {
				if (data?.isApproved === true) {
					toast.success('User approved successfully');
					updateArrays(data, data.role);
				} else {
					toast.error('Failed to approve user');
				}
			});
	}
	const updateArrays = (user, role) => {
		if (role === 'tour_guide') {
			setTourGuides(tourGuides.filter(tourGuide => tourGuide._id !== user._id));
		}
		if (role === 'advertiser') {
			setAdvertisers(advertisers.filter(advertiser => advertiser._id !== user._id));
		}
		if (role === 'seller') {
			setSellers(sellers.filter(seller => seller._id !== user._id));
		}
	}

	useEffect(() => {
		const updateUsers = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/users/unapproved`)
				.then((response) => response.json())
				.then(data => {
					setTourGuides(data.tour_guides);
					setAdvertisers(data.advertisers);
					setSellers(data.sellers);
					setLoading(false);
				});
		}
		updateUsers();
		window.addEventListener('userDeleted', updateUsers);

		return () => {
			window.removeEventListener('userDeleted', updateUsers);
		};
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Approve New Registrants</h2>
			{!loading && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<h3 className="text-xl font-bold mb-2">Tour Guides</h3>
						<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
								<tr>
									<th>Name</th>
									<th>Username</th>
									<th>Email</th>
									<th>Approve</th>
								</tr>
								</thead>
								<tbody>
								{tourGuides.map((user) => (
									<tr key={user._id}>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>
											<button className="btn btn-primary btn-sm" onClick={() => {
												approveUser(user._id);
											}}>Approve
											</button>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-2">Advertisers</h3>
						<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
								<tr>
									<th>Name</th>
									<th>Username</th>
									<th>Email</th>
									<th>Approve</th>
								</tr>
								</thead>
								<tbody>
								{advertisers.map((user) => (
									<tr key={user._id}>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>
											<button className="btn btn-primary btn-sm" onClick={() => {
												approveUser(user._id);
											}}>Approve
											</button>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-2">Sellers</h3>
						<div className="overflow-x-auto">
							<table className="table w-full">
								<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Username</th>
									<th>Approve</th>
								</tr>
								</thead>
								<tbody>
								{sellers.map((user) => (
									<tr key={user._id}>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>
											<button className="btn btn-primary btn-sm" onClick={() => {
												approveUser(user._id);
											}}>Approve
											</button>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ApproveRegistrants;