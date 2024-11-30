// src/components/Analytics/UserGrowth.js
import {useEffect, useState} from 'react';
import {Bar, Line} from 'react-chartjs-2';
import 'chart.js/auto';

const UserGrowth = () => {
	const [userGrowthData, setUserGrowthData] = useState(null);
	const [loading, setLoading] = useState(true);

	const getMonthName = (month) => {
		switch (month) {
			case 1:
				return 'January';
			case 2:
				return 'February';
			case 3:
				return 'March';
			case 4:
				return 'April';
			case 5:
				return 'May';
			case 6:
				return 'June';
			case 7:
				return 'July';
			case 8:
				return 'August';
			case 9:
				return 'September';
			case 10:
				return 'October';
			case 11:
				return 'November';
			case 12:
				return 'December';
			default:
				return '';
		}
	};

	useEffect(() => {
		const fetchUserGrowthData = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/analytics`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				console.error('Failed to fetch user growth data');
				return;
			}

			const data = await response.json();
			setUserGrowthData(data[0]);
		};

		fetchUserGrowthData().then(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-4">User Growth</h2>
				<p>Loading...</p>
			</div>
		);
	}

	const allMonths = Array.from({length: 12}, (_, i) => i + 1);
	const byMonthData = {
		labels: allMonths.map(month => `${getMonthName(month)}`),
		datasets: [
			{
				label: 'Total Users',
				data: allMonths.map(month => {
					const monthData = userGrowthData.byMonth.find(item => item._id === month);
					return monthData ? monthData.totalUsers : 0;
				}),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1
			}
		]
	};

	const past30DaysData = {
		labels: userGrowthData?.past30Days[0].users.map(user => user.firstName),
		datasets: [
			{
				label: 'Users Joined in the Past 30 Days',
				data: userGrowthData?.past30Days[0].users.map((_, index) => index + 1),
				backgroundColor: 'rgba(153, 102, 255, 0.6)',
				borderColor: 'rgba(153, 102, 255, 1)',
				borderWidth: 1
			}
		]
	};

	const totalUsers = userGrowthData.byMonth.reduce((acc, item) => acc + item.totalUsers, 0);
	const newUsers = userGrowthData.past30Days[0].totalUsers;

	return (
		<div className="p-4">
			<h2 className="text-3xl font-bold mb-6 text-center text-[#330577]">User Growth Analytics</h2>
			<div className="mb-6 text-center">
				<p className="text-xl font-semibold">Total Users: <span className="text-[#330577]">{totalUsers}</span>
				</p>
				<p className="text-xl font-semibold">New Users (Past 30 Days): <span
					className="text-[#330577]">{newUsers}</span></p>
			</div>
			<div className="flex flex-row justify-between">
				<div className="w-1/2 p-2">
					<h3 className="text-xl font-semibold mb-4 text-center">Users by Month</h3>
					<div className="bg-white p-4 rounded-lg shadow-md">
						<Bar data={byMonthData} options={{maintainAspectRatio: false}} height={200}/>
					</div>
				</div>
				<div className="w-1/2 p-2">
					<h3 className="text-xl font-semibold mb-4 text-center">Users Joined in the Past 30 Days</h3>
					<div className="bg-white p-4 rounded-lg shadow-md">
						<Line data={past30DaysData} options={{maintainAspectRatio: false}} height={200}/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserGrowth;