import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";

const ManageCategoriesTags = () => {
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [isCategory, setIsCategory] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [name, setName] = useState('');
	const [newName, setNewName] = useState('');

	useEffect(() => {
		const updateCategoriesTags = () => {
			fetch(`${process.env.REACT_APP_BACKEND}/api/categories`)
				.then((response) => response.json())
				.then((data) => {
					setCategories(data);
				});
			fetch(`${process.env.REACT_APP_BACKEND}/api/tags`)
				.then((response) => response.json())
				.then((data) => {
					setTags(data);
				});
		}
		updateCategoriesTags();
	}, []);

	const handleUpdate = (item, isCategory) => {
		setSelectedItem(item);
		setIsCategory(isCategory);
		setName(item.name);
		setModalVisible(true);
	};

	const handleDelete = (id, isCategory) => {
		const endpoint = isCategory ? 'categories' : 'tags';
		fetch(`${process.env.REACT_APP_BACKEND}/api/${endpoint}/${id}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.msg?.includes('deleted')) {
					toast.success('Deleted successfully');
					setCategories(categories.filter(category => category._id !== id));
					setTags(tags.filter(tag => tag._id !== id));
				} else {
					toast.error('Failed to delete');
				}
			});
	};

	const handleSave = () => {
		const endpoint = isCategory ? 'categories' : 'tags';
		fetch(`${process.env.REACT_APP_BACKEND}/api/${endpoint}/${selectedItem._id}`, {
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
					if (isCategory) {
						setCategories(categories.map(category => category._id === selectedItem._id ? {
							...category,
							name
						} : category));
					} else {
						setTags(tags.map(tag => tag._id === selectedItem._id ? {...tag, name} : tag));
					}
					setModalVisible(false);
				} else {
					toast.error('Failed to update');
				}
			});
	};

	const handleCreate = () => {
		const endpoint = isCategory ? 'categories' : 'tags';
		fetch(`${process.env.REACT_APP_BACKEND}/api/${endpoint}`, {
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
					if (isCategory) {
						setCategories([...categories, data]);
					} else {
						setTags([...tags, data]);
					}
					setCreateModalVisible(false);
					setNewName('');
				} else {
					toast.error('Failed to create');
				}
			});
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Manage Categories and Tags</h2>
			<div className="flex space-x-4">
				<div className="w-1/2">
					<h3 className="text-xl font-semibold mb-2">Categories</h3>
					<button className="btn btn-primary mb-2" onClick={() => {
						setIsCategory(true);
						setCreateModalVisible(true);
					}}>Create Category
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
						{categories.map((category) => (
							<tr key={category.id}>
								<td>{category.name}</td>
								<td>
									<button className="btn btn-primary btn-sm"
									        onClick={() => handleUpdate(category, true)}>Update
									</button>
								</td>
								<td>
									<button className="btn btn-primary btn-sm"
									        onClick={() => handleDelete(category._id, true)}>Delete
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
				<div className="w-1/2">
					<h3 className="text-xl font-semibold mb-2">Tags</h3>
					<button className="btn btn-primary mb-2" onClick={() => {
						setIsCategory(false);
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
									        onClick={() => handleUpdate(tag, false)}>Update
									</button>
								</td>
								<td>
									<button className="btn btn-primary btn-sm"
									        onClick={() => handleDelete(tag.id, false)}>Delete
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
						<h3 className="font-bold text-lg">Update {isCategory ? 'Category' : 'Tag'}</h3>
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
						<h3 className="font-bold text-lg">Create {isCategory ? 'Category' : 'Tag'}</h3>
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

export default ManageCategoriesTags;