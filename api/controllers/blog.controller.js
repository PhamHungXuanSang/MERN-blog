import Blog from '../models/blog.model.js';
import { errorHandler } from '../utils/error.js';

// export const allblogByUserId = async (req, res, next) => {
//     const blogs = await Blog.find({ authorId: req.params.username });

//     res.json(blogs);
// };

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
            .sort({ viewed: -1, liked: -1, createdAt: -1 })
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

    const title = await Blog.findOne({ title: req.body.title });
    if (title) {
        return next(errorHandler(400, 'Title already exists, please give another title'));
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
};

export const readBlog = async (req, res, next) => {
    const slug = req.params.slug;

    try {
        const blog = await Blog.findOneAndUpdate({ slug }, { $inc: { viewed: 1 } }, { new: true }).populate(
            'authorId',
            '_id username email userAvatar',
        );
        if (!blog) {
            return next(errorHandler(400, 'Blog not found'));
        }
        res.status(200).json({ blog });
    } catch (error) {
        next(error);
    }
};
