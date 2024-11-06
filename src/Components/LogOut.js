// generic log out button

import {useNavigate} from "react-router-dom";
import {sessionStorageEvent} from "../utils/sessionStorageEvent";

const LogOut = () => {
	const navigate = useNavigate();
	const handleLogOut = () => {
		sessionStorage.removeItem('user id');
		sessionStorage.removeItem('role');
		window.dispatchEvent(sessionStorageEvent);
		navigate('/', {replace: true});
	}
	return (
		<button onClick={handleLogOut} className="bg-red-500 text-white py-2 px-4 rounded justify-center">Log out</button>
	)
}

export default LogOut;