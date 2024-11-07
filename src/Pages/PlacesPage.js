import React, { useEffect, useState } from "react";
import MyHistoricalPlaceDisplay from "../Components/MyBookings/MyHistoricalPlaceDisplay";
import MyMuseumDisplay from "../Components/MyBookings/MyMuseumDisplay";
import { useNavigate } from "react-router-dom";
import { TagDisplay } from "../Components/Models/Displays";
import Popup from "reactjs-popup";
import { TagForm } from "../Components/Models/Forms";

const PlacesPage = () => {
	const [museums, setMuseums] = useState([]);
	const [historicalPlaces, setHistoricalPlaces] = useState([]);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const userRole = sessionStorage.getItem('role');

	useEffect(() => {
		const fetchData = async () => {
			const museumsApiUrl = `${process.env.REACT_APP_BACKEND}/api/museums`;
			const historicalPlacesApiUrl = `${process.env.REACT_APP_BACKEND}/api/historicalPlaces`;

			try {
				const [museumsRes, historicalPlacesRes] = await Promise.all([
					fetch(museumsApiUrl),
					fetch(historicalPlacesApiUrl),
				]);

				const museumsData = await museumsRes.json();
				const historicalPlacesData = await historicalPlacesRes.json();

				setMuseums(museumsData);
				setHistoricalPlaces(historicalPlacesData);

				console.log("Museums:", museumsData);
				console.log("Historical Places:", historicalPlacesData);
			} catch (err) {
				console.log("Error fetching data", err);
			} finally {
				setLoading(false);
			}
		};
		const fetchTags = async () => {
			const apiUrl = `${process.env.REACT_APP_BACKEND}/api/tags`;
			setLoading(true);
			try {
				const res = await fetch(apiUrl);
				const tags = await res.json();
				setTags(tags);
			} catch (err) {
				console.log('Error fetching tags', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData().then();
		fetchTags().then();

		window.addEventListener("modelModified", fetchData);
		window.addEventListener("tagModified", fetchTags);

		return () => {
			window.removeEventListener("modelModified", fetchData);
			window.removeEventListener("tagModified", fetchTags);
		};
	}, []);

	const handleCreateMuseum = () => {
		navigate("/create-museum");
	};

	const handleCreateHistoricalPlace = () => {
		navigate("/create-historical-place");
	};

	const handleViewMyCreations = () => {
		const fetchData = async () => {
			const museumsApiUrl = `${process.env.REACT_APP_BACKEND}/api/museums/user/${sessionStorage.getItem('user id')}`;
			const historicalPlacesApiUrl = `${process.env.REACT_APP_BACKEND}/api/historicalPlaces/user/${sessionStorage.getItem('user id')}`;

			try {
				const [museumsRes, historicalPlacesRes] = await Promise.all([
					fetch(museumsApiUrl),
					fetch(historicalPlacesApiUrl),
				]);

				const museumsData = await museumsRes.json();
				const historicalPlacesData = await historicalPlacesRes.json();

				setMuseums(museumsData);
				setHistoricalPlaces(historicalPlacesData);

				console.log("Museums:", museumsData);
				console.log("Historical Places:", historicalPlacesData);
			} catch (err) {
				console.log("Error fetching data", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData().then();
	}

	return (
		<div>
			<section className="bg-white px-4 py-10">
				<div className="container-xl lg:container m-auto">
					<h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
						My Museums and Historical Places
					</h2>

					{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(userRole) && (
						<div className="mb-6">
							<button
								onClick={handleCreateMuseum}
								className="bg-[#330577] text-white px-4 py-2 rounded-md mb-4 mr-4"
							>
								Create New Museum
							</button>
							<button
								onClick={handleCreateHistoricalPlace}
								className="bg-[#330577] text-white px-4 py-2 rounded-md mb-4 mr-4"
							>
								Create New Historical Place
							</button>
							<button
								onClick={handleViewMyCreations}
								className="bg-[#330577] text-white px-4 py-2 rounded-md mb-6 mr-4"
							>
								View My Created Activities
							</button>
						</div>
					)}
					{userRole !== 'tourist' && (
						<div className="flex flex-row gap-6 py-4">
							{!loading ? (
								tags.map((tag) => (
									<TagDisplay className='py-4' key={tag._id} tag={tag} />
								))) : (
								<p className="text-[#330577]">Loading tags...</p>
							)}
							{['tour_guide', 'advertiser', 'tourism_governor', 'admin'].includes(userRole) &&
							<Popup
								className="h-fit overflow-y-scroll"
								trigger={
									<button className="bg-[#330577] text-white px-4 py-2 rounded-lg mr-4">
										New Tag
									</button>
								}
								modal
								contentStyle={{maxHeight: '80vh', overflowY: 'auto'}}
								overlayStyle={{background: 'rgba(0, 0, 0, 0.5)'}}
							>
								<TagForm className="overflow-y-scroll" />
							</Popup>}
						</div>
					)}

					<div className="mb-10">
						<h3 className="text-2xl font-semibold text-[#330577] mb-4">
							Historical Places
						</h3>
						<div className="grid grid-cols-1 gap-6">
							{!loading ? (
								historicalPlaces.map((historicalPlace) => (
									<MyHistoricalPlaceDisplay key={historicalPlace._id} historicalPlace={historicalPlace} />
								))
							) : (
								<p className="text-[#330577]">Loading historical places...</p>
							)}
						</div>
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-[#330577] mb-4">
							Museums
						</h3>
						<div className="grid grid-cols-1 gap-6">
							{!loading ? (
								museums.map((museum) => (
									<MyMuseumDisplay key={museum._id} museum={museum} />
								))
							) : (
								<p className="text-[#330577]">Loading museums...</p>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default PlacesPage;