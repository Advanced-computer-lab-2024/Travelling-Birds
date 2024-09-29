function App() {
	const Click = () => {
		console.log('Button clicked');
		fetch('http://localhost:3001/api')
			.then(response => response.json())
			.then(data => console.log(data));
	}
	return (
		<div className="bold">
			<h1>Hello, world!</h1>
			<button className="btn w-64 rounded-full" onClick={Click}>Button</button>
		</div>
	);
}

export default App;
