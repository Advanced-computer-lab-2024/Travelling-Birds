import React from 'react';
import LogIn from '../Components/LogIn';

const LoginPage = () => {
	return (
		<div className="flex items-center justify-center h-[calc(100vh-80px)] bg-[#fcfcfc] px-4">
			<div className="flex w-full max-w-6xl gap-96">
				{/* Left Side - Logo Placeholder */}
				<div className="flex-1 flex items-center justify-center">
					<div className="text-4xl font-bold text-gray-600">
						Logo should be here
					</div>
				</div>
				{/* Right Side - Card */}
				<div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-sm">
					<h1 className="text-3xl font-bold text-center text-[#330577] mb-8">For Travel Lovers</h1>
					<div className="mb-6">
						<LogIn />
					</div>
					<div className="mt-4 text-center">
						<p className="text-sm">
							Don't have an account?{' '}
							<a href="/register" className="text-blue-500 hover:underline">
								Register
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
