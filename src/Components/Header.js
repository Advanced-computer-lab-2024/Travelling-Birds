import { AiFillStar, AiOutlineHeart } from "react-icons/ai";
import {FaMapMarkerAlt, FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";
import React from "react";



function Header({ activity }) {
	const renderStars = (rating) => {
		const fullStars = Math.floor(rating);
		const halfStars = rating % 1 !== 0;
		return (
			<>
				{[...Array(fullStars)].map((_, i) => (
					<FaStar key={i} className="text-yellow-500" />
				))}
				{halfStars && <FaStarHalfAlt className="text-yellow-500" />}
				{[...Array(5 - fullStars - (halfStars ? 1 : 0))].map((_, i) => (
					<FaRegStar key={i + fullStars} className="text-yellow-500" />
				))}
			</>
		);
	};
	return (
		<div className="flex items-center justify-between bg-white p-6 shadow-lg rounded-lg">
			<div className="flex flex-col">
				<h1 className="text-4xl font-bold text-gray-800 mb-1">{activity?.title}</h1>
				<p className="text-gray-500 text-lg">{activity?.rank}</p>

				<div className="flex items-center mt-2 space-x-3">
          <span className="flex items-center text-2xl text-yellow-500">
            {renderStars(activity?.rating)}
          </span>
					<p className="text-gray-600 text-sm">({activity?.reviewsCount} reviews)</p>
				</div>

				<div className="flex items-center mt-3 text-gray-600 space-x-1">
					<FaMapMarkerAlt className="text-gray-500" />
					<span>{activity?.location?.address}</span>
				</div>

				<p className="text-gray-700 mt-4 leading-relaxed">
					{activity?.description}
				</p>
			</div>

			<div className="flex items-center space-x-4">
				<button className="p-2 px-4 bg-[#330577] text-white rounded-lg shadow hover:bg-[#472393] flex items-center space-x-2">
					<AiOutlineHeart className="text-lg" />
					<span>Save</span>
				</button>
			</div>
		</div>
	);
}

export default Header;
