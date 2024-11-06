import React from 'react';
import {Link} from "react-router-dom";

const AdminNavBar = () => {
	return (
		<aside className="h-screen sticky top-0 overflow-y-auto w-60 py-6 px-4 bg-base-200">
			<Link to="/admin" className="btn btn-ghost">
				<img alt="Logo" src="/logo.svg" className="w-6"/>
				{/**/}
				Company Name
			</Link>

			<ul className="menu px-0">
				<li className="menu-title">User Management</li>
				<li>
					<Link to='/admin/admin-accounts'>
						<i className="fa-solid fa-user-shield fa-fw"></i>
						{/**/}
						Admin Accounts
					</Link>
				</li>
				<li>
					<Link to='/admin/approve-users'>
						<i className="fa-solid fa-user-check fa-fw"></i>
						{/**/}
						Approve New Users
					</Link>
				</li>
				<li>
					<Link to='/admin/manage-users'>
						<i className="fa-solid fa-users-cog fa-fw"></i>
						{/**/}
						Manage Users
					</Link>
				</li>

				<li className="menu-title">Contents</li>
				<li>
					<Link to='/admin/guides'>
						<i className="fa-solid fa-book fa-fw"></i>
						{/**/}
						Guides
					</Link>
				</li>
				<li>
					<Link to='/admin/hotspots'>
						<i className="fa-solid fa-map-marker-alt fa-fw"></i>
						{/**/}
						Hotspots
					</Link>
				</li>
				<li>
					<Link to='/admin/checklists'>
						<i className="fa-solid fa-tasks fa-fw"></i>
						{/**/}
						Checklists
					</Link>
				</li>

				<li className="menu-title">Product Management</li>
				<li>
					<Link to='/admin/product-management'>
						<i className="fa-solid fa-box-open fa-fw"></i>
						{/**/}
						Manage Products
					</Link>
				</li>

				<li className="menu-title">Complaint Management</li>
				<li>
					<Link to='/admin/manage-complaints'>
						<i className="fa-solid fa-comment-dots fa-fw"></i>
						{/**/}
						Manage Complaints
					</Link>
				</li>

				<li className="menu-title">Analytics</li>
				<li>
					<Link to='/admin/analytics'>
						<i className="fa-solid fa-chart-bar fa-fw"></i>
						{/**/}
						View Analytics
					</Link>
				</li>

				<li className="menu-title">Promotional Management</li>
				<li>
					<Link to='/admin/promotional-management'>
						<i className="fa-solid fa-bullhorn fa-fw"></i>
						{/**/}
						Manage Promotions
					</Link>
				</li>
			</ul>
		</aside>
	);
}

export default AdminNavBar;