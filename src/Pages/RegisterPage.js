// import React, { useState } from 'react';
// import {
// 	AdvertiserRegisterForm,
// 	SellerRegisterForm,
// 	TourGuideRegisterForm,
// 	TouristRegisterForm,
// } from '../Components/Registration Forms/index.js';
//
// const RegisterPage = () => {
// 	const [selectedRole, setSelectedRole] = useState(null);
//
// 	const handleButtonClick = (role) => {
// 		setSelectedRole((prevRole) => (prevRole === role ? null : role));
// 	};
//
// 	const isSelected = (role) => selectedRole === role;
//
// 	const getButtonStyle = (role) => {
// 		let baseStyle =
// 			'w-full py-4 px-6 bg-[#330577] text-white rounded transition-transform transform hover:bg-[#4a1a99] focus:outline-none mb-10 ml-64';
// 		if (isSelected(role)) {
// 			baseStyle += ' -translate-x-24 bg-[#220446]';
// 		}
// 		return baseStyle;
// 	};
//
// 	return (
// 		<div className="flex h-screen">
// 			{/* Left Side - Buttons */}
// 			<div className="flex flex-col justify-center items-start  p-8">
// 				{['Tourist', 'Tour Guide', 'Advertiser', 'Seller'].map((role) => (
// 					<button
// 						key={role}
// 						className={getButtonStyle(role)}
// 						onClick={() => handleButtonClick(role)}
// 					>
// 						{role}
// 					</button>
// 				))}
// 			</div>
// 			{/* Right Side - Form Display */}
// 			<div className="flex-1 flex items-center justify-center p-8 ml-96">
// 				{selectedRole === 'Advertiser' && <AdvertiserRegisterForm />}
// 				{selectedRole === 'Seller' && <SellerRegisterForm />}
// 				{selectedRole === 'Tour Guide' && <TourGuideRegisterForm />}
// 				{selectedRole === 'Tourist' && <TouristRegisterForm />}
// 			</div>
// 		</div>
// 	);
// };
//
// export default RegisterPage;

import React, {useState} from 'react';
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
		<div className="flex h-[calc(100vh-80px)]">
			{/* Left Side - Logo Text */}
			<div className="flex flex-1 items-center justify-center p-8">
				<div className="text-4xl font-bold text-gray-600">
					Logo should be here
				</div>
			</div>
			{/* Right Side - Tourist Register Form */}
			<div className="flex-1 flex items-center justify-center p-8">
				{renderForm()}
			</div>
		</div>
	);
};

export default RegisterPage;

