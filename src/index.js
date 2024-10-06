import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeCards from "./Components/HomeCards";
import TouristNavBar from "./Components/NavBars/TouristNavBar";
import AdminNavBar from "./Components/NavBars/AdminNavBar";
import TourGuideNavBar from "./Components/NavBars/TourGuideNavBar";
import SellerNavBar from "./Components/NavBars/SellerNavBar";
import AdvertiserNavBar from "./Components/NavBars/AdvertiserNavBar";
import TourismGovernorNavBar from "./Components/NavBars/TourismGovernorNavBar";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
		<NavBarContainer>
			<App/>
		</NavBarContainer>
		<ToastContainer/>
		</BrowserRouter	>
	</React.StrictMode>
);

function NavBarContainer({children}) {
	return (
		<>
			{children}
			{sessionStorage.getItem('role') === 'tourist' && <TouristNavBar/>}
			{sessionStorage.getItem('role') === 'admin' && <AdminNavBar/>}
			{sessionStorage.getItem('role') === 'tour_guide' && <TourGuideNavBar/>}
			{sessionStorage.getItem('role') === 'seller' && <SellerNavBar/>}
			{sessionStorage.getItem('role') === 'advertiser' && <AdvertiserNavBar/>}
			{sessionStorage.getItem('role') === 'tourism_governor' && <TourismGovernorNavBar/>}
		</>
	);
}