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
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
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
import UsersPage from "./Pages/UsersPage";
import ItinerariesPage from "./Pages/ItinerariesPage";
import ItineraryForm from "./Components/Models/Forms/ItineraryForm";
import ProductsPage from "./Pages/ProductsPage";
import MuseumForm from "./Components/Models/Forms/MuseumForm";
import {HistoricalPlaceForm} from "./Components/Models/Forms";
import PlacesPage from "./Pages/PlacesPage";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<NavBarContainer/>}>
					<Route index element={<RegisterPage/>}/>
					<Route path='tourist' element={<TouristForm/>}/>
					<Route path='tour-guide' element={<TourGuideForm/>}/>
					<Route path='seller' element={<SellerForm/>}/>
					<Route path='admin' element={<AdminForm/>}/>
					<Route path='advertiser' element={<AdvertiserForm/>}/>
					<Route path='tourism-governor' element={<TourismGovernorForm/>}/>
					<Route path='profile' element={<ProfilePage/>}/>
					<Route path='users' element={<UsersPage/>}/>
					<Route path='places' element={<PlacesPage/>}/>
					<Route path='activities' element={<ActivityPage/>}/>
					<Route path='itineraries' element={<ItinerariesPage/>}/>
					<Route path='create-activity' element={<ActivityForm/>}/>
					<Route path='create-itinerary' element={<ItineraryForm/>}/>
					<Route path='create-museum' element={<MuseumForm/>}/>
					<Route path='create-historical-place' element={<HistoricalPlaceForm/>}/>
					<Route path="explore" element={<ExplorePage/>}/>
					<Route path="products" element={<ProductsPage/>}/>
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
			{/*role: {role}, id: {user}*/}
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