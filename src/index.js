import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import TouristNavBar from "./Components/NavBars/TouristNavBar";
import AdminNavBar from "./Components/NavBars/AdminNavBar";
import {BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import {TouristForm} from "./Components/Registration Forms/TouristForm";
import {TourGuideForm} from "./Components/Registration Forms/TourGuideForm";
import {SellerForm} from "./Components/Registration Forms/SellerForm";
import {AdminForm} from "./Components/Registration Forms/AdminForm";
import {TourismGovernorForm} from "./Components/Registration Forms/TourismGovernorForm";
import ProfilePage from "./Pages/ProfilePage";
import ActivityPage from "./Pages/ActivitiesPage";
import ActivityForm from "./Components/Models/Forms/ActivityForm";
import ExplorePage from "./Pages/ExplorePage";
import AdvertiserForm from "./Components/Registration Forms/AdvertiserForm";
import TourGuideNavBar from "./Components/NavBars/TourGuideNavBar";
import SellerNavBar from "./Components/NavBars/SellerNavBar";
import AdvertiserNavBar from "./Components/NavBars/AdvertiserNavBar";
import TourismGovernorNavBar from "./Components/NavBars/TourismGovernorNavBar";

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path='/' element={<RegisterPage/>}/>
			<Route path='/tourist' element={<TouristForm/>}/>
			<Route path='/tourguide' element={<TourGuideForm/>}/>
			<Route path='/seller' element={<SellerForm/>}/>
			<Route path='/admin' element={<AdminForm/>}/>
			<Route path='/advertiser' element={<AdvertiserForm/>}/>
			<Route path='/tourismgoverner' element={<TourismGovernorForm/>}/>
			<Route path='/profile' element={<ProfilePage/>}/>
			<Route path='/activities' element={<ActivityPage/>}/>
			<Route path='/create-activity' element={<ActivityForm/>}/>
			<Route path="/explore" element={<ExplorePage/>}/>
		</>
	)
);

root.render(
	<React.StrictMode>
		<RouterProvider router={router}>
			<NavBarContainer>
				<App/>
			</NavBarContainer>
			<ToastContainer/>
		</RouterProvider>
	</React.StrictMode>
);

function NavBarContainer({children}) {
	const [role, setRole] = React.useState("HELLOOOOOO");
	useEffect(() => {
		setRole(sessionStorage.getItem('role'));
	}, []);
	return (
		<>
			{role}
			{children}
			{role === 'tourist' && <TouristNavBar/>}
			{role === 'admin' && <AdminNavBar/>}
			{role === 'tour_guide' && <TourGuideNavBar/>}
			{role === 'seller' && <SellerNavBar/>}
			{role === 'advertiser' && <AdvertiserNavBar/>}
			{role === 'tourism_governor' && <TourismGovernorNavBar/>}
		</>
	);
}