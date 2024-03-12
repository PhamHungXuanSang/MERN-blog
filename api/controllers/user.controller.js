import Blog from '../models/blog.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const getUserProfile = async (req, res, next) => {
    const username = req.params.username;
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
        return next(errorHandler(404, 'User not found'));
    }
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const totalBlogs = await Blog.find({ authorId: user._id });
        let totalViews = 0;
        totalBlogs.forEach((blog) => {
            totalViews += blog.viewed;
        });
        const blogs = await Blog.find({ authorId: user._id })
            .populate('authorId', '_id username email userAvatar createdAt')
            .sort({ createdAt: -1 })
            .skip(page != 1 ? (page - 1) * limit : 0)
            .limit(limit);

        res.status(200).json({ user, blogs, total: totalBlogs.length, totalViews });
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }

    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 or 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username can not include spaces'));
        }
        if (req.body.username != req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        }

        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) {
            return next(errorHandler(400, 'Username already used'));
        }
    }

    if (req.body.userDesc) {
        if (req.body.userDesc.length > 200) {
            return next(errorHandler(400, 'User description can contain maximum 200 characters'));
        }
    }

    try {
        const updateUserProfile = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    userAvatar: req.body.userAvatar,
                    userDesc: req.body.userDesc,
                    youtubeLink: req.body.youtube,
                    facebookLink: req.body.facebook,
                    tiktokLink: req.body.tiktok,
                    githubLink: req.body.github,
                },
            },
            { new: true },
        );

        const { password, ...rest } = updateUserProfile._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const allblog = async (req, res) => {
    const filter = {};
    const blogs = await Blog.find(filter);

    res.json(blogs);
};

export const deleteAccount = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }

    try {
        const refreshToken = req.cookies.refresh_token;
        await RefreshToken.deleteOne({ refreshToken });

        await User.findByIdAndDelete(req.params.userId);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        await RefreshToken.deleteOne({ refreshToken });
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(200).json('User has been signed out');
    } catch (error) {
        next(error);
    }
};
