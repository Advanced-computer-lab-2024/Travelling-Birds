import React, {useEffect, useState} from 'react';

const SellerAnalytics = () => {
	const [salesReport, setSalesReport] = useState({totalRevenue: 0, totalSales: 0});
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({productId: '', startDate: '', endDate: ''});

	useEffect(() => {
		fetchSalesReport().then(() => setLoading(false));
	}, [filters]);

	const fetchSalesReport = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/sales/${sessionStorage.getItem('user id')}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(filters),
			});
			const data = await response.json();
			setSalesReport(data);
		} catch (error) {
			console.error('Error fetching sales report:', error);
		}
	};

	const handleFilterChange = (e) => {
		setFilters({...filters, [e.target.name]: e.target.value});
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div className="p-6 bg-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
			<div className="mb-4">
				<label className="block mb-1">Product ID</label>
				<input
					type="text"
					name="productId"
					value={filters.productId}
					onChange={handleFilterChange}
					className="w-full border rounded-lg p-3"
				/>
			</div>
			<div className="mb-4">
				<label className="block mb-1">Start Date</label>
				<input
					type="date"
					name="startDate"
					value={filters.startDate}
					onChange={handleFilterChange}
					className="w-full border rounded-lg p-3"
				/>
			</div>
			<div className="mb-4">
				<label className="block mb-1">End Date</label>
				<input
					type="date"
					name="endDate"
					value={filters.endDate}
					onChange={handleFilterChange}
					className="w-full border rounded-lg p-3"
				/>
			</div>
			<button
				onClick={fetchSalesReport}
				className="bg-blue-500 text-white p-3 rounded-lg"
			>
				Filter
			</button>
			<div className="mt-6">
				<h3 className="text-xl font-semibold">Total Revenue: ${salesReport.totalRevenue}</h3>
				<h3 className="text-xl font-semibold">Total Sales: {salesReport.totalSales}</h3>
			</div>
		</div>
	);
};

export default SellerAnalytics;