/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	daisyui: {
		themes: [
			{
				mytheme: {
					"primary": "#330577",
					"secondary": "#4d0a99",
					"accent": "#b380ff",
					"neutral": "#1f1b33",
					"base-100": "#f3f1f7",
					"info": "#4d5eff",
					"success": "#32cd32",
					"warning": "#ffaa00",
					"error": "#e63946",
				},
			},
		],
	},
	plugins: [
		require('daisyui'),
	],
}