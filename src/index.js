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
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {NotificationsProvider} from './Components/NotificationsContext';

import ProfilePage from "./Pages/ProfilePage";
import ExplorePage from "./Pages/ExplorePage";
import ComplaintsPage from "./Pages/ComplaintsPage";


//Login and Register
import RegisterPage from "./Pages/LoginAndRegister/RegisterPage";
import LoginPage from "./Pages/LoginAndRegister/LoginPage";
import WaitPage from "./Pages/LoginAndRegister/WaitPage";

//flights and hotels
import FlightsandHotels from "./Pages/FlightsAndHotels/FlightsandHotels";
import FlightSearchPage from "./Pages/FlightsAndHotels/Flights/FlightSearchPage";
import FlightDetails from "./Pages/FlightsAndHotels/Flights/FlightDetails";
import HotelSearchPage from "./Pages/FlightsAndHotels/Hotels/HotelSearchPage";
import HotelDetails from "./Pages/FlightsAndHotels/Hotels/HotelDetails";

//my bookings
import BookingPage from "./Pages/MyBookings/MyBookingsPage";
import ActivitiesPage from "./Pages/MyBookings/Activities/ActivitiesPage";
import ItinerariesPage from "./Pages/MyBookings/Itineraries/ItinerariesPage";
import PlacesPage from "./Pages/MyBookings/Places/PlacesPage";

//details
import ActivityDetailsPage from "./Pages/BookingDetailsPages/ActivityDetailsPage";
import ItineraryDetail from "./Pages/BookingDetailsPages/ItinerariesDetailPage";
import HistoricalPlaceDetail from "./Pages/BookingDetailsPages/HistoricalPlaceDetailsPage";
import MuseumDetail from './Pages/BookingDetailsPages/MuseumDetailsPage';

//Products
import ProductsPage from "./Pages/Products/ProductsPage";
import ProductDetails from "./Pages/Products/ProductsDetailsPage";
import MyPurchases from './Pages/Products/MyPurchases';
import ProductCart from "./Pages/Products/ProductCart";

//my creations
import AdvertiserActivities from "./Pages/MyCreations/Advertiser/AdvertiserActivities";
import TransportationManagement from './Pages/MyCreations/Advertiser/AdvertiserTransportations';
import SellerProducts from "./Pages/MyCreations/Seller/SellerProducts";
import TourGuideItineraries from "./Pages/MyCreations/TourGuide/TourGuideItineraries";
import TourismGovernorHistoricalPlaces from "./Pages/MyCreations/ToursimGovernor/TourismGovernorHistoricalPlaces"
import TourismGovernorMuseums from "./Pages/MyCreations/ToursimGovernor/TourismGovernorMuseums"
import TourismGovernorTags from "./Pages/MyCreations/ToursimGovernor/TourismGovernorTags"

//my Interests
import SavedActivities from "./Pages/MyInterests/Events/SavedActivities";
import SavedItineraries from "./Pages/MyInterests/Events/SavedItineraries";
import ProductWishlist from "./Pages/MyInterests/Wishlist/ProductWishlist";
import MyInterests from "./Pages/MyInterests/MyInterests";


//Admin Portal Part 1
import AdminLayout from "./Components/Admin Portal/AdminLayout";
//Admin Portal Part 2
import CreateAdminAccount from "./Components/Admin Portal/Components/UserManagement/CreateNewAccounts";
import ApproveRegistrants from "./Components/Admin Portal/Components/UserManagement/ApproveRegistrants";
import ManageUserAccounts from "./Components/Admin Portal/Components/UserManagement/ManageUserAccounts";
import UsersToDelete from "./Components/Admin Portal/Components/UserManagement/UsersToDelete";
//Admin Portal Part 3
import ViewComplaints from "./Components/Admin Portal/Components/ComplaintManagement/ViewComplaints";
//Admin Portal Part 4
import ManageCategoriesTags from "./Components/Admin Portal/Components/ContentManagement/ManageCategoriesTags";
import ManageProducts from "./Components/Admin Portal/Components/ProductManagement/ManageProducts";
import ManageActivities from "./Components/Admin Portal/Components/ContentManagement/ManageActivities";
import ManageItineraries from "./Components/Admin Portal/Components/ContentManagement/ManageItineraries";
import ManageMuseums from "./Components/Admin Portal/Components/ContentManagement/ManageMuseums";
import ManageHistoricalPlaces from "./Components/Admin Portal/Components/ContentManagement/ManageHistoricalPlaces";
import ManagePromotions from "./Components/Admin Portal/Components/PromotionalManagement/ManagePromotions";
import ResetPasswordPage from "./Pages/LoginAndRegister/ResetPasswordPage";
import UserGrowth from "./Components/Admin Portal/Components/Analytics/UserGrowth";

