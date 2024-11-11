import React from 'react';
import {Link} from "react-router-dom";

const AdminNavBar = () => {
	return (
		<aside className="h-screen sticky top-0 overflow-y-auto w-60 py-6 px-4 bg-base-200">
			<Link to="/" className="btn btn-ghost">
				<i className="fa-solid fa-backward fa-fw"></i>
				<i className="fa-solid fa-dove fa-fw"></i>
				{/**/}
				Traveling Birds
			</Link>

			<ul className="menu px-0">
				<li className="menu-title">Users</li>
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
				<li>
					<Link to='/admin/users-to-delete'>
						<i className="fa-solid fa-user-times fa-fw"></i>
						{/**/}
						Users to Delete
					</Link>
				</li>

				<li className="menu-title">Content</li>
				<li>
					<Link to='/admin/activities'>
						<i className="fa-solid fa-hiking fa-fw"></i>
						{/**/}
						Activities
					</Link>
				</li>
				<li>
					<Link to='/admin/itineraries'>
						<i className="fa-solid fa-route fa-fw"></i>
						{/**/}
						Itineraries
					</Link>
				</li>
				<li>
					<Link to='/admin/historical-places'>
						<i className="fa-solid fa-landmark fa-fw"></i>
						{/**/}
						Historical Places
					</Link>
				</li>
				<li>
					<Link to='/admin/museums'>
						<i className="fa-solid fa-landmark fa-fw"></i>
						{/**/}
						Museums
					</Link>
				</li>
				<li>
					<Link to='/admin/tags-categories'>
						<i className="fa-solid fa-tags fa-fw"></i>
						{/**/}
						Tags and Categories
					</Link>
				</li>

				<li className="menu-title">Products</li>
				<li>
					<Link to='/admin/manage-products'>
						<i className="fa-solid fa-box-open fa-fw"></i>
						{/**/}
						Manage Products
					</Link>
				</li>

				<li className="menu-title">Complaints</li>
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

				<li className="menu-title">Promotions</li>
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