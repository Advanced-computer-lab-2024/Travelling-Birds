import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransportationForm from '../../../Components/Models/Forms/TranportationForm.js'; // Import the form component

const TransportationManagement = () => {
    const [transportations, setTransportations] = useState([]);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [editTransportName, setEditTransportName] = useState('');
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user id'); // Assuming userId is stored in session storage

    useEffect(() => {
        fetchTransportations().then(r => r);
    }, []);

    const fetchTransportations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/transports`);
            const data = await response.json();
            setTransportations(data);
        } catch (error) {
            console.error('Error fetching transportations:', error);
        }
    };

    const handleDeleteTransportation = async (transport) => {
        if (transport.createdBy !== userId) {
            toast.error('You are not authorized to delete this transportation.');
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this transportation?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/transports/${transport._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete transportation.');
            }

            toast.success('Transportation deleted successfully.');
            await fetchTransportations();
        } catch (error) {
            console.error('Error deleting transportation:', error);
            toast.error('Failed to delete transportation.');
        }
    };

    const handleEditTransportation = async () => {
        if (!selectedTransport.name.trim()) {
            toast.error('Transportation name is required.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/transports/${selectedTransport._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name: editTransportName})
            });

            if (!response.ok) {
                throw new Error('Failed to update transportation.');
            }

            toast.success('Transportation updated successfully.');
            setSelectedTransport(null);
            await fetchTransportations();
        } catch (error) {
            console.error('Error updating transportation:', error);
            toast.error('Failed to update transportation.');
        }
    };

    if (userRole !== 'advertiser') {
        return <p className="text-center mt-8 text-[#330577]">You do not have access to this page.</p>;
    }

    return (
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-[#330577] mb-4 text-center">Transportation Management</h1>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#330577]">Create New Transportation</h2>
                {/* Reusable Form for Adding Transportation */}
                <TransportationForm transportations={transportations} setTransportations={setTransportations} />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {transportations.map((transport) => (
                    <div key={transport._id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-medium text-[#330577]">{transport.name}</p>
                            {transport.createdBy === userId && ( // Check if the logged-in user created the transport
                                <div className="flex space-x-2">
                                    <Popup
                                        trigger={
                                            <button className="bg-[#330577] text-white px-3 py-1 rounded-md">
                                                Edit
                                            </button>
                                        }
                                        modal
                                        onOpen={() => setSelectedTransport(transport)}
                                    >
                                        <div className="p-4 bg-white rounded-lg">
                                            <h3 className="text-xl font-semibold mb-4 text-[#330577]">Edit Transportation</h3>
                                            <input
                                                type="text"
                                                defaultValue={transport.name}
                                                onChange={(e) => setEditTransportName(e.target.value)}
                                                className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                                                placeholder="Edit transportation name"
                                            />
                                            <button
                                                onClick={() => {
                                                    handleEditTransportation();
                                                }}
                                                className="bg-[#330577] text-white px-4 py-2 rounded-md hover:bg-[#472393]"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </Popup>
                                    <button
                                        onClick={() => handleDeleteTransportation(transport)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransportationManagement;