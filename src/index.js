import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
	AdminNavBar,
	AdvertiserNavBar,
	SellerNavBar,
	TourGuideNavBar,
	TourismGovernorNavBar,
	TouristNavBar
} from "./Components/NavBars";
import {BrowserRouter, createBrowserRouter, createRoutesFromElements, Outlet, Route, Routes} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import {
	AdminForm,
	AdvertiserForm,
	SellerForm,
	TourGuideForm,
	TourismGovernorForm,
	TouristForm
} from "./Components/Registration Forms";
import ProfilePage from "./Pages/ProfilePage";
import ActivityPage from "./Pages/ActivitiesPage";
import ActivityForm from "./Components/Models/Forms/ActivityForm";
import ExplorePage from "./Pages/ExplorePage";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<NavBarContainer/>}>
					<Route index element={<RegisterPage/>}/>
					<Route path='tourist' element={<TouristForm/>}/>
					<Route path='tourguide' element={<TourGuideForm/>}/>
					<Route path='seller' element={<SellerForm/>}/>
					<Route path='admin' element={<AdminForm/>}/>
					<Route path='advertiser' element={<AdvertiserForm/>}/>
					<Route path='tourismgoverner' element={<TourismGovernorForm/>}/>
					<Route path='profile' element={<ProfilePage/>}/>
					<Route path='activities' element={<ActivityPage/>}/>
					<Route path='create-activity' element={<ActivityForm/>}/>
					<Route path="explore" element={<ExplorePage/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
		<ToastContainer/>
	</React.StrictMode>
);

function NavBarContainer() {
	const [role, setRole] = React.useState('');
	const [user, setUser] = React.useState('');
	useEffect(() => {
		const updateRoleAndUser = () => {
			setRole(sessionStorage.getItem('role'));
			setUser(sessionStorage.getItem('user id'));
		};
		updateRoleAndUser();
		window.addEventListener('sessionStorageUpdated', updateRoleAndUser);

		return () => {
			window.removeEventListener('sessionStorageUpdated', updateRoleAndUser);
		};
	}, []);
	return (
		<>
			role: {role}, id: {user}
			{role === 'tourist' && <TouristNavBar/>}
			{role === 'admin' && <AdminNavBar/>}
			{role === 'tour_guide' && <TourGuideNavBar/>}
			{role === 'seller' && <SellerNavBar/>}
			{role === 'advertiser' && <AdvertiserNavBar/>}
			{role === 'tourism_governor' && <TourismGovernorNavBar/>}
			<Outlet/>
		</>
	);
}