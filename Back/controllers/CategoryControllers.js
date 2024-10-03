const Category  = require('../models/Category');

//Create Category
const addCategory = async (req, res) => {
    const {name} = req.body;
    try {
        const newCategory = new Category({name});
        await newCategory.save();
        res.status(201).json({message: 'Category added successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//Read Category
const getCategory = async (req, res) => {
    try {
        const Category = await Category.findById(req.params.id);
        if (!Category) {
            return res.status(404).json({message: 'category not found'});
        }
        res.status(200).json(Category);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//Update Category
const updateCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(201).json({msg: "Category updated successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Delete tag
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(201).json({msg: "Category deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory
};