import Blog from '../models/blog.model.js';
import { errorHandler } from '../utils/error.js';

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
