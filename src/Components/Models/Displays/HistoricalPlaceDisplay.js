import {useState} from 'react';
import PropTypes from "prop-types";
import {useNavigate} from 'react-router-dom'; // Import useNavigate for navigation

const HistoricalPlaceDisplay = ({historicalPlace}) => {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate(); // Initialize navigate for redirection


	// Safely handle image conversion for the browser
	let imageBase64 = null;
	if (historicalPlace.image?.data?.data && historicalPlace.image.contentType) {
		try {
			const byteArray = new Uint8Array(historicalPlace.image.data.data);
			const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
			imageBase64 = `data:${historicalPlace.image.contentType};base64,${btoa(binaryString)}`;
		} catch (error) {
			console.error('Error converting image data to base64:', error);
		}
	}

	return (
		<div className="bg-white rounded-xl shadow-md relative">
			{imageBase64 && (
				<div className="relative">
					<img
						src={imageBase64}
						alt="Historical Place"
						className={`w-full h-64 object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						onClick={() => navigate(`/historicalplaces/${historicalPlace._id}`)}
					/>
					<div
						className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
						<h3 className="text-2xl font-bold">{historicalPlace.name}</h3>
					</div>
				</div>
			)}
			<div className="p-4">
				<div className="text-[#330577] mb-3">
					{`Opening Hours: ${historicalPlace.openingHours?.startTime ? new Date(historicalPlace.openingHours.startTime).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					}) : 'N/A'} - 
                    ${historicalPlace.openingHours?.endTime ? new Date(historicalPlace.openingHours.endTime).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					}) : 'N/A'}`}
				</div>
				<div className="flex flex-wrap">
					{historicalPlace.tags?.map((tag) => (
						<span key={tag}
						      className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 text-sm mr-2 mb-2">{tag}</span>
					))}
				</div>

			</div>
		</div>
	);
};

HistoricalPlaceDisplay.propTypes = {
	historicalPlace: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		openingHours: PropTypes.shape({
			startTime: PropTypes.string,
			endTime: PropTypes.string,
		}),
		tags: PropTypes.arrayOf(PropTypes.string),
		image: PropTypes.shape({
			data: PropTypes.object,
			contentType: PropTypes.string,
		}),
	})
};

export default HistoricalPlaceDisplay;