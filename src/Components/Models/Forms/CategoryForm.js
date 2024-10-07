import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import {categoryModificationEvent} from "../../../utils/categoryModificationEvent";

const CategoryForm = ({category}) => {
	const [name, setName] = useState(category?.name || '');

	const registerCategory = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/categories`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Category added successfully');
					window.dispatchEvent(categoryModificationEvent);
				} else {
					toast.error('Failed to register category');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register category');
			});
	}
	const updateCategory = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/categories/${category._id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({name})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?.msg?.includes('updated')) {
					window.dispatchEvent(categoryModificationEvent);
					toast.success('Category updated successfully');
				} else {
					toast.error('Failed to update category');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to update category');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				category ? updateCategory() : registerCategory();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Category</h1>
				<ReusableInput type="text" name="Name" value={name}
				               onChange={e => setName(e.target.value)}/>
				{category ?
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Update</button>
					:
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>}
			</form>
		</div>
	);
}

CategoryForm.propTypes = {
	category: PropTypes.shape(
		{
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		}
	)
};
export default CategoryForm;