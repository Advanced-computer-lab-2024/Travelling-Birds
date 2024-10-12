const CategoryModel  = require('../models/Category');

// Create Category
const addCategory = async (req, res) => {
    const {name} = req.body;
    try {
        const newCategory = new CategoryModel({name});
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Get all Categories
const getAllCategories = async (req, res) => {
    try {
        const Categories = await CategoryModel.find();
        res.status(200).json(Categories)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Read Category
const getCategory = async (req, res) => {
    try {
        const Category = await CategoryModel.findById(req.params.id);
        if (!Category) {
            return res.status(404).json({message: 'category not found'});
        }
        res.status(200).json(Category);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Update Category
const updateCategory = async (req, res) => {
    const {name} = req.body;
    try {
        const category = await CategoryModel.findByIdAndUpdate(req.params.id, {name}, {new: true});
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        await CategoryModel.findByIdAndDelete(req.params.id);
        res.status(201).json({msg: "Category deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    addCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
};