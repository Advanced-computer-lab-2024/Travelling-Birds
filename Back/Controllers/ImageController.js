const cloudinary = require('cloudinary').v2;

require('dotenv').config();

cloudinary.config({
	secure: true,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPhoto = async (imagePath, publicId) => {
	const uploadResult = await cloudinary.uploader
		.upload(imagePath, {
			public_id: publicId,
		})
		.catch((error) => {
			console.log(error);
		});

	console.log(uploadResult);
	return uploadResult;
};

const deletePhoto = async (publicId) => {
	const deleteResult = await cloudinary.uploader
		.destroy(publicId)
		.catch((error) => {
			console.log(error);
		});

	console.log(deleteResult);
	return deleteResult;
}

const fetchPhotoUrl = async (publicId) => {
	const optimizeUrl = cloudinary.url(publicId,
		{
			secure: true,
			fetch_format: 'auto',
			quality: 'auto'
		}
	);
	console.log(optimizeUrl);
	return optimizeUrl;
}

const fetchPhotoUrlWithTransformation = async (publicId, transformation) => {
	const optimizedUrl = cloudinary.url(publicId, transformation);
	console.log(optimizedUrl);
	return optimizedUrl;
}

module.exports = {
	uploadPhoto,
	deletePhoto,
	fetchPhotoUrl,
	fetchPhotoUrlWithTransformation
};