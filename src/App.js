import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import {TouristForm} from "./Components/Registration Forms/TouristForm";
import {TourGuideForm} from "./Components/Registration Forms/TourGuideForm";
import {SellerForm} from "./Components/Registration Forms/SellerForm";
import {AdminForm} from "./Components/Registration Forms/AdminForm";
import {AdvertiserForm} from "./Components/Registration Forms/AdvertiserForm";
import {TourismGovernorForm} from "./Components/Registration Forms/TourismGovernorForm";
import SearchPage from "./Pages/SearchPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
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
				<Route path='/search' element={<SearchPage />} /> 
				
			</>
		)
	);
	return (
		<RouterProvider router={router}/>
	);
}

export default App;