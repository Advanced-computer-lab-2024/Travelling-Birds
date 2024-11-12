// src/pages/AdminDashboard.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminNavBar from './Components/AdminNavBar';
import CreateAdminAccount from './Components/UserManagement/CreateNewAccounts';
import ManageUserAccounts from './Components/UserManagement/ManageUserAccounts';
import ApproveRegistrants from './Components/UserManagement/ApproveRegistrants';
import ManageActivities from './Components/ContentManagement/ManageActivities';
import ManageCategoriesTags from './Components/ContentManagement/ManageCategoriesTags';
import ManageInventory from './Components/ProductManagement/ManageInventory';
import SalesReports from './Components/ProductManagement/SalesReports';
import StockAlerts from './Components/ProductManagement/StockAlerts';
import ViewComplaints from './Components/ComplaintManagement/ViewComplaints';
import UserGrowth from './Components/Analytics/UserGrowth';
import CreatePromotionalCodes from './Components/PromotionalManagement/CreatePromotionalCodes';

const AdminDashboard = () => {
	return (
		<div>
			<AdminNavBar />
			<div className="p-4">
				<Routes>
					<Route path="/admin/user-management/create-admin" element={<CreateAdminAccount />} />
					<Route path="/admin/user-management/manage-users" element={<ManageUserAccounts />} />
					<Route path="/admin/user-management/approve-registrants" element={<ApproveRegistrants />} />
					<Route path="/admin/content-management/manage-activities" element={<ManageActivities />} />
					<Route path="/admin/content-management/manage-categories-tags" element={<ManageCategoriesTags />} />
					<Route path="/admin/product-management/manage-inventory" element={<ManageInventory />} />
					<Route path="/admin/product-management/sales-reports" element={<SalesReports />} />
					<Route path="/admin/product-management/stock-alerts" element={<StockAlerts />} />
					<Route path="/admin/complaint-management/view-complaints" element={<ViewComplaints />} />
					<Route path="/admin/analytics/user-growth" element={<UserGrowth />} />
					<Route path="/admin/promotional-management/create-codes" element={<CreatePromotionalCodes />} />
				</Routes>
			</div>
		</div>
	);
}

export default AdminDashboard;