import AddressBook from "./Pages/AddressBook";
import ProductCheckout from "./Pages/Products/ProductCheckout";

import Notfications from "./Pages/Notfications";
import RevenueAnalytics from "./Components/Admin Portal/Components/Analytics/RevenueAnalytics";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<Elements stripe={stripePromise}>
			<NotificationsProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<NavBarContainer/>}>
							<Route index element={<ExplorePage/>}/>
							<Route path="admin" element={<AdminLayout/>}>
								<Route path='users'>
									<Route path='admin-accounts' element={<CreateAdminAccount/>}/>
									<Route path='approve-users' element={<ApproveRegistrants/>}/>
									<Route path='manage-users' element={<ManageUserAccounts/>}/>
									<Route path='users-to-delete' element={<UsersToDelete/>}/>
								</Route>
								<Route path='content'>
									<Route path='activities' element={<ManageActivities/>}/>
									<Route path='itineraries' element={<ManageItineraries/>}/>
									<Route path='museums' element={<ManageMuseums/>}/>
									<Route path='historical-places' element={<ManageHistoricalPlaces/>}/>
									<Route path='tags-categories' element={<ManageCategoriesTags/>}/>
								</Route>
								<Route path='products' element={<ManageProducts/>}/>
								<Route path='complaints' element={<ViewComplaints/>}/>
								<Route path='promotions' element={<ManagePromotions/>}/>
								<Route path='analytics'>
									<Route path='user-growth' element={<UserGrowth/>}/>
									<Route path='revenue' element={<RevenueAnalytics/>}/>
								</Route>
							</Route>

							<Route path="advertiser-activities" element={<AdvertiserActivities/>}/>
							<Route path="transportation" element={<TransportationManagement/>}/>
							<Route path="seller-products" element={<SellerProducts/>}/>
							<Route path="tour-guide-itineraries" element={<TourGuideItineraries/>}/>
							<Route path="tour-guide-historical-places" element={<TourismGovernorHistoricalPlaces/>}/>
							<Route path="tour-guide-museums" element={<TourismGovernorMuseums/>}/>
							<Route path="tour-guide-tags" element={<TourismGovernorTags/>}/>

							<Route path="register" element={<RegisterPage/>}/>
							<Route path="login" element={<LoginPage/>}/>
							<Route path='wait' element={<WaitPage/>}/>
							<Route path='reset-password' element={<ResetPasswordPage/>}/>

							<Route path="flights-and-hotels" element={<FlightsandHotels/>}/>
							<Route path='flights' element={<FlightSearchPage/>}/>
							<Route path='flights/:flightId/:origin/:destination/:departureDate'
							       element={<FlightDetails/>}/>
							<Route path='hotels' element={<HotelSearchPage/>}/>
							<Route path='hotels/:hotelId/:checkInDate/:checkOutDate' element={<HotelDetails/>}/>

							<Route path="bookings" element={<BookingPage/>}/>
							<Route path='activities' element={<ActivitiesPage/>}/>
							<Route path='itineraries' element={<ItinerariesPage/>}/>
							<Route path='places' element={<PlacesPage/>}/>

							<Route path='activities/:id' element={<ActivityDetailsPage/>}/>
							<Route path='itineraries/:id' element={<ItineraryDetail/>}/>
							<Route path="historicalplaces/:id" element={<HistoricalPlaceDetail/>}/>
							<Route path="museum/:id" element={<MuseumDetail/>}/>

							<Route path="products" element={<ProductsPage/>}/>
							<Route path="products/:id" element={<ProductDetails/>}/>
							<Route path="my-purchases" element={<MyPurchases/>}/>
							<Route path="product-cart" element={<ProductCart/>}/>
							<Route path="/checkout" element={<ProductCheckout/>}/>


							<Route path="saved-activity" element={<SavedActivities/>}/>
							<Route path="saved-itinerary" element={<SavedItineraries/>}/>
							<Route path="product-wishlist" element={<ProductWishlist/>}/>
							<Route path="my-interests" element={<MyInterests/>}/>

							<Route path='profile' element={<ProfilePage/>}/>
							<Route path="explore" element={<ExplorePage/>}/>
							<Route path="complaints" element={<ComplaintsPage/>}/>
							<Route path="address" element={<AddressBook/>}/>
							<Route path="notifications" element={<Notfications/>}/>

						</Route>
					</Routes>
				</BrowserRouter>
			</NotificationsProvider>
		</Elements>
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
