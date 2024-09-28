function App() {
    const Click = () => {
        console.log('Button clicked');
    }
  return (
    <div className="bold">
        <h1>Hello, world!</h1>
        <button onClick={Click}>Click me</button>
    </div>
  );
}

export default App;
