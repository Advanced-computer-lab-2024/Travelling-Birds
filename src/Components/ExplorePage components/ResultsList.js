import React from "react";

const ResultsList = ({ activities, itineraries, places }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Activities</h2>
      <ul>
        {activities.length === 0 ? (
          <p>No activities found.</p>
        ) : (
          activities.map((activity) => (
            <li key={activity.id} className="border p-4 m-2">
              {activity.name} - ${activity.price} - Rating: {activity.rating}
            </li>
          ))
        )}
      </ul>
      <h2 className="text-xl font-semibold mb-4">Upcoming Itineraries</h2>
      <ul>
        {itineraries.length === 0 ? (
          <p>No itineraries found.</p>
        ) : (
          itineraries.map((itinerary) => (
            <li key={itinerary.id} className="border p-4 m-2">
              {itinerary.name} - ${itinerary.price} - Rating: {itinerary.rating}
            </li>
          ))
        )}
      </ul>
      <h2 className="text-xl font-semibold mb-4">Historical Places and Museums</h2>
      <ul>
        {places.length === 0 ? (
          <p>No places found.</p>
        ) : (
          places.map((place) => (
            <li key={place.id} className="border p-4 m-2">
              {place.name} - Tags: {place.tags.join(", ")}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ResultsList;