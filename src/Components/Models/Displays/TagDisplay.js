//Tag's only have a name attribute.
//Tag's are used to categorize activities and museums.
//Tags are created by the admin.
//Tags are displayed in the activity and museum cards.
//Tags can be searched for in the search bar.
//Tags can be filtered for in the filter section.
//Tags can be sorted for in the sort section.
//Tags can be added to activities and museums.
//Tags can be removed from activities and museums.

import {toast} from "react-toastify";
import {useState} from "react";
import PropTypes from "prop-types";

const TagDisplay = ({tag}) => {
	const [name, setName] = useState(tag?.name || '');
	const deleteTag = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags/${tag._id}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.msg?.includes('deleted')) {
					toast.success('Tag deleted successfully');
				} else {
					toast.error('Failed to delete tag');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to delete tag');
			});
	}
	const updateTag = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags/${tag._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				{
					name
				})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.msg?.includes('updated')) {
					toast.success('Tag updated successfully');
				} else {
					toast.error('Failed to update tag');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to update tag');
			});
	}

	return (
		<div>
			<div className="flex items-center">
				<input type="text" value={name} onChange={e => setName(e.target.value)}
				       className="w-1/2 border-b-2 border-black"/>
				<button onClick={updateTag} className="bg-blue-500 text-white py-1 px-2 rounded ml-2">Update</button>
				<button onClick={deleteTag} className="bg-red-500 text-white py-1 px-2 rounded ml-2">Delete</button>
			</div>
		</div>
	);
}

export default TagDisplay;

TagDisplay.propTypes = {
	tag: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})
};