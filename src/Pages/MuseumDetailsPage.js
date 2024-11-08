import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import LoadingPage from './LoadingPage'; 
import LocationContact from "../Components/Locations/MuseumLocation"; // Import the LocationContact component

const MuseumDetail = () => {
  const [loading, setLoading] = useState(true);
  const [museum, setMuseum] = useState(null);
  const { id: museumId } = useParams();

  useEffect(() => {
    const fetchMuseum = async () => {
      const apiUrl = `${process.env.REACT_APP_BACKEND}/api/museums/${museumId}`;
      try {
        const res = await fetch(apiUrl);
        const museumData = await res.json();
        setMuseum(museumData);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching museum data', err);
      }
    };
    fetchMuseum();
  }, [museumId]);

  // Convert image to base64 if exists
  let imageBase64 = null;
  if (museum?.image?.data?.data && museum.image.contentType) {
    const byteArray = new Uint8Array(museum.image.data.data);
    const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    imageBase64 = `data:${museum.image.contentType};base64,${btoa(binaryString)}`;
  }

  if (loading) return <LoadingPage/>;

  // Helper function to render ticket prices from object (not directly from Map)
  const renderTicketPrices = (ticketPrices) => {
    if (!ticketPrices || Object.keys(ticketPrices).length === 0) return <p>No ticket prices available.</p>;
  
    return (
      <ul className="list-disc ml-6">
        {Object.entries(ticketPrices).map(([category, price], index) => (
          <li key={index}>
            {category}: ${price.toFixed(2)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <section className="px-4 py-10 bg-gray-100">
        <div className="container-xl lg:container m-auto">
          {/* Title and Description */}
          <h1 className="text-3xl font-bold text-[#330577]">{museum?.name}</h1>
          <p className="text-gray-700 mt-2">{museum?.description}</p>

          {/* Image Display */}
          {imageBase64 && (
            <div className="mt-8">
              <img src={imageBase64} alt="Museum" className="w-full h-96 object-cover rounded-lg shadow-md" />
            </div>
          )}

          {/* Location and Contact */}
          {museum?.location && <LocationContact museum={museum} />} {/* Pass the museum prop */}

          {/* Opening Hours */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg text-[#330577]">Details</h2>
            <p className="flex items-center mt-2">
              <FaClock className="mr-2 text-gray-700" /> 
              Opening Hours: 
              {museum?.openingHours?.startTime ? ` ${new Date(museum.openingHours.startTime).toLocaleTimeString()}` : ' N/A'} - 
              {museum?.openingHours?.endTime ? ` ${new Date(museum.openingHours.endTime).toLocaleTimeString()}` : ' N/A'}
            </p>
          </div>

          {/* Ticket Prices */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg text-[#330577]">Ticket Prices</h2>
            {renderTicketPrices(museum?.ticketPrices)}
          </div>

          {/* Tags */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg text-[#330577]">Tags</h2>
            <p>{museum?.tags?.join(', ') || 'No tags available'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MuseumDetail;