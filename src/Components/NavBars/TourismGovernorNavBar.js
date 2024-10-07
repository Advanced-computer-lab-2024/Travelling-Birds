import NavBar from "./NavBar";
import {NavLink} from "react-router-dom";

const TourismGovernorNavBar = () => {
	return (
		<NavBar>
			<NavLink to='/profile' replace={true} className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Profile</NavLink>
			<NavLink to='/places' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Places</NavLink>
			<NavLink to='/explore' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Explore</NavLink>
		</NavBar>
	);
}
export default TourismGovernorNavBar;