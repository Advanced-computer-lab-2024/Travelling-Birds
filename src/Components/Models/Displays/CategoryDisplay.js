import {toast} from "react-toastify";
import {useState} from "react";
import PropTypes from "prop-types";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {CategoryForm} from "../Forms";
import Popup from "reactjs-popup";
import {categoryModificationEvent} from "../../../utils/categoryModificationEvent";

const CategoryDisplay = ({category}) => {
	const name = category?.name || '';
	const deleteCategory = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/categories/${category._id}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.msg?.includes('deleted')) {
					window.dispatchEvent(categoryModificationEvent);
					toast.success('Category deleted successfully');
				} else {
					toast.error('Failed to delete category');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to delete category');
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
				<CategoryForm className="overflow-y-scroll" category={category} />
			</Popup>

				<button onClick={deleteCategory} className="text-red-500 hover:text-red-700 ml-2">
					<i className="fas fa-trash"></i>
				</button>
			</div>
		</div>
	);
}

export default CategoryDisplay;

CategoryDisplay.propTypes = {
	category: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})
};