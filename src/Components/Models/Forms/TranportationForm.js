import { useState } from "react";
import { toast } from "react-toastify";

const TransportationForm = ({ transportations, setTransportations }) => {
    const [name, setName] = useState('');

    const handleAddTransportation = () => {
        if (!name.trim()) {
            toast.error("Transportation name is required.");
            return;
        }

        const createdBy = sessionStorage.getItem("user id"); // Automatically set `createdBy`

        const formData = {
            name,
            createdBy
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/transports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data?._id) {
                    toast.success("Transportation added successfully.");
                    setTransportations([...transportations, data]);
                    setName(''); // Reset form field
                } else {
                    toast.error("Failed to add transportation.");
                }
            })
            .catch(error => {
                console.error("Error occurred:", error);
                toast.error("Failed to add transportation.");
            });
    };

    return (
        <div className="max-w-[40rem] mx-auto p-8 bg-white shadow rounded">
            <h1 className="text-2xl font-bold text-[#330577] mb-6 text-center">Add Transportation</h1>
            <form
                className="grid grid-cols-1 gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTransportation();
                }}
            >
                <div className="flex flex-col">
                    <label className="mb-2 text-lg text-[#330577]">Transportation Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        placeholder="Enter transportation name"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#330577] text-white py-2 px-4 rounded hover:bg-[#472393]"
                >
                    Add Transportation
                </button>
            </form>
        </div>
    );
};

export default TransportationForm;