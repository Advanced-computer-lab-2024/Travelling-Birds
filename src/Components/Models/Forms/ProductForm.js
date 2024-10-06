import {useState} from "react";
import ReusableInput from "../../ReusableInput";
import {toast} from "react-toastify";

const ProductForm = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [availableQuantity, setAvailableQuantity] = useState('');
	const [picture, setPicture] = useState('');
	const [ratings, setRatings] = useState('');
	const [reviews, setReviews] = useState('');

	const registerProduct = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/api/products`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				description,
				price: parseFloat(price),
				availableQuantity: parseInt(availableQuantity, 10),
				picture,
				seller: sessionStorage.getItem('user id'),
				ratings: ratings.split(',').map(rating => parseFloat(rating.trim())),
				reviews: reviews.split(',').map(review => review.trim())
			})
		})
			.then((response) => response.json())
			.then((data) => {
				if (data?._id) {
					toast.success('Product added successfully');
				} else {
					toast.error('Failed to register product');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error('Failed to register product');
			});
	}

	return (
		<div>
			<form className="w-full max-w-sm mx-auto" onSubmit={(e) => {
				e.preventDefault();
				registerProduct();
			}}>
				<h1 className="text-2xl font-bold mb-4">Register Product</h1>
				<ReusableInput type="text" name="Name" value={name}
				               onChange={e => setName(e.target.value)}/>
				<ReusableInput type="text" name="Description" value={description}
				               onChange={e => setDescription(e.target.value)}/>
				<ReusableInput type="number" name="Price" value={price}
				               onChange={e => setPrice(e.target.value)}/>
				<ReusableInput type="number" name="Available Quantity" value={availableQuantity}
				               onChange={e => setAvailableQuantity(e.target.value)}/>
				<ReusableInput type="text" name="Picture" value={picture}
				               onChange={e => setPicture(e.target.value)}/>
				<ReusableInput type="text" name="Ratings" value={ratings}
				               onChange={e => setRatings(e.target.value)}/>
				<ReusableInput type="text" name="Reviews" value={reviews}
				               onChange={e => setReviews(e.target.value)}/>
				<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4">Register</button>
			</form>
		</div>
	);
}

export default ProductForm;