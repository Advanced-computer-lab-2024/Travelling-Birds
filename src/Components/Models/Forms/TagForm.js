import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";

const TagForm = () => {
	const [name, setName] = useState('');

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
				} else {
					toast.error('Failed to register tag');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register tag');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerTag();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Tag</h1>
				<ReusableInput type="text" name="Name" value={name}
				               onChange={e => setName(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

export default TagForm;