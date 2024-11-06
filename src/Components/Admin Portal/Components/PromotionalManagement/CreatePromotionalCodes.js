// src/components/PromotionalManagement/CreatePromotionalCodes.js
import React, { useState } from 'react';

const CreatePromotionalCodes = () => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to create promotional code
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Promotional Codes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Discount</label>
          <input
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="bg-primary text-white p-2 rounded">Create Code</button>
      </form>
    </div>
  );
}

export default CreatePromotionalCodes;