import Card from "./Card";
import { Link } from "react-router-dom";

const HomeCards = () => {
	return (
		<section className="py-4">
			<div className="container-xl lg:container m-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
					<Card bg={'bg-gray-100'}>
						<h2 className="text-2xl font-bold">For Travel Lovers</h2>
						<p className="mt-2 mb-4">
							Choose what you would like to register as
						</p>
						<Link
							to="/tourist"
							className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
						>
							Tourist
						</Link>

						<Link
							to="/tourguide"
							className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 ml-2"
						>
							Tour Guide
						</Link>
						<Link
							to="/seller"
							className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 ml-2"
						>
							Seller
						</Link>
						<Link
							to="/admin"
							className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 ml-2"
						>
							Admin
						</Link>
						<Link
							to="/advertiser"
							className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 ml-2"
						>
							Advertiser
						</Link>
						<Link
							to="/tourismgoverner"
							className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700 ml-2"
						>
							Tourism Governer
						</Link>
					</Card>
				</div>
			</div>
		</section>
	);
}

export default HomeCards;