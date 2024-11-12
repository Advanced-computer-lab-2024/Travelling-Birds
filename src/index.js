import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
	AdminNavBar,
	AdvertiserNavBar,
	GeneralNavBar,
	SellerNavBar,
	TourGuideNavBar,
	TourismGovernorNavBar,
	TouristNavBar
} from "./Components/NavBars";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import ExplorePage from "./Pages/ExplorePage";
import ItinerariesPage from "./Pages/ItinerariesPage";
import ProductsPage from "./Pages/ProductsPage";
import ComplaintsPage from "./Pages/ComplaintsPage";
import ActivityDetailsPage from "./Pages/ActivityDetailsPage";
import ItineraryDetail from "./Pages/ItinerariesDetailPage";
import FlightSearchPage from "./Pages/FlightSearchPage";
import FlightDetails from "./Pages/FlightDetails";
import HistoricalPlaceDetail from "./Pages/HistoricalPlaceDetailsPage";
import MuseumDetail from './Pages/MuseumDetailsPage';
import LoginPage from "./Pages/LoginPage";
import WaitPage from "./Pages/WaitPage";
import AdvertiserActivities from "./Pages/AdvertiserActivities";
import SellerProductsPage from "./Pages/SellerProducts";
import ProductDetails from "./Pages/ProductsDetailsPage";
import FlightsandHotels from "./Pages/FlightsandHotels";

import HotelSearchPage from "./Pages/HotelSearchPage";
import HotelDetails from "./Pages/HotelDetails";
import BookingPage from "./Pages/MyBookingsPage";
import MyPurchases from './Pages/MyPurchases';
import TransportationManagement from './Pages/TransportationPage';

import CreateAdminAccount from "./Components/Admin Portal/Components/UserManagement/CreateNewAccounts";
import AdminLayout from "./Components/Admin Portal/AdminLayout";
import ApproveRegistrants from "./Components/Admin Portal/Components/UserManagement/ApproveRegistrants";
import ManageUserAccounts from "./Components/Admin Portal/Components/UserManagement/ManageUserAccounts";
import ViewComplaints from "./Components/Admin Portal/Components/ComplaintManagement/ViewComplaints";
import UsersToDelete from "./Components/Admin Portal/Components/UserManagement/UsersToDelete";
import ManageCategoriesTags from "./Components/Admin Portal/Components/ContentManagement/ManageCategoriesTags";
import ManageProducts from "./Components/Admin Portal/Components/ProductManagement/ManageProducts";
import ManageActivities from "./Components/Admin Portal/Components/ContentManagement/ManageActivities";
import ManageItineraries from "./Components/Admin Portal/Components/ContentManagement/ManageItineraries";
import ManageMuseums from "./Components/Admin Portal/Components/ContentManagement/ManageMuseums";
import ManageHistoricalPlaces from "./Components/Admin Portal/Components/ContentManagement/ManageHistoricalPlaces";
import TourGuideItineraries from "./Pages/TourGuideItineraries";
import TourismGovernorTags from "./Pages/TourismGovernorTags"
import TourismGovernorHistoricalPlaces from "./Pages/TourismGovernorHistoricalPlaces"
import TourismGovernorMuseums from "./Pages/TourismGovernorMuseums"


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<NavBarContainer/>}>
					<Route index element={<ExplorePage/>}/>
					<Route path="admin" element={<AdminLayout/>}>
						<Route path='admin-accounts' element={<CreateAdminAccount/>}/>
						<Route path='approve-users' element={<ApproveRegistrants/>}/>
						<Route path='manage-users' element={<ManageUserAccounts/>}/>
						<Route path='users-to-delete' element={<UsersToDelete/>}/>
						<Route path='activities' element={<ManageActivities/>}/>
						<Route path='itineraries' element={<ManageItineraries/>}/>
						<Route path='museums' element={<ManageMuseums/>}/>
						<Route path='historical-places' element={<ManageHistoricalPlaces/>}/>
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
					<Route path='activities/:id' element={<ActivityDetailsPage/>}/>
					<Route path='itineraries' element={<ItinerariesPage/>}/>
					<Route path='itineraries/:id' element={<ItineraryDetail/>}/>
					<Route path="explore" element={<ExplorePage/>}/>
					<Route path="products" element={<ProductsPage/>}/>
					<Route path="products/:id" element={<ProductDetails/>}/>
					<Route path="complaints" element={<ComplaintsPage/>}/>
					<Route path="login" element={<LoginPage/>}/>
					<Route path="register" element={<RegisterPage/>}/>
					<Route path="historicalplaces/:id" element={<HistoricalPlaceDetail/>}/>
					<Route path="museum/:id" element={<MuseumDetail/>}/>
					<Route path="bookings" element={<BookingPage/>}/>
					<Route path="advertiser-activities" element={<AdvertiserActivities/>}/>
					<Route path="seller-products" element={<SellerProductsPage/>}/>
					<Route path="my-purchases" element={<MyPurchases/>}/>
					<Route path="transportation" element={<TransportationManagement/>}/>
					<Route path="tour-guide-itineraries" element={<TourGuideItineraries/>}/>
					<Route path="tour-guide-tags" element={<TourismGovernorTags/>}/>
					<Route path="tour-guide-historical-places" element={<TourismGovernorHistoricalPlaces/>}/>
					<Route path="tour-guide-museums" element={<TourismGovernorMuseums/>}/>
					<Route path="flights-and-hotels" element={<FlightsandHotels/>}/>
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
				<GeneralNavBar/>
				<Outlet/>
			</>
		);
	}

	return (
		<>
			{/* role: {role}, id: {user} */}
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
