import Category from '../models/category.model.js';
import { errorHandler } from '../utils/error.js';

export const addNewCate = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to add new category'));
    }
    try {
        const categoryName = req.body.newCate.toLowerCase();
        const existingCategory = await Category.findOne({ categoryName: categoryName });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const newCate = new Category({ categoryName });
        const savedCate = await newCate.save();
        if (savedCate) {
            const allCates = await Category.find();
            return res.status(200).json({ allCates, message: 'Category has been saved 👌' });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllCategory = async (req, res, next) => {
    try {
        const allCates = await Category.find();
        return res.status(200).json({ allCates });
    } catch (error) {
        next(error);
    }
};

export const getAllNotBlockedCategory = async (req, res, next) => {
    try {
        const allCates = await Category.find({ isBlocked: false });
        return res.status(200).json({ allCates });
    } catch (error) {
        next(error);
    }
};

export const blockCategory = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (req.user._id.toString() !== userId) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to block category'));
        }

        const { cateId } = req.body;
        const category = await Category.findById(cateId);

        if (!category) {
            return next(errorHandler(404, 'Category not found'));
        }

        category.isBlocked = !category.isBlocked;

        await category.save();
        const allCates = await Category.find();
        return res
            .status(200)
            .json({ allCates, message: `Category has been ${category.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (req.user._id.toString() !== userId) {
            return next(errorHandler(403, 'Unauthorized'));
        }

        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete category'));
        }

        const { cateId } = req.body;
        const category = await Category.findById(cateId);
        if (!category) {
            return next(errorHandler(404, 'Category not found'));
        }

        await Category.findByIdAndDelete(cateId);
        return res.status(200).json({ message: 'Category has been deleted' });
    } catch (error) {
        next(error);
    }
};
