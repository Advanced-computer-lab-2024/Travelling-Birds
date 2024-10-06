import NavBar from "./NavBar";
import {NavLink} from "react-router-dom";

const TourGuideNavBar = () => {
	return (
		<NavBar>
			<NavLink to='/profile' replace={true} className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Profile</NavLink>
			<NavLink to='/products' replace={true} className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Products</NavLink>
			<NavLink to='/places' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Places</NavLink>
			<NavLink to='/itineraries' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Itineraries</NavLink>
			<NavLink to='/activities' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Activities</NavLink>
		</NavBar>
	);
}
export default TourGuideNavBar;