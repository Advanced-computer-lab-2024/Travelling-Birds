import React from 'react';

const ResultList = ({ results, type }) => {
    return (
        <div>
            {results.length > 0 ? (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            {type === 'activity' && (
                                <div>
                                    <strong>Category: </strong>{result.category} <br />
                                    <strong>Date: </strong>{result.date} <br />
                                    <strong>Price: </strong>${result.price}
                                </div>
                            )}
                            {type === 'itinerary' && (
                                <div>
                                    <strong>Duration: </strong>{result.duration} <br />
                                    <strong>Locations: </strong>{result.locations.join(', ')} <br />
                                    <strong>Language: </strong>{result.language} <br />
                                    <strong>Price: </strong>${result.price}
                                </div>
                            )}
                            {type === 'museum' && (
                                <div>
                                    <strong>Name: </strong>{result.name} <br />
                                    <strong>Description: </strong>{result.description} <br />
                                    <strong>Location: </strong>{result.location}
                                </div>
                            )}
                            {type === 'historicalPlace' && (
                                <div>
                                    <strong>Name: </strong>{result.name} <br />
                                    <strong>Description: </strong>{result.description} <br />
                                    <strong>Location: </strong>{result.location}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default ResultList;