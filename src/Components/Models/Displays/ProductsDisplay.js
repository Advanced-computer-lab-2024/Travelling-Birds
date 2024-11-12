import React, {useState} from 'react'; // Import React and necessary hooks
import 'react-toastify/dist/ReactToastify.css';
import {FaRegStar, FaStar, FaStarHalfAlt} from 'react-icons/fa';
import 'reactjs-popup/dist/index.css';
import {useNavigate} from 'react-router-dom'; // Import navigate for redirecting to activity page

const ProductsDisplay = ({product}) => {
	const [isHovered, setIsHovered] = useState(null); // Track hover for specific product
	const navigate = useNavigate();


	const formatPrice = (price) => {
		const currency = sessionStorage.getItem('currency');
		if (currency === 'USD') {
			return `$${(price / 49.3).toFixed(2)}`;
		} else if (currency === 'EUR') {
			return `€${(price / 49.3 * 0.93).toFixed(2)}`;
		} else {
			return `${price.toFixed(2)} EGP`;
		}
	};

	const renderStars = (rating) => {
		if (typeof rating !== 'number' || isNaN(rating) || rating < 0) {
			rating = 0;
		}
		const totalStars = 5;
		const fullStars = Math.min(Math.floor(rating), totalStars);
		const halfStars = rating % 1 !== 0 && fullStars < totalStars;

		return (
			<>
				{[...Array(fullStars)].map((_, i) => (
					<FaStar key={i} style={{color: '#330577'}}/>
				))}
				{halfStars && <FaStarHalfAlt style={{color: '#330577'}}/>}
				{[...Array(totalStars - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
					<FaRegStar key={i + fullStars} style={{color: '#330577'}}/>
				))}
			</>
		);
	};


	return (
		<div className="bg-white rounded-xl shadow-md relative">
			<div className="relative">
				{product.picture && (
					<img
						src={product.picture}
						alt="Activity"
						className={`w-full h-48 object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						onClick={() => navigate(`/products/${product._id}`)}
					/>
				)}
				<div
					className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
					<h3 className="text-2xl font-bold">{product.name}</h3>
				</div>
			</div>
			<div className="p-4">
				<div className="text-sm mb-2">

					<span key={product.price}
					      className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 mr-1 mt-1">Price: {formatPrice(product.price)}</span>
				</div>
				<div className="flex items-center text-yellow-500">
					{renderStars(product.ratings)}
				</div>

			</div>
		</div>
	);
};

export default ProductsDisplay;