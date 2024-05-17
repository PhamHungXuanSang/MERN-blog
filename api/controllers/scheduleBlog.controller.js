import ScheduleBlog from '../models/scheduleBlog.model.js';
import Blog from '../models/blog.model.js';
import { errorHandler } from '../utils/error.js';

export const addToSchedule = async (req, res, next) => {
    const userId = req.params.userId;
    const postingTime = req.body.postingTime;

    if (!req.body.blog.title.length) {
        return next(errorHandler(400, 'Please provide a blog title to publish'));
    }
    if (!req.body.blog.description.length || req.body.blog.description.length > 200) {
        return next(errorHandler(400, 'Please provide a blog description under 200 characters'));
    }
    if (!req.body.blog.content.blocks.length) {
        return next(errorHandler(400, 'Please provide a blog content to publish'));
    }
    if (!req.body.blog.tags.length || req.body.blog.tags.length > 10) {
        return next(errorHandler(400, 'Please provide tags to publish blog, maximum 10 tags'));
    }
    req.body.blog.tags = req.body.blog.tags.map((tag) => tag.toLowerCase());

    if (!req.body.blog.slug) {
        const [title, scheduleTitle] = await Promise.all([
            Blog.findOne({ title: req.body.blog.title }),
            ScheduleBlog.findOne({ title: req.body.blog.title }),
        ]);
        if (title || scheduleTitle) {
            return next(errorHandler(400, 'Title already exists, please give another title'));
        }
        const slug = req.body.blog.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        const newScheduleBlog = new ScheduleBlog({
            ...req.body.blog,
            slug,
            authorId: userId,
            postingTime,
        });

        try {
            const savedScheduleBlog = await newScheduleBlog.save();
            return res.status(200).json(savedScheduleBlog);
        } catch (error) {
            next(error);
        }
    } else {
        const [title, scheduleTitle] = await Promise.all([
            Blog.findOne({ title: req.body.blog.title }),
            ScheduleBlog.find({ title: req.body.blog.title }),
        ]);
        if (title || scheduleTitle.length > 1) {
            return next(errorHandler(400, 'Title already exists, please give another title'));
        }
        const newSlug = req.body.blog.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        let { slug, ...rest } = req.body.blog;
        try {
            const updatedBlog = await ScheduleBlog.findOneAndUpdate(
                { slug: req.body.blog.slug },
                { ...rest, slug: newSlug },
                {
                    new: true,
                },
            );
            return res.status(200).json(updatedBlog);
        } catch (error) {
            next(error);
        }
    }
};

export const scheduleBlogManagement = async (req, res, next) => {
    const { userId } = req.params;
    let query = req.body.query;
    const category = req.body.category;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '2');

    try {
        let filters = {
            authorId: userId,
        };
        if (category != 'all category') {
            filters.category = category;
        }

        if (query) {
            query = new RegExp(query.trim(), 'i');
            filters['$or'] = [{ title: query }, { description: query }];
        }

        const [scheduleBlogs, totalScheduleBlogs] = await Promise.all([
            ScheduleBlog.find(filters)
                .populate('authorId', '_id username email userAvatar')
                .sort({ createdAt: sort, title: 1 })
                .skip((page - 1) * limit)
                .limit(limit),
            ScheduleBlog.countDocuments(filters).exec(),
        ]);

        return res.status(200).json({ scheduleBlogs, total: totalScheduleBlogs });
    } catch (error) {
        next(error);
    }
};

export const deleteScheduleBlog = async (req, res, next) => {
    const scheduleBlogId = req.params.scheduleBlogId;
    const userId = req.user._id;
    if (req.user._id != userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }

    try {
        const blog = await ScheduleBlog.findById(scheduleBlogId, 'authorId').exec();
        if (!blog) {
            return next(errorHandler(400, 'Blog not found'));
        }
        if (blog.authorId.toString() !== userId.toString()) {
            return next(errorHandler(400, 'You are not allowed to delete this blog'));
        }

        // Thêm code xóa noti system thông báo: đã tự động đăng blog
        await Promise.all([ScheduleBlog.deleteOne({ _id: scheduleBlogId })]);

        return res.status(200).json('The blog has been deleted');
    } catch (error) {
        next(error);
    }
};

export const editScheduleBlog = async (req, res, next) => {
    let { userId } = req.body;
    if (req.user._id != userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const { slug } = req.params;

    try {
        const blog = await ScheduleBlog.findOne({ slug: slug });
        if (!blog) {
            return next(errorHandler(404, 'Blog not found'));
        }
        return res.status(200).json({ blog });
    } catch (error) {
        next(errorHandler(400, 'Blog not found'));
    }
};
