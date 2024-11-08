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
    if (!ticketPrices || Object.keys(ticketPrices).length === 0) return <p className="text-gray-700">No ticket prices available.</p>;
  
    return (
      <ul className="list-disc ml-6 text-gray-700">
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
          {/* Title and Description Card */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-4xl font-bold text-[#330577]">{museum?.name}</h1>
            <p className="text-gray-700 mt-4 text-lg">{museum?.description}</p>
          </div>

          {/* Image Display */}
          {imageBase64 && (
            <div className="mt-8">
              <img src={imageBase64} alt="Museum" className="w-full h-96 object-cover rounded-lg shadow-md" />
            </div>
          )}

          {/* Flexbox layout for Location and Details */}
          <div className="mt-10 flex flex-col md:flex-row gap-8">
            {/* Location */}
            {museum?.location && (
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <LocationContact museum={museum} /> {/* Pass the museum prop */}
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
                  {museum?.openingHours?.startTime ? ` ${new Date(museum.openingHours.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'} - 
                  {museum?.openingHours?.endTime ? ` ${new Date(museum.openingHours.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                </p>
              </div>

              {/* Ticket Prices */}
              <div>
                <h3 className="text-xl font-medium text-[#330577] mb-2">Ticket Prices</h3>
                {renderTicketPrices(museum?.ticketPrices)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MuseumDetail;