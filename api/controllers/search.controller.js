import Blog from '../models/blog.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const search = async (req, res, next) => {
    try {
        let query = req.params.query;
        let page = req.query.page;
        let limit = req.query.limit;

        const regex = new RegExp(query, 'i');
        const totalBlogs = await Blog.find({ title: regex });
        const searchResults = await Blog.find({ title: regex })
            .populate('authorId', '_id username email userAvatar')
            .sort({ createdAt: -1 })
            .skip(page != 1 ? (page - 1) * limit : 0)
            .limit(limit);
        res.status(200).json({ blogs: searchResults, total: totalBlogs.length });
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
