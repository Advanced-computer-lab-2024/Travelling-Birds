import React from 'react';
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
	return (
		<>
			{children}
			{sessionStorage.getItem('role') === 'tourist' && <TouristNavBar/>}
			{sessionStorage.getItem('role') === 'admin' && <AdminNavBar/>}
		</>
	);
}