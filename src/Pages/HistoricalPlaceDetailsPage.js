import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock, FaShareAlt } from 'react-icons/fa';
import LoadingPage from './LoadingPage';
import LocationContact from "../Components/Locations/HistoricalPlaceLocation"; // Import the LocationContact component

const HistoricalPlaceDetail = () => {
  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false); // State for share dropdown
  const { id: placeId } = useParams();

  useEffect(() => {
    const fetchPlace = async () => {
      const apiUrl = `${process.env.REACT_APP_BACKEND}/api/historicalPlaces/${placeId}`;
      try {
        const res = await fetch(apiUrl);
        const placeData = await res.json();
        setPlace(placeData);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching place data', err);
        setLoading(false);
      }
    };
    fetchPlace();
  }, [placeId]);

  // Convert image to base64 if it exists
  let imageBase64 = null;
  if (place?.image?.data?.data && place.image.contentType) {
    const byteArray = new Uint8Array(place.image.data.data);
    const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    imageBase64 = `data:${place.image.contentType};base64,${btoa(binaryString)}`;
  }

  // Handle copying the link to clipboard
  const handleCopyLink = () => {
    const link = `http://localhost:3000/historicalPlaces/${placeId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
      setIsShareOpen(false); // Close the dropdown menu after copying
    });
  };

  // Determine ticket prices based on selected currency
  const renderTicketPrice = (price) => {
    const currency = sessionStorage.getItem('currency') || 'USD';
    if (currency === 'EGP') {
      return `${(price * 49.3).toFixed(2)} EGP`;
    } else if (currency === 'EUR') {
      return `€${(price * 0.93).toFixed(2)}`;
    } else {
      // Default is USD
      return `$${price.toFixed(2)}`;
    }
  };

  if (loading) return <LoadingPage />;

  return (
      <div>
        <section className="px-4 py-10 bg-gray-100">
          <div className="container-xl lg:container m-auto">
            {/* Name and Description Card */}
            <div className="flex items-center justify-between bg-white p-6 shadow-lg rounded-lg mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[#330577]">{place?.name}</h1>
                <p className="text-gray-700 mt-4 text-lg">{place?.description}</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                {/* Share Button */}
                <div className="relative">
                  <button
                      onClick={() => setIsShareOpen(!isShareOpen)}
                      className="bg-[#330577] text-white px-4 py-2 rounded-lg hover:bg-[#472393] flex items-center"
                  >
                    <FaShareAlt className="mr-2" /> Share
                  </button>
                  {isShareOpen && (
                      <div className="absolute mt-2 bg-white p-4 shadow-md rounded-lg w-72 -left-20">
                        <p className="mb-2 font-semibold text-gray-700">Share this link:</p>
                        <div className="flex items-center space-x-2">
                          <input
                              type="text"
                              value={`http://localhost:3000/historicalPlaces/${placeId}`}
                              readOnly
                              className="w-full px-2 py-1 border rounded-lg focus:outline-none"
                              onClick={(e) => e.target.select()} // Select text on click
                          />
                          <button
                              onClick={handleCopyLink}
                              className="bg-[#330577] text-white px-3 py-1 rounded-lg hover:bg-[#27045c]"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Display */}
            {imageBase64 && (
                <div className="mt-8">
                  <img src={imageBase64} alt="Historical Place" className="w-full h-96 object-cover rounded-lg shadow-md" />
                </div>
            )}

            {/* Flexbox layout for Location and Details */}
            <div className="mt-10 flex flex-col md:flex-row gap-8">
              {/* Location */}
              {place?.location && (
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <LocationContact historicalPlace={place} /> {/* Pass the historicalPlace prop */}
                  </div>
              )}

              {/* Details Section */}
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-semibold text-2xl text-[#330577] mb-4">Details</h2>

                {/* Opening Hours */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-[#330577] mb-2">Opening Hours</h3>
                  <p className="flex items-center text-gray-800">
                    <FaClock className="mr-2 text-gray-700" />
                    {place?.openingHours?.startTime ? ` ${new Date(place.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'} -
                    {place?.openingHours?.endTime ? ` ${new Date(place.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                  </p>
                </div>

                {/* Ticket Prices */}
                <div>
                  <h3 className="text-xl font-medium text-[#330577] mb-2">Ticket Prices</h3>
                  <ul className="list-disc ml-6 text-gray-800">
                    {place?.ticketPrices?.length ? (
                        place.ticketPrices.map((price, index) => (
                            <li key={index} className="text-base">{renderTicketPrice(price)}</li>
                        ))
                    ) : (
                        <li className="text-base">No ticket prices available</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default HistoricalPlaceDetail;
