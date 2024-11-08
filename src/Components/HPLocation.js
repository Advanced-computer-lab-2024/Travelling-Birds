import { FaPhoneAlt, FaGlobe, FaEnvelope } from "react-icons/fa";

function LocationContact({ historicalPlace }) {
	const googleMapLink = `https://www.google.com/maps?q=${historicalPlace?.location?.lat},${historicalPlace?.location?.lng}&hl=es;z=14&output=embed`;

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
			<p className="text-gray-700 mb-1">{historicalPlace?.location?.address}</p>
			<p className="text-gray-700">
				{historicalPlace?.location?.city}, {historicalPlace?.location?.country}
			</p>
			{historicalPlace?.location?.area && (
				<p className="text-gray-700">Area: {historicalPlace?.location?.area}</p>
			)}

			{/* Contact Information (if available) */}
			<div className="mt-4 space-y-2">
				{historicalPlace?.contact?.phone && (
					<div className="flex items-center text-gray-700">
						<FaPhoneAlt className="mr-2 text-[#330577]" />
						<p>{historicalPlace?.contact?.phone}</p>
					</div>
				)}
				{historicalPlace?.contact?.website && (
					<div className="flex items-center text-gray-700">
						<FaGlobe className="mr-2 text-[#330577]" />
						<a
							href={historicalPlace?.contact?.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:underline"
						>
							Website
						</a>
					</div>
				)}
				{historicalPlace?.contact?.email && (
					<div className="flex items-center text-gray-700">
						<FaEnvelope className="mr-2 text-[#330577]" />
						<p>{historicalPlace?.contact?.email}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default LocationContact;