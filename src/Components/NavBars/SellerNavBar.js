import NavBar from "./NavBar";
import {NavLink} from "react-router-dom";

const SellerNavBar = () => {
	return (
		<NavBar>
			<NavLink to='/profile' replace={true} className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Profile</NavLink>
			<NavLink to='/products' replace={true} className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Products</NavLink>
			<NavLink to='/explore' replace={true}  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2">Explore</NavLink>
		</NavBar>
	)
}
export default SellerNavBar;