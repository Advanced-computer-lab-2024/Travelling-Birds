import { useState, useEffect } from 'react';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        country: '',
        city: '',
        street: '',
        postalCode: '',
        type: '',
        floorNumber: '',
        apartmentNumber: '',
        isDefault: false
    });
    const [editAddress, setEditAddress] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // For delete confirmation
    const [deleteAddressId, setDeleteAddressId] = useState(null);


    const userId = sessionStorage.getItem('user id');

    // Fetch user's addresses function
    const fetchAddresses = async () => {
        if (!userId) {
            console.error('User ID is not defined');
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/address/${userId}`);
            const data = await response.json();
            console.log('Fetched data:', data);  // Log the data to check the structure
            setAddresses(data.addresses || []);  // Set addresses to an empty array if not present
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    // Fetch addresses when the component mounts
    useEffect(() => {
        fetchAddresses();
    }, [userId]);


    // Handle changes in the new address form
    const handleNewAddressChange = (e) => {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value
        });
    };

    // Handle changes in the editing address form
    const handleEditAddressChange = (e) => {
        setEditAddress({
            ...editAddress,
            [e.target.name]: e.target.value
        });
    };

    // Handle creating a new address
    const handleAddAddress = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_BACKEND}/api/address/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAddress)  // Send the new address data as JSON
        })
            .then((response) => response.json())  // Parse the response as JSON
            .then((data) => {
                setAddresses([...addresses, data.address]);
                setNewAddress({
                    country: '',
                    city: '',
                    street: '',
                    postalCode: '',
                    type: '',
                    floorNumber: '',
                    apartmentNumber: '',
                    isDefault: false
                });
            })
            .catch((error) => console.error('Error adding address:', error));
    };

    // Handle editing an address
    const handleEditAddress = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_BACKEND}/api/address/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addressId: editAddress._id, ...editAddress })  // Send updated address data
        })
            .then((response) => response.json())  // Parse the response as JSON
            .then((data) => {
                setAddresses(addresses.map((address) => (address._id === editAddress._id ? data.address : address)));
                setShowEditModal(false);
                setEditAddress(null);
            })
            .catch((error) => console.error('Error updating address:', error));
    };

    // Handle deleting an address
    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/address/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ addressId })
            });
            const data = await response.json();
            console.log('Address deleted:', data);
            // Refetch addresses after deletion
            await fetchAddresses();
            setShowDeleteConfirmModal(false); // Hide delete confirmation modal
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };




    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Manage Addresses</h2>

            {/* Create New Address Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-medium mb-4">Create New Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            type="text"
                            name="country"
                            value={newAddress.country}
                            onChange={handleNewAddressChange}
                            placeholder="Country"
                            className="p-2 border rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            value={newAddress.city}
                            onChange={handleNewAddressChange}
                            placeholder="City"
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>

                    <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleNewAddressChange}
                        placeholder="Street"
                        className="p-2 border rounded-md w-full"
                        required
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            type="text"
                            name="postalCode"
                            value={newAddress.postalCode}
                            onChange={handleNewAddressChange}
                            placeholder="Postal Code"
                            className="p-2 border rounded-md"
                            required
                        />
                        <select
                            name="type"
                            value={newAddress.type}
                            onChange={handleNewAddressChange}
                            className="p-2 border rounded-md"
                            required
                        >
                            <option value="">Select Address Type</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            type="number"
                            name="floorNumber"
                            value={newAddress.floorNumber}
                            onChange={handleNewAddressChange}
                            placeholder="Floor Number"
                            className="p-2 border rounded-md"
                        />
                        <input
                            type="number"
                            name="apartmentNumber"
                            value={newAddress.apartmentNumber}
                            onChange={handleNewAddressChange}
                            placeholder="Apartment Number"
                            className="p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="mr-2">Default Address</label>
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                            className="border rounded-md"
                        />
                    </div>

                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">Add Address</button>
                </form>
            </div>

            {/* Display User's Addresses */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium mb-4">Your Addresses</h3>
                <ul>
                    {addresses.map((address) => (
                        <li key={address._id} className="border-b pb-4 mb-4">
                            {address.isDefault && (
                                <span className="text-green-500 font-bold">Default Address</span>
                            )}
                            <p><strong>{address.street}, {address.city}, {address.country}</strong></p>
                            <p>{address.type} - Postal Code: {address.postalCode}  </p>
                            <p>Floor: {address.floorNumber} - Apartment: {address.apartmentNumber}  </p>

                            <button
                                onClick={() => { setEditAddress(address);
                                    setShowEditModal(true);}}
                                className="mr-4 text-blue-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setDeleteAddressId(address._id);
                                    setShowDeleteConfirmModal(true);
                                }}
                                className="text-red-500"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Edit Address Form */}
            {showEditModal && editAddress && (

                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3">
                        <h3 className="text-xl font-medium mb-4">Edit Address</h3>
                        <form onSubmit={handleEditAddress} className="space-y-4">
                            <input
                                type="text"
                                name="country"
                                value={editAddress.country}
                                onChange={handleEditAddressChange}
                                placeholder="Country"
                                className="p-2 border rounded-md w-full"
                                required
                            />
                            <input
                                type="text"
                                name="city"
                                value={editAddress.city}
                                onChange={handleEditAddressChange}
                                placeholder="City"
                                className="p-2 border rounded-md w-full"
                                required
                            />
                            <input
                                type="text"
                                name="street"
                                value={editAddress.street}
                                onChange={handleEditAddressChange}
                                placeholder="Street"
                                className="p-2 border rounded-md w-full"
                                required
                            />
                            <input
                                type="text"
                                name="postalCode"
                                value={editAddress.postalCode}
                                onChange={handleEditAddressChange}
                                placeholder="Postal Code"
                                className="p-2 border rounded-md w-full"
                                required
                            />
                            <select
                                name="type"
                                value={editAddress.type}
                                onChange={handleEditAddressChange}
                                className="p-2 border rounded-md w-full"
                                required
                            >
                                <option value="">Select Address Type</option>
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Other">Other</option>
                            </select>

                            {/* Floor Number */}
                            <input
                                type="number"
                                name="floorNumber"
                                value={editAddress.floorNumber}
                                onChange={handleEditAddressChange}
                                placeholder="Floor Number"
                                className="p-2 border rounded-md w-full"
                            />

                            <input
                                type="number"
                                name="apartmentNumber"
                                value={editAddress.apartmentNumber}
                                onChange={handleEditAddressChange}
                                placeholder="Apartment Number"
                                className="p-2 border rounded-md w-full"
                            />

                            <div className="flex items-center">
                                <label className="mr-2">Default Address</label>
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={editAddress.isDefault}
                                    onChange={(e) => setEditAddress({...editAddress, isDefault: e.target.checked})}
                                    className="border rounded-md"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">Update
                                Address
                            </button>
                            <button onClick={() => setShowEditModal(false)}
                                    className="w-full py-2 bg-gray-500 text-white rounded-md">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3">
                        <p className="text-xl mb-4">Are you sure you want to delete this address?</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => { handleDeleteAddress(deleteAddressId); }}
                                className="w-full py-2 bg-red-500 text-white rounded-md"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirmModal(false)}
                                className="w-full py-2 bg-gray-500 text-white rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddressManagement;
