import logo from '../logo.svg';
import {NavLink} from 'react-router-dom';

const TouristNavBar = () => {
	const activeStyle = ({isActive}) => {
		return isActive ? 'text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2' : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
	};
	return (
		<nav className="bg-indigo-700 border-b border-indigo-500">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="flex h-20 items-center justify-between">
					<div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
						<NavLink className="flex flex-shrink-0 items-center mr-4" to="/index.html">
						</NavLink>
						<div className="md:ml-auto">
							<div className="flex space-x-2">
								<NavLink to="/" className={activeStyle}>Profile</NavLink>
								<NavLink to="/profile" className={activeStyle}>Products</NavLink>
								<NavLink to='/places' className={activeStyle}>Places</NavLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
export default TouristNavBar;