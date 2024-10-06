import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";

const CategoryForm = () => {
	const [name, setName] = useState('');

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
				} else {
					toast.error('Failed to register category');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register category');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerCategory();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Category</h1>
				<ReusableInput type="text" name="Name" value={name}
				               onChange={e => setName(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

export default CategoryForm;