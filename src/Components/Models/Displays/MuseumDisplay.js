import {useState} from 'react';
import PropTypes from "prop-types";
import {useNavigate} from 'react-router-dom'; // Import useNavigate for navigation

const MuseumDisplay = ({museum}) => {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate(); // Initialize navigate for redirection


	// Safely handle image conversion for the browser
	let imageBase64 = null;
	if (museum.image?.data?.data && museum.image.contentType) {
		try {
			const byteArray = new Uint8Array(museum.image.data.data);
			const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
			imageBase64 = `data:${museum.image.contentType};base64,${btoa(binaryString)}`;
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
						alt="Museum"
						className={`w-full h-64 object-cover rounded-t-xl transition-transform duration-300 ${isHovered ? 'brightness-75 cursor-pointer' : ''}`}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						onClick={() => navigate(`/museum/${museum._id}`)}
					/>
					<div
						className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-xl">
						<h3 className="text-2xl font-bold">{museum.name}</h3>
					</div>
				</div>
			)}
			<div className="p-4">
				<div className="text-[#330577] mb-3">
					{`Opening Hours: ${museum.openingHours?.startTime ? new Date(museum.openingHours.startTime).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					}) : 'N/A'} - 
                    ${museum.openingHours?.endTime ? new Date(museum.openingHours.endTime).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					}) : 'N/A'}`}
				</div>
				<div className="flex flex-wrap">
					{museum.tags?.map((tag) => (
						<span key={tag}
						      className="inline-block bg-gray-300 text-gray-900 rounded-full px-2 py-1 text-sm mr-2 mb-2">{tag}</span>
					))}
				</div>

			</div>
		</div>
	);
};

MuseumDisplay.propTypes = {
	museum: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		openingHours: PropTypes.shape({
			startTime: PropTypes.string,
			endTime: PropTypes.string,
		}),
		tags: PropTypes.arrayOf(PropTypes.string),
		image: PropTypes.shape({
			data: PropTypes.object,
			contentType: PropTypes.string,
		})
	})
};

export default MuseumDisplay;