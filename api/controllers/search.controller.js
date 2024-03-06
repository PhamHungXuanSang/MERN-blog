import mongoose from 'mongoose';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const search = async (req, res, next) => {
    try {
        let query = req.params.query;
        let page = parseInt(req.query.page || '1');
        let limit = parseInt(req.query.limit || '10');

        // Create a base query object that can be modified depending on currentSlug's existence
        let baseQuery = { $or: [{ title: new RegExp(query, 'i') }, { tags: new RegExp(query, 'i') }] };

        if (req.query.currentSlug) {
            // Making sure to handle invalid ObjectId error
            let currentSlug = req.query.currentSlug;

            // Adding a condition to exclude current blog using $ne
            baseQuery = {
                $and: [{ slug: { $ne: currentSlug } }, baseQuery],
            };
        }

        const totalBlogs = await Blog.countDocuments(baseQuery);
        const searchResults = await Blog.find(baseQuery)
            .populate('authorId', '_id username email userAvatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({ blogs: searchResults, total: totalBlogs });
    } catch (error) {
        next(error);
    }
};

export const searchUsers = async (req, res, next) => {
    try {
        let query = req.params.query;

        const users = await User.find({
            $or: [
                { username: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
                { userDesc: new RegExp(query, 'i') },
            ],
        }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
