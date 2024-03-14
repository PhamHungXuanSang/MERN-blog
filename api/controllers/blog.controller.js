import Blog from '../models/blog.model.js';
import { errorHandler } from '../utils/error.js';
import { io, userSockets } from '../index.js';

export const latestBlogs = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const totalBlogs = await Blog.countDocuments({});
        const latestBlogs = await Blog.find({})
            .populate('authorId', '_id username email userAvatar')
            .sort({ createdAt: -1 })
            .skip(page != 1 ? (page - 1) * limit : 0)
            .limit(limit);
        res.status(200).json({ blogs: latestBlogs, total: totalBlogs });
    } catch (error) {
        next(error);
    }
};

export const trendingBlogs = async (req, res, next) => {
    try {
        const trendingBlogs = await Blog.find({})
            .populate('authorId', '_id username email userAvatar')
            .sort({ viewed: -1, likeCount: -1, createdAt: -1 })
            .limit(5);
        res.status(200).json(trendingBlogs);
    } catch (error) {
        next(error);
    }
};

export const categoryBlogs = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const totalBlogs = await Blog.find({ category: req.params.cate });
        const categoryBlogs = await Blog.find({ category: req.params.cate })
            .populate('authorId', '_id username email userAvatar')
            .sort({ createdAt: -1 })
            .skip(page != 1 ? (page - 1) * limit : 0)
            .limit(limit);
        res.status(200).json({ blogs: categoryBlogs, total: totalBlogs.length });
    } catch (error) {
        next(error);
    }
};

export const createBlog = async (req, res, next) => {
    const userId = req.params.userId;
    if (!req.body.title.length) {
        return next(errorHandler(400, 'Please provide a blog title to publish'));
    }
    if (!req.body.description.length || req.body.description.length > 200) {
        return next(errorHandler(400, 'Please provide a blog description under 200 characters'));
    }
    if (!req.body.content.blocks.length) {
        return next(errorHandler(400, 'Please provide a blog content to publish'));
    }
    if (!req.body.tags.length || req.body.tags.length > 10) {
        return next(errorHandler(400, 'Please provide tags to publish blog, maximum 10 tags'));
    }
    req.body.tags = req.body.tags.map((tag) => tag.toLowerCase());

    if (!req.body.slug) {
        const title = await Blog.findOne({ title: req.body.title });
        if (title) {
            return next(errorHandler(400, 'Title already exists, please give another title'));
        }
        const slug = req.body.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        const newBlog = new Blog({
            ...req.body,
            slug,
            authorId: userId,
        });

        try {
            const savedBlog = await newBlog.save();
            res.status(200).json(savedBlog);
        } catch (error) {
            next(error);
        }
    } else {
        const newSlug = req.body.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        let { slug, ...rest } = req.body;
        try {
            const updatedBlog = await Blog.findOneAndUpdate(
                { slug: req.body.slug },
                { ...rest, slug: newSlug },
                {
                    new: true,
                },
            );
            res.status(200).json(updatedBlog);
        } catch (error) {
            next(error);
        }
    }
};

export const readBlog = async (req, res, next) => {
    const slug = req.params.slug;

    try {
        const blog = await Blog.findOneAndUpdate({ slug }, { $inc: { viewed: 1 } }, { new: true }).populate(
            'authorId',
            '_id username email userAvatar',
        );
        if (!blog) {
            return next(errorHandler(404, 'Blog not found'));
        }
        res.status(200).json({ blog });
    } catch (error) {
        next(error);
    }
};

export const updateLikeBlog = async (req, res, next) => {
    let userId = req.params.userId;
    let blogId = req.body._id;
    try {
        let blog = await Blog.findById(blogId).populate('authorId', '_id username email userAvatar');
        let index = blog.likes.indexOf(userId);
        if (index > -1) {
            blog.likes.splice(index, 1);
        } else {
            blog.likes.push(userId);
        }
        blog = await blog.save();
        const authorId = blog.authorId._id ? blog.authorId._id.toString() : null;
        const socketId = userSockets.get(authorId.toString());
        if (socketId) {
            io.to(socketId).emit('push-like-noti', `User ${userId} đã thích bài viết của bạn`);
        }
        res.status(200).json({ blog });
    } catch (error) {
        next(error);
    }
};

export const ratingBlog = async (req, res, next) => {
    let blogId = req.params.blogId;
    let userId = req.params.userId;
    let ratingStar = req.body.rating;

    try {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { rating: { userId, star: ratingStar } },
            },
            { new: true },
        ).populate('authorId', '_id username email userAvatar');

        if (!blog) {
            return next(errorHandler(404, 'Blog not found'));
        }
        const authorId = blog.authorId._id ? blog.authorId._id.toString() : null;
        const socketId = userSockets.get(authorId.toString());
        if (socketId) {
            io.to(socketId).emit('push-rating-noti', `User ${userId} đã đánh giá ${ratingStar} cho bài viết ${blog._id}`);
        }
        res.status(200).json({ blog });
    } catch (error) {
        next(error);
    }
};

export const editBlog = async (req, res, next) => {
    let { userId } = req.body;
    if (req.user._id != userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const { slug } = req.params;

    try {
        const blog = await Blog.findOne({ slug: slug });
        if (!blog) {
            return next(errorHandler(404, 'Blog not found'));
        }
        res.status(200).json({ blog });
    } catch (error) {
        next(errorHandler(400, 'Blog not found'));
    }
};