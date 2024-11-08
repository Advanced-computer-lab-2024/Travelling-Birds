import { FaPhoneAlt, FaGlobe, FaEnvelope } from "react-icons/fa";

function LocationContact({ museum }) {
	const googleMapLink = `https://www.google.com/maps?q=${museum?.location?.lat},${museum?.location?.lng}&hl=es;z=14&output=embed`;

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="font-semibold text-lg text-[#330577] mb-4">Location</h2>

			{/* Map Display */}
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

			{/* Location Details */}
			<p className="text-gray-700 mb-1">{museum?.location?.address}</p>
			<p className="text-gray-700">
				{museum?.location?.city}, {museum?.location?.country}
			</p>
			{museum?.location?.area && (
				<p className="text-gray-700">Area: {museum?.location?.area}</p>
			)}

			{/* Contact Information (if available) */}
			<div className="mt-4 space-y-2">
				{museum?.contact?.phone && (
					<div className="flex items-center text-gray-700">
						<FaPhoneAlt className="mr-2 text-[#330577]" />
						<p>{museum?.contact?.phone}</p>
					</div>
				)}
				{museum?.contact?.website && (
					<div className="flex items-center text-gray-700">
						<FaGlobe className="mr-2 text-[#330577]" />
						<a
							href={museum?.contact?.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:underline"
						>
							Website
						</a>
					</div>
				)}
				{museum?.contact?.email && (
					<div className="flex items-center text-gray-700">
						<FaEnvelope className="mr-2 text-[#330577]" />
						<p>{museum?.contact?.email}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationContact;