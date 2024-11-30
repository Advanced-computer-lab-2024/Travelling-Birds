import { NavLink } from "react-router-dom";

const NavBar = ({ children }) => {
	return (
		<nav className="bg-[#fcfcfc] border-b border-[#fcfcfc]">
			<div className="relative w-full px-2 sm:px-6 lg:px-8">
				<div className="flex h-20 items-center justify-between">
					<div className="flex flex-1 items-center md:items-stretch md:justify-start">
						<NavLink className="flex flex-shrink-0 items-center mr-4" to="/index.html"></NavLink>
					</div>
					<div className="absolute inset-0">
						{children}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default NavBar;
