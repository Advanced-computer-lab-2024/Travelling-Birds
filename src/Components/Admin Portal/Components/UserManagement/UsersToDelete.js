import React, {useEffect, useState} from 'react';
import {userDeletionEvent} from "../../../../utils/userDeletionEvent";
import {toast} from "react-toastify";

const UsersToDelete = () => {
	const [tourists, setTourists] = useState([]);
	const [tourGuides, setTourGuides] = useState([]);
	const [advertisers, setAdvertisers] = useState([]);
	const [sellers, setSellers] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [tourismGovernors, setTourismGovernors] = useState([]);
	const [loading, setLoading] = useState(true);

	const deleteUser = (user) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}/admin`, {
			method: 'DELETE',
		}).then((response) => response.json())
			.then((data) => {
				if (data?.message === 'User deleted successfully') {
					if (user.role === 'tourist') {
						setTourists(tourists.filter(tourist => tourist._id !== user._id));
					}
					if (user.role === 'tour_guide') {
						setTourGuides(tourGuides.filter(tourGuide => tourGuide._id !== user._id));
					}
					if (user.role === 'advertiser') {
						setAdvertisers(advertisers.filter(advertiser => advertiser._id !== user._id));
					}
					if (user.role === 'seller') {
						setSellers(sellers.filter(seller => seller._id !== user._id));
					}
					if (user.role === 'admin') {
						setAdmins(admins.filter(admin => admin._id !== user._id));
					}
					if (user.role === 'tourism_governor') {
						setTourismGovernors(tourismGovernors.filter(tourismGovernor => tourismGovernor._id !== user._id));
					}
					toast.success('User deleted successfully');
				} else {
					toast.error('Failed to delete user');
				}
			}).catch((error) => {
			console.log(error);
		});
	}

	useEffect(() => {
		const updateUsers = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/users/toDelete`)
				.then((response) => response.json())
				.then(data => {
					setTourists(data.tourists);
					setTourGuides(data.tour_guides);
					setAdvertisers(data.advertisers);
					setSellers(data.sellers);
					setAdmins(data.admins);
					setTourismGovernors(data.tourism_governors);
					setLoading(false);
				});
		}
		updateUsers();
	}, []);

	const renderTouristTable = () => (
		<div className="mb-8">
			<h3 className="text-xl font-bold mb-2">Tourists</h3>
			<div className="overflow-x-auto">
				<table className="table w-full column-widths">
					<thead>
					<tr>
						<th className='w-[4%]'>Delete</th>
						<th className='w-[12.5%]'>Name</th>
						<th className='w-[12.5%]'>Username</th>
						<th className='w-[12.5%]'>Email</th>
						<th className='w-[12.5%]'>Mobile Number</th>
						<th className='w-[12.5%]'>Nationality</th>
						<th className='w-[12.5%]'>Date of Birth</th>
						<th className='w-[12.5%]'>Job</th>
					</tr>
					</thead>
					<tbody>
					{tourists?.map((user) => (
						<tr key={user._id}>
							<td>
								<button className="btn btn-primary btn-sm" onClick={() => deleteUser(user)}>Delete
								</button>
							</td>
							<td>{user.firstName + " " + user.lastName}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.mobileNumber}</td>
							<td>{user.nationality}</td>
							<td>{user.dob?.split('T')[0]}</td>
							<td>{user.job}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);

	const renderTourGuideTable = () => (
		<div className="mb-8">
			<h3 className="text-xl font-bold mb-2">Tour Guides</h3>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
					<tr>
						<th className='w-[4%]'>Delete</th>
						<th className='w-[12.5%]'>Name</th>
						<th className='w-[12.5%]'>Username</th>
						<th className='w-[12.5%]'>Email</th>
						<th className='w-[12.5%]'>Years of Experience</th>
						<th className='w-[12.5%]'>Previous Work</th>
						<th className='w-[12.5%]'></th>
						<th className='w-[12.5%]'></th>
					</tr>
					</thead>
					<tbody>
					{tourGuides?.map((user) => (
						<tr key={user._id}>
							<td>
								<button className="btn btn-primary btn-sm" onClick={() => deleteUser(user)}>Delete
								</button>
							</td>
							<td>{user.firstName + " " + user.lastName}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.yearsOfExperience}</td>
							<td>{user.previousWork}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);

	const renderAdvertiserTable = () => (
		<div className="mb-8">
			<h3 className="text-xl font-bold mb-2">Advertisers</h3>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
					<tr>
						<th className='w-[4%]'>Delete</th>
						<th className='w-[12.5%]'>Name</th>
						<th className='w-[12.5%]'>Username</th>
						<th className='w-[12.5%]'>Email</th>
						<th className='w-[12.5%]'>Website</th>
						<th className='w-[12.5%]'>Hotline</th>
						<th className='w-[12.5%]'>Company</th>
						<th className='w-[12.5%]'></th>
					</tr>
					</thead>
					<tbody>
					{advertisers?.map((user) => (
						<tr key={user._id}>
							<td>
								<button className="btn btn-primary btn-sm" onClick={() => deleteUser(user)}>Delete
								</button>
							</td>
							<td>{user.firstName + " " + user.lastName}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.website}</td>
							<td>{user.hotline}</td>
							<td>{user.companyProfile}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);

	const renderSellerTable = () => (
		<div className="mb-8">
			<h3 className="text-xl font-bold mb-2">Sellers</h3>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
					<tr>
						<th className='w-[4%]'>Delete</th>
						<th className='w-[12.5%]'>Name</th>
						<th className='w-[12.5%]'>Username</th>
						<th className='w-[12.5%]'>Email</th>
						<th className='w-[50%]'>Description</th>
					</tr>
					</thead>
					<tbody>
					{sellers?.map((user) => (
						<tr key={user._id}>
							<td>
								<button className="btn btn-primary btn-sm" onClick={() => deleteUser(user)}>Delete
								</button>
							</td>
							<td>{user.firstName + " " + user.lastName}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.description}</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Users To Be Deleted</h2>
			{!loading && (
				<>
					{renderTouristTable()}
					{renderTourGuideTable()}
					{renderAdvertiserTable()}
					{renderSellerTable()}
				</>
			)}
		</div>
	);
}

export default UsersToDelete;