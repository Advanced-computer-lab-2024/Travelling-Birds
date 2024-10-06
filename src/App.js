import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import {TouristForm} from "./Components/Registration Forms/TouristForm";
import {TourGuideForm} from "./Components/Registration Forms/TourGuideForm";
import {SellerForm} from "./Components/Registration Forms/SellerForm";
import {AdminForm} from "./Components/Registration Forms/AdminForm";
import {AdvertiserForm} from "./Components/Registration Forms/AdvertiserForm";
import {TourismGovernorForm} from "./Components/Registration Forms/TourismGovernorForm";
import ExplorePage from "./Pages/ExplorePage";
import ProfilePage from "./Pages/ProfilePage";
import ProductsHomePage from "./Components/Product Page/ProductsHomePage";
import ProductsPage from "./Pages/ProductsPage";


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
				<Route path="/explore" element={<ExplorePage/>}/>
				<Route path="/product" element={<ProductsPage/>}/>
			</>
		)
	);
	return (
		<RouterProvider router={router}/>

	);
}

export default App;