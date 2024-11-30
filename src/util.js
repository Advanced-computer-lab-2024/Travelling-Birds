const getObject = (objName, objFields) => {
	// create getter and setter functions for each field
	const obj = {};
	objFields.forEach(field => {
		obj[`get${field}`] = () => obj[field];
		obj[`set${field}`] = (value) => obj[field] = value;
	});
	return obj;
}