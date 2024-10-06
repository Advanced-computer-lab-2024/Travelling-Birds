import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import TouristNavBar from "./Components/NavBars/TouristNavBar";
import AdminNavBar from "./Components/NavBars/AdminNavBar";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<NavBarContainer>
			<App/>
		</NavBarContainer>
		<ToastContainer/>
	</React.StrictMode>
);

function NavBarContainer({children}) {
	const [role, setRole] = React.useState("HELLOOOOOO");
	useEffect(() => {
		setRole(sessionStorage.getItem('role'));
	}, []);
	return (
		<div id='layout'>
			{role}
			{children}
			{role === 'tourist' && <TouristNavBar/>}
			{role === 'admin' && <AdminNavBar/>}
		</div>
	);
}