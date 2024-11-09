// src/Components/AdminPortal/AdminLayout.js
import React from 'react';
import AdminNavBar from './Components/AdminNavBar';
import {Outlet} from 'react-router-dom';

const AdminLayout = () => {
	return (
		<div className="flex">
			<AdminNavBar/>
			<div className="flex-grow p-4">
				<Outlet/>
			</div>
		</div>
	);
}

export default AdminLayout;