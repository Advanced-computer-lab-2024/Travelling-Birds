import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeCards from "./Components/HomeCards";
import TouristNavBar from "./Components/NavBars/TouristNavBar";
import AdminNavBar from "./Components/NavBars/AdminNavBar";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Layout>
			<App/>
		</Layout>
		<ToastContainer/>
	</React.StrictMode>
);

function Layout({children}) {
	return (
		<>
			{children}
			{sessionStorage.getItem('role') === '' && <HomeCards/>}
			{sessionStorage.getItem('role') === 'tourist' && <TouristNavBar/>}
			{sessionStorage.getItem('role') === 'admin' && <AdminNavBar/>}
		</>
	);
}