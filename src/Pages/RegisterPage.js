import React, {useState} from 'react';
import Logo from '../Assets/Logo.png';
import {
	AdvertiserRegisterForm,
	SellerRegisterForm,
	TourGuideRegisterForm,
	TouristRegisterForm,
} from '../Components/Registration Forms/index.js';
const RegisterPage = () => {
	const [selectedRole, setSelectedRole] = useState('Tourist');
	const handleChangeRole = (role) => {
		setSelectedRole(role);
	};
	const renderForm = () => {
		switch (selectedRole) {
			case 'Advertiser':
				return <AdvertiserRegisterForm onChangeRole={handleChangeRole} />;
			case 'Seller':
				return <SellerRegisterForm onChangeRole={handleChangeRole} />;
			case 'Tour Guide':
				return <TourGuideRegisterForm onChangeRole={handleChangeRole} />;
			default:
				return <TouristRegisterForm onChangeRole={handleChangeRole} />;
		}
	};


	return (
		<div className="flex h-[calc(100vh-80px)] bg-[#fcfcfc]">
			{/* Left Side - Logo Text */}
			<div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)] w-[50%]">
				<div className="flex-1 flex items-center justify-center h-max w-max">
					<img src={Logo} alt="logo" className="w-[600px] h-[600px] object-cover"/>
				</div>
			</div>
			{/* Right Side - Tourist Register Form */}
			<div className="flex-1 flex items-center justify-center h-[calc(100vh-80px)] w-[50%]">
				<div className="flex-1 flex items-center justify-center p-8">
					{renderForm()}
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;

