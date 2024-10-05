import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeCards from "./Components/HomeCards";

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
		<div className="container mx-auto">
			{/*{children}*/}
			{sessionStorage.getItem('role') === '' && <HomeCards/>}
			{sessionStorage.getItem('role') === 'tourist' && <TouristNavBar/>}
			{sessionStorage.getItem('role') === 'admin' && <AdminNavBar/>}
		</div>
	);
}