import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import {tagModificationEvent} from "../../../utils/tagModificationEvent";

const TagForm = ({tag}) => {
	const [name, setName] = useState(tag?.name || '');

	const registerTag = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Tag added successfully');
					window.dispatchEvent(tagModificationEvent);
				} else {
					toast.error('Failed to register tag');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register tag');
			});
	}
	const updateTag = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags/${tag._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					window.dispatchEvent(tagModificationEvent);
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
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				tag ? updateTag() : registerTag();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Tag</h1>
				<ReusableInput type="text" name="Name" value={name}
				               onChange={e => setName(e.target.value)}/>
				{tag ? <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Update</button>
					:
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>}
			</form>
		</div>
	);
}

TagForm.propTypes = {
	tag: PropTypes.shape(
		{
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		}
	)
};
export default TagForm;