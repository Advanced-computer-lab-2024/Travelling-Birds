
import {NavLink} from 'react-router-dom';
import NavBar from "./NavBar";

const TouristNavBar = () => {
	
	return (
		<NavBar>
			<NavLink to='/profile' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Profile</NavLink>
			<NavLink to='/products' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Products</NavLink>
			<NavLink to='/places' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Places</NavLink>
			<NavLink to='/itineraries' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Itineraries</NavLink>
			<NavLink to='/explore' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Explore</NavLink>
			<NavLink to='/complaints' className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Complaints</NavLink>
		</NavBar>
	);
}
export default TouristNavBar;