import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
	AdvertiserNavBar,
	SellerNavBar,
	TourGuideNavBar,
	TourismGovernorNavBar,
	TouristNavBar,
	GeneralNavBar
} from "./Components/NavBars";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import {
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
import UsersPage from "./Pages/UsersPage";
import ItinerariesPage from "./Pages/ItinerariesPage";
import ItineraryForm from "./Components/Models/Forms/ItineraryForm";
import ProductsPage from "./Pages/ProductsPage";
import MuseumForm from "./Components/Models/Forms/MuseumForm";
import {HistoricalPlaceForm} from "./Components/Models/Forms";
import PlacesPage from "./Pages/PlacesPage";
import ComplaintsPage from "./Pages/ComplaintsPage";
import DetailsPage from "./Pages/DetailsPage";
import FlightSearchPage from "./Pages/FlightSearchPage";
import FlightDetails from "./Pages/FlightDetails";
import HistoricalPlaceDetail from "./Pages/HistoricalPlaceDetailsPage";
import MuseumDetail from './Pages/MuseumDetailsPage';

import AdminNavBar from "./Components/Admin Portal/Components/AdminNavBar";
import CreateAdminAccount from "./Components/Admin Portal/Components/UserManagement/CreateNewAccounts";
import AdminLayout from "./Components/Admin Portal/AdminLayout";
import ApproveRegistrants from "./Components/Admin Portal/Components/UserManagement/ApproveRegistrants";
import ManageUserAccounts from "./Components/Admin Portal/Components/UserManagement/ManageUserAccounts";
import ViewComplaints from "./Components/Admin Portal/Components/ComplaintManagement/ViewComplaints";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<NavBarContainer/>}>
					<Route index element={<ExplorePage/>}/>
					<Route path="admin">
						<Route path='admin-accounts' element={<CreateAdminAccount/>}/>
						<Route path='approve-users' element={<ApproveRegistrants/>}/>
						<Route path='manage-users' element={<ManageUserAccounts/>}/>
						<Route path='guides' element={<AdminNavBar/>}/>
						<Route path='hotspots' element={<AdminNavBar/>}/>
						<Route path='checklists' element={<AdminNavBar/>}/>
						<Route path='manage-complaints' element={<ViewComplaints/>}/>
					</Route>
					<Route path='tourist' element={<TouristForm/>}/>
					<Route path='tour-guide' element={<TourGuideForm/>}/>
					<Route path='seller' element={<SellerForm/>}/>
					<Route path='advertiser' element={<AdvertiserForm/>}/>
					<Route path='tourism-governor' element={<TourismGovernorForm/>}/>
					<Route path='profile' element={<ProfilePage/>}/>
					<Route path='flights' element={<FlightSearchPage/>}/>
					<Route path='flights/:flightId/:origin/:destination/:departureDate' element={<FlightDetails/>}/>
					<Route path='users' element={<UsersPage/>}/>
					<Route path='places' element={<PlacesPage/>}/>
					<Route path='activities' element={<ActivityPage/>}/>
					<Route path=':id' element={<DetailsPage/>}/>
					<Route path='itineraries' element={<ItinerariesPage/>}/>
					<Route path='create-activity' element={<ActivityForm/>}/>
					<Route path='create-itinerary' element={<ItineraryForm/>}/>
					<Route path='create-museum' element={<MuseumForm/>}/>
					<Route path='create-historical-place' element={<HistoricalPlaceForm/>}/>
					<Route path="explore" element={<ExplorePage/>}/>
					<Route path="products" element={<ProductsPage/>}/>
					<Route path="complaints" element={<ComplaintsPage/>}/>
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

	// Render GeneralNavBar if no user id is found in session storage
	if (!user) {
		return (
			<>
				<GeneralNavBar />
				<Outlet />
			</>
		);
	}

	return (
		<>
			{/* role: {role}, id: {user} */}
			{role === 'tourist' && <TouristNavBar />}
			{role === 'admin' && <AdminLayout />}
			{role === 'tour_guide' && <TourGuideNavBar />}
			{role === 'seller' && <SellerNavBar />}
			{role === 'advertiser' && <AdvertiserNavBar />}
			{role === 'tourism_governor' && <TourismGovernorNavBar />}
			{role !== 'admin' && <Outlet />}
		</>
	);
}
