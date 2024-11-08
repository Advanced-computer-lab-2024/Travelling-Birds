import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import LoadingPage from './LoadingPage';
import LocationContact from "../Components/Locations/HistoricalPlaceLocation"; // Import the LocationContact component

const HistoricalPlaceDetail = () => {
  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState(null);
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

  if (loading) return <LoadingPage />;

  return (
    <div>
      <section className="px-4 py-10 bg-gray-100">
        <div className="container-xl lg:container m-auto">
          {/* Name and Description Card */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-4xl font-bold text-[#330577]">{place?.name}</h1>
            <p className="text-gray-700 mt-4 text-lg">{place?.description}</p>
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
                    place.ticketPrices.map((price, index) => <li key={index} className="text-base">${price.toFixed(2)}</li>)
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