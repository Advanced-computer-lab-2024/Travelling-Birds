import React from 'react';

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <img 
                    src={require('../Assets/bird.gif')}
                    alt="Loading..." 
                    className="w-32 h-32 mx-auto mb-4" 
                />
                <p className="text-lg font-semibold text-gray-700">Loading, please wait...</p>
            </div>
        </div>
    );
};

export default LoadingPage;