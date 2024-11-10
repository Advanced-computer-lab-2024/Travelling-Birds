import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const TourismGovernorTags = () => {
	const [tags, setTags] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [name, setName] = useState('');
	const [newName, setNewName] = useState('');

	useEffect(() => {
		const updateTags = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/tags`)
				.then((response) => response.json())
				.then((data) => {
					setTags(data);
				});
		}
		updateTags();
	}, []);

	const handleUpdate = (item) => {
		setSelectedItem(item);
		setName(item.name);
		setModalVisible(true);
	};

	const handleDelete = (id) => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags/${id}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.msg?.includes('deleted')) {
					toast.success('Deleted successfully');
					setTags(tags.filter(tag => tag._id !== id));
				} else {
					toast.error('Failed to delete');
				}
			});
	};

	const handleSave = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags/${selectedItem._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data._id) {
					toast.success('Updated successfully');
					setTags(tags.map(tag => tag._id === selectedItem._id ? {...tag, name} : tag));
					setModalVisible(false);
				} else {
					toast.error('Failed to update');
				}
			});
	};

	const handleCreate = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name: newName}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data._id) {
					toast.success('Created successfully');
					setTags([...tags, data]);
					setCreateModalVisible(false);
					setNewName('');
				} else {
					toast.error('Failed to create');
				}
			});
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Tags</h2>
			<div className="flex space-x-4">
				<div className="w-1/2">
					<h3 className="text-xl font-semibold mb-2">Tags</h3>
					<button className="btn btn-primary mb-2" onClick={() => {
						setCreateModalVisible(true);
					}}>Create Tag
					</button>
					<table className="table w-full">
						<thead>
						<tr>
							<th>Name</th>
							<th className="w-1/12">Update</th>
							<th className="w-1/12">Delete</th>
						</tr>
						</thead>
						<tbody>
						{tags.map((tag) => (
							<tr key={tag.id}>
								<td>{tag.name}</td>
								<td>
									<button className="btn btn-primary btn-sm"
									        onClick={() => handleUpdate(tag)}>Update
									</button>
								</td>
								<td>
									<button className="btn btn-primary btn-sm"
									        onClick={() => handleDelete(tag.id)}>Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>

			{modalVisible && (
				<dialog id="update_modal" className="modal modal-bottom sm:modal-middle" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">Update Tag</h3>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<input type="text" value={name} onChange={(e) => setName(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleSave}>Save</button>
							<button className="btn" onClick={() => setModalVisible(false)}>Close</button>
						</div>
					</div>
				</dialog>
			)}

			{createModalVisible && (
				<dialog id="create_modal" className="modal modal-bottom sm:modal-middle" open>
					<div className="modal-box">
						<h3 className="font-bold text-lg">Create Tag</h3>
						<div className="py-4">
							<label className="block text-sm font-medium text-gray-700">Name</label>
							<input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
							       className="input input-bordered w-full"/>
						</div>
						<div className="modal-action">
							<button className="btn btn-primary" onClick={handleCreate}>Create</button>
							<button className="btn" onClick={() => setCreateModalVisible(false)}>Close</button>
						</div>
					</div>
				</dialog>
			)}
		</div>
	);
}

export default TourismGovernorTags;