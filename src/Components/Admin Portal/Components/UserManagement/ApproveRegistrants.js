import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';

const ApproveRegistrants = () => {
	const [tourGuides, setTourGuides] = useState([]);
	const [advertisers, setAdvertisers] = useState([]);
	const [sellers, setSellers] = useState([]);
	const [loading, setLoading] = useState(true);

	const approveUser = (user) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
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
					updateArrays(user);
				} else {
					toast.error('Failed to approve user');
				}
			});
	}

	const rejectUser = (user) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/users/${user._id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then((response) => response.json())
			.then(data => {
				if (data?.message.includes('deleted')) {
					toast.success('User rejected successfully');
					updateArrays(user);
				} else {
					toast.error('Failed to reject user');
				}
			});
	}

	const downloadUserDocuments = async (user) => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/documents/${user._id}`);
			const data = await response.json();
			console.log(data);

			const zip = new JSZip();

			// Helper function to convert Buffer data to Blob
			const bufferToBlob = (buffer, contentType) => {
				const uint8Array = new Uint8Array(buffer.data);
				return new Blob([uint8Array], {type: contentType});
			};

			// Add identity card to zip
			if (data.identityCard && data.identityCard.file.data) {
				const identityCardBlob = bufferToBlob(data.identityCard.file.data, data.identityCard.file.contentType);
				zip.file(data.identityCard.name, identityCardBlob);
			}

			// Add certificates to zip
			if (data.certificates && data.certificates.length > 0) {
				data.certificates.forEach((certificate) => {
					if (certificate.file.data) {
						const certificateBlob = bufferToBlob(certificate.file.data, certificate.file.contentType);
						zip.file(certificate.name, certificateBlob);
					}
				});
			}

			// Add tax registration card to zip
			if (data.taxRegCard && data.taxRegCard.file.data) {
				const taxRegCardBlob = bufferToBlob(data.taxRegCard.file.data, data.taxRegCard.file.contentType);
				zip.file(data.taxRegCard.name, taxRegCardBlob);
			}

			// Generate the zip file and trigger download
			const content = await zip.generateAsync({type: 'blob'});
			saveAs(content, `${user.username}_documents.zip`);

		} catch (error) {
			console.error('Failed to download files:', error);
		}
	};

	const updateArrays = (user) => {
		if (user.role === 'tour_guide') {
			setTourGuides(tourGuides.filter(tourGuide => tourGuide._id !== user._id));
		}
		if (user.role === 'advertiser') {
			setAdvertisers(advertisers.filter(advertiser => advertiser._id !== user._id));
		}
		if (user.role === 'seller') {
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
									<th className='w-[20%]'>Name</th>
									<th className='w-[10%]'>Username</th>
									<th className='w-[40%]'>Email</th>
									<th className='w-[30%]'>Actions</th>
								</tr>
								</thead>
								<tbody>
								{tourGuides?.map((user) => (
									<tr key={user._id}>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>
											<button className="btn btn-primary btn-xs mr-1"
											        onClick={() => downloadUserDocuments(user)}>
												<i className="fas fa-eye"></i>
											</button>
											<button className="btn btn-secondary btn-xs mr-1" onClick={() => {
												approveUser(user);
											}}>
												<i className="fas fa-check"></i>
											</button>
											<button className="btn btn-danger btn-xs" onClick={() => rejectUser(user)}>
												<i className="fas fa-times"></i>
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
									<th className='w-[20%]'>Name</th>
									<th className='w-[10%]'>Username</th>
									<th className='w-[40%]'>Email</th>
									<th className='w-[30%]'>Actions</th>
								</tr>
								</thead>
								<tbody>
								{advertisers?.map((user) => (
									<tr key={user._id}>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>
											<button className="btn btn-primary btn-xs mr-1"
											        onClick={() => downloadUserDocuments(user)}>
												<i className="fas fa-eye"></i>
											</button>
											<button className="btn btn-secondary btn-xs mr-1" onClick={() => {
												approveUser(user);
											}}>
												<i className="fas fa-check"></i>
											</button>
											<button className="btn btn-danger btn-xs" onClick={() => rejectUser(user)}>
												<i className="fas fa-times"></i>
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
									<th className='w-[20%]'>Name</th>
									<th className='w-[10%]'>Username</th>
									<th className='w-[40%]'>Email</th>
									<th className='w-[30%]'>Actions</th>
								</tr>
								</thead>
								<tbody>
								{sellers?.map((user) => (
									<tr key={user._id}>
										<td>{user.firstName + " " + user.lastName}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>
											<button className="btn btn-primary btn-xs mr-1"
											        onClick={() => downloadUserDocuments(user)}>
												<i className="fas fa-eye"></i>
											</button>
											<button className="btn btn-secondary btn-xs mr-1" onClick={() => {
												approveUser(user);
											}}>
												<i className="fas fa-check"></i>
											</button>
											<button className="btn btn-danger btn-xs" onClick={() => rejectUser(user)}>
												<i className="fas fa-times"></i>
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