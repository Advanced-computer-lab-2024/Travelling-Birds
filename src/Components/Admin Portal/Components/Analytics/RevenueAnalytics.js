import {useEffect, useState} from 'react';

const RevenueAnalytics = () => {
	const [products, setProducts] = useState([]);
	const [activities, setActivities] = useState([]);
	const [itineraries, setItineraries] = useState([]);

	const [loading, setLoading] = useState(true);

	const [salesReport, setSalesReport] = useState({totalRevenue: 0, totalSales: 0});
	const [activitiesReport, setActivitiesReport] = useState({totalRevenue: 0, totalBookings: 0});
	const [itinerariesReport, setItinerariesReport] = useState({totalRevenue: 0, totalBookings: 0});
	const [filters, setFilters] = useState({
		productId: '',
		activityId: '',
		itineraryId: '',
		startDate: '',
		endDate: '',
	});

	useEffect(() => {
		fetchSalesReport();
	}, [filters]);

	useEffect(() => {
		const fetchProducts = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/products/admin`);
			const data = await response.json();
			setProducts(data);
		};

		const fetchActivities = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/activities`);
			const data = await response.json();
			setActivities(data);
		};

		const fetchItineraries = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/itineraries`);
			const data = await response.json();
			setItineraries(data);
		};

		Promise.all([fetchProducts(), fetchActivities(), fetchItineraries()]).then(() => setLoading(false));
	}, []);

	const fetchSalesReport = async () => {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/sales/${sessionStorage.getItem('user id')}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(filters),
			});
			const data = await response.json();
			setSalesReport(data.products); // Assuming the API returns data in the same structure
			setActivitiesReport(data.activities);
			setItinerariesReport(data.itineraries);
		} catch (error) {
			console.error('Error fetching sales report:', error);
		}
	};

	const handleFilterChange = (e) => {
		setFilters({...filters, [e.target.name]: e.target.value});
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

			<div className="card bg-base-100 shadow p-4 mb-6">
				<h3 className="text-2xl font-bold mb-4">Sales Report</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					{/* Product Dropdown */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Product</span>
						</label>
						<select
							name="productId"
							value={filters.productId}
							onChange={handleFilterChange}
							className="select select-bordered w-full"
						>
							<option value="">All Products</option>
							{products.map((product) => (
								<option key={product._id} value={product._id}>
									{product.name}
								</option>
							))}
						</select>
					</div>

					{/* Activity Dropdown */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Activity</span>
						</label>
						<select
							name="activityId"
							value={filters.activityId}
							onChange={handleFilterChange}
							className="select select-bordered w-full"
						>
							<option value="">All Activities</option>
							{activities.map((activity) => (
								<option key={activity._id} value={activity._id}>
									{activity.title}
								</option>
							))}
						</select>
					</div>

					{/* Itinerary Dropdown */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Itinerary</span>
						</label>
						<select
							name="itineraryId"
							value={filters.itineraryId}
							onChange={handleFilterChange}
							className="select select-bordered w-full"
						>
							<option value="">All Itineraries</option>
							{itineraries.map((itinerary) => (
								<option key={itinerary._id} value={itinerary._id}>
									{itinerary.title}
								</option>
							))}
						</select>
					</div>

					{/* Date Filters */}
					<div className="form-control">
						<label className="label">
							<span className="label-text">Start Date</span>
						</label>
						<input
							type="date"
							name="startDate"
							value={filters.startDate}
							onChange={handleFilterChange}
							className="input input-bordered w-full"
						/>
					</div>

					<div className="form-control">
						<label className="label">
							<span className="label-text">End Date</span>
						</label>
						<input
							type="date"
							name="endDate"
							value={filters.endDate}
							onChange={handleFilterChange}
							className="input input-bordered w-full"
						/>
					</div>
				</div>

				{/* Filter Button */}
				<button onClick={fetchSalesReport} className="btn btn-primary">
					Filter
				</button>
			</div>

			{/* Results */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Product Report */}
				<div className="card bg-gray-100 p-4 rounded-lg">
					<h4 className="text-xl font-semibold">Products</h4>
					<p>Total Revenue: ${salesReport.totalRevenue}</p>
					<p>Total Sales: {salesReport.totalSales}</p>
				</div>

				{/* Activity Report */}
				<div className="card bg-gray-100 p-4 rounded-lg">
					<h4 className="text-xl font-semibold">Activities</h4>
					<p>Total Revenue: ${activitiesReport.totalRevenue * 0.1}</p>
					<p>Total Bookings: {activitiesReport.totalBookings}</p>
				</div>

				{/* Itinerary Report */}
				<div className="card bg-gray-100 p-4 rounded-lg">
					<h4 className="text-xl font-semibold">Itineraries</h4>
					<p>Total Revenue: ${itinerariesReport.totalRevenue * 0.1}</p>
					<p>Total Bookings: {itinerariesReport.totalBookings}</p>
				</div>
			</div>
		</div>
	);
};

export default RevenueAnalytics;
