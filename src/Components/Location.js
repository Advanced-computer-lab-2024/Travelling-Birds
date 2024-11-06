import { FaPhoneAlt, FaGlobe, FaEnvelope } from "react-icons/fa";

function LocationContact({ activity }) {
	const googleMapLink = `https://www.google.com/maps?q=${activity?.location?.lat},${activity?.location?.lng}&hl=es;z=14&output=embed`;

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="font-semibold text-lg text-[#330577] mb-4">Location and Contact</h2>

			<div className="mb-4">
				<iframe
					src={googleMapLink}
					width="100%"
					height="200"
					frameBorder="0"
					style={{ borderRadius: "8px" }}
					allowFullScreen
					loading="lazy"
					title="Google Map"
				></iframe>
			</div>

			<p className="text-gray-700 mb-1">{activity?.location?.address}</p>
			<p className="text-gray-700">{activity?.location?.city}, {activity?.location?.country}</p>
			{activity?.location?.area && (
				<p className="text-gray-700">Area: {activity?.location?.area}</p>
			)}

			<div className="mt-4 space-y-2">
				<div className="flex items-center text-gray-700">
					<FaPhoneAlt className="mr-2 text-[#330577]" />
					<p>{activity?.contact?.phone}</p>
				</div>
				{activity?.contact?.website && (
					<div className="flex items-center text-gray-700">
						<FaGlobe className="mr-2 text-[#330577]" />
						<a
							href={activity?.contact?.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:underline"
						>
							Website
						</a>
					</div>
				)}
				{activity?.contact?.email && (
					<div className="flex items-center text-gray-700">
						<FaEnvelope className="mr-2 text-[#330577]" />
						<p>{activity?.contact?.email}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationContact;
