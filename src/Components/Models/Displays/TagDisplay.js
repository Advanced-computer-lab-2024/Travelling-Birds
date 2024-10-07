import {toast} from "react-toastify";
import {useState} from "react";
import PropTypes from "prop-types";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {TagForm} from "../Forms";
import Popup from "reactjs-popup";
import {tagModificationEvent} from "../../../utils/tagModificationEvent";

const TagDisplay = ({tag}) => {
	const [name, setName] = useState(tag?.name || '');
	const deleteTag = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/tags/${tag._id}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.msg?.includes('deleted')) {
					window.dispatchEvent(tagModificationEvent);
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

	return (
		<div className="bg-white rounded-lg shadow-md p-2 flex items-center justify-between">
			<span className="text-gray-800">{name}</span>
			<div className="flex items-center">
				<Popup
				className="h-fit overflow-y-scroll"
				trigger={
					<button className="text-blue-500 hover:text-blue-700 ml-2">
						<i className="fas fa-edit"></i>
					</button>
				}
				modal
				contentStyle={{maxHeight: '80vh', overflowY: 'auto'}} /* Ensures scroll */
				overlayStyle={{background: 'rgba(0, 0, 0, 0.5)' }} /* Darken background for modal */
			>
				<TagForm className="overflow-y-scroll" tag={tag} />
			</Popup>

				<button onClick={deleteTag} className="text-red-500 hover:text-red-700 ml-2">
					<i className="fas fa-trash"></i>
				</button>
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