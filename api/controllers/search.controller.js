import mongoose from 'mongoose';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js';

export const search = async (req, res, next) => {
    try {
        let query = req.params.query;
        let page = parseInt(req.query.page || '1');
        let limit = parseInt(req.query.limit || '10');
        let sort = req.query.sort === 'desc' ? -1 : 1;
        let category = req.query.category;

        let baseQuery = { 'isBlocked.status': false };
        if (category && category != 'all category') {
            baseQuery.category = category;
        }

        if (query) {
            let searchTerms = Array.isArray(query) ? query : query.split(',');
            let regex = searchTerms.map((term) => new RegExp(term.trim(), 'i'));

            baseQuery.$or = [{ title: { $in: regex } }, { tags: { $in: regex } }];
        }
        if (req.query.currentSlug) {
            let currentSlug = req.query.currentSlug;
            baseQuery = {
                $and: [{ slug: { $ne: currentSlug } }, baseQuery],
            };
        }

        const regexQuery = new RegExp(query, 'i');
        const [searchResults, users, totalBlogs] = await Promise.all([
            Blog.find(baseQuery)
                .populate('authorId', '_id username email userAvatar')
                .sort({ createdAt: sort, title: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            User.find({
                $or: [{ username: regexQuery }, { email: regexQuery }, { userDesc: regexQuery }],
            }).select('_id username email userAvatar'),
            Blog.countDocuments(baseQuery).exec(),
        ]);
        return res.status(200).json({ blogs: searchResults || [], total: totalBlogs, users: users || [] });
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
