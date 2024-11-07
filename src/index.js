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
import LoginPage  from "./Pages/LoginPage";
import WaitPage  from "./Pages/WaitPage";

import HotelSearchPage from "./Pages/HotelSearchPage";
import HotelDetails from "./Pages/HotelDetails";
import BookingPage from "./Pages/MyBookingsPage";

import AdminNavBar from "./Components/Admin Portal/Components/AdminNavBar";
import CreateAdminAccount from "./Components/Admin Portal/Components/UserManagement/CreateNewAccounts";
import AdminLayout from "./Components/Admin Portal/AdminLayout";
import ApproveRegistrants from "./Components/Admin Portal/Components/UserManagement/ApproveRegistrants";
import ManageUserAccounts from "./Components/Admin Portal/Components/UserManagement/ManageUserAccounts";
import ViewComplaints from "./Components/Admin Portal/Components/ComplaintManagement/ViewComplaints";
import UsersToDelete from "./Components/Admin Portal/Components/UserManagement/UsersToDelete";
import ManageCategoriesTags from "./Components/Admin Portal/Components/ContentManagement/ManageCategoriesTags";
import ManageProducts from "./Components/Admin Portal/Components/ProductManagement/ManageProducts";

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
						<Route path='users-to-delete' element={<UsersToDelete/>}/>
						<Route path='guides' element={<AdminNavBar/>}/>
						<Route path='hotspots' element={<AdminNavBar/>}/>
						<Route path='tags-categories' element={<ManageCategoriesTags/>}/>
						<Route path='manage-products' element={<ManageProducts/>}/>
						<Route path='manage-complaints' element={<ViewComplaints/>}/>
					</Route>
					<Route path='profile' element={<ProfilePage/>}/>
					<Route path='wait' element={<WaitPage/>}/>
					<Route path='flights' element={<FlightSearchPage/>}/>
					<Route path='flights/:flightId/:origin/:destination/:departureDate' element={<FlightDetails/>}/>
					<Route path='hotels' element={<HotelSearchPage/>}/>
					<Route path='hotels/:hotelId/:checkInDate/:checkOutDate' element={<HotelDetails/>}/>
					<Route path='users' element={<UsersPage/>}/>
					<Route path='places' element={<PlacesPage/>}/>
					<Route path='activities' element={<ActivityPage/>}/>
					<Route path=':id' element={<DetailsPage/>}/>
					<Route path='itineraries' element={<ItinerariesPage/>}/>
					<Route path='create-activity' element={<ActivityForm />} />
                    <Route path='update-activity/:id' element={<ActivityForm />} /> 
					<Route path='create-itinerary' element={<ItineraryForm/>}/>
					<Route path='update-itinerary/:id' element={<ItineraryForm/>}/>
					<Route path='create-museum' element={<MuseumForm/>}/>
					<Route path='update-museum/:id' element={<MuseumForm/>}/>
					<Route path='create-historical-place' element={<HistoricalPlaceForm/>}/>
					<Route path='update-historical-place/:id' element={<HistoricalPlaceForm/>}/>
					<Route path="explore" element={<ExplorePage/>}/>
					<Route path="products" element={<ProductsPage/>}/>
					<Route path="complaints" element={<ComplaintsPage/>}/>
					<Route path="login" element={<LoginPage/>}/>
					<Route path="register" element={<RegisterPage/>}/>
					<Route path="historicalplaces/:id" element={<HistoricalPlaceDetail/>}/>
					<Route path="museum/:id" element={<MuseumDetail/>}/>
					<Route path="bookings" element={<BookingPage/>}/>

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
