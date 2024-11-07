import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import LoadingPage from './LoadingPage'; 

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
      }
    };
    fetchPlace();
  }, [placeId]);

  // Convert image to base64 if exists
  let imageBase64 = null;
  if (place?.image?.data?.data && place.image.contentType) {
    const byteArray = new Uint8Array(place.image.data.data);
    const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    imageBase64 = `data:${place.image.contentType};base64,${btoa(binaryString)}`;
  }

  if (loading) return <LoadingPage /> ;

  return (
    <div>
      <section className="px-4 py-10 bg-gray-100">
        <div className="container-xl lg:container m-auto">
          {/* Title and Description */}
          <h1 className="text-3xl font-bold text-[#330577]">{place?.name}</h1>
          <p className="text-gray-700 mt-2">{place?.description}</p>

          {/* Image Display */}
          {imageBase64 && (
            <div className="mt-8">
              <img src={imageBase64} alt={place?.name} className="w-full h-96 object-cover rounded-lg shadow-md" />
            </div>
          )}

          {/* Location and Opening Hours */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg text-[#330577]">Details</h2>
            <p className="flex items-center mt-2">
              <FaMapMarkerAlt className="mr-2 text-gray-700" /> {place?.location}
            </p>
            <p className="flex items-center mt-2">
              <FaClock className="mr-2 text-gray-700" /> Opening Hours: {new Date(place?.openingHours?.startTime).toLocaleTimeString()} -{' '}
              {new Date(place?.openingHours?.endTime).toLocaleTimeString()}
            </p>
          </div>

          {/* Ticket Prices */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg text-[#330577]">Ticket Prices</h2>
            <ul className="list-disc ml-6">
              {place?.ticketPrices?.length ? (
                place.ticketPrices.map((price, index) => <li key={index}>${price.toFixed(2)}</li>)
              ) : (
                <li>No ticket prices available</li>
              )}
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg text-[#330577]">Tags</h2>
            <p>{place?.tags?.join(', ') || 'No tags available'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoricalPlaceDetail;