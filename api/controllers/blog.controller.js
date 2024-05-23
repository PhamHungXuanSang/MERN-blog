import { errorHandler } from '../utils/error.js';
import Blog from '../models/blog.model.js';
import Comment from '../models/comment.model.js';
import Noti from '../models/noti.model.js';
import User from '../models/user.model.js';
import createNoti from '../utils/createNoti.js';
import pushNewNoti from '../utils/pushNewNoti.js';
import { userOnline } from '../index.js';
import ScheduleBlog from '../models/scheduleBlog.model.js';
import Category from '../models/category.model.js';

export const latestBlogs = async (req, res, next) => {
    try {
        const page = req.query.page;
        const startIndex = req.query.startIndex;
        const limit = req.query.limit;

        const [latestBlogs, totalBlogs] = await Promise.all([
            Blog.find({ 'isBlocked.status': false })
                .populate('authorId', '_id username email userAvatar')
                .sort({ createdAt: -1, title: 1 })
                .skip(startIndex ? startIndex : page != 1 ? (page - 1) * limit : 0)
                .limit(limit),
            Blog.countDocuments({ 'isBlocked.status': false }),
        ]);
        return res.status(200).json({ blogs: latestBlogs, total: totalBlogs });
    } catch (error) {
        next(error);
    }
};

export const allCategoryTrendingHightestRatedBlogs = async (req, res, next) => {
    try {
        const [trendingBlogs, topRatedBlogs, allCates] = await Promise.all([
            Blog.find({ 'isBlocked.status': false })
                .populate('authorId', '_id username email userAvatar')
                .sort({ viewed: -1, likeCount: -1 })
                .limit(5),
            Blog.aggregate([
                {
                    $match: { 'isBlocked.status': false },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'authorId',
                        foreignField: '_id',
                        as: 'authorId',
                    },
                },
                {
                    $unwind: '$authorId',
                },
                {
                    $project: {
                        title: 1,
                        thumb: 1,
                        slug: 1,
                        createdAt: 1,
                        averageRating: {
                            $cond: {
                                if: { $eq: [{ $size: '$rating' }, 0] },
                                then: 0,
                                else: {
                                    $divide: [{ $sum: '$rating.star' }, { $size: '$rating' }],
                                },
                            },
                        },
                        'authorId._id': 1,
                        'authorId.username': 1,
                        'authorId.email': 1,
                        'authorId.userAvatar': 1,
                    },
                },
                { $sort: { averageRating: -1 } },
                { $limit: 5 },
            ]),
            Category.find(),
        ]);
        return res.status(200).json({ trendingBlogs, topRatedBlogs, allCates });
    } catch (error) {
        next(error);
    }
};

export const categoryBlogs = async (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        const [totalBlogs, categoryBlogs] = await Promise.all([
            Blog.countDocuments({
                category: req.params.cate,
                'isBlocked.status': false,
            }),
            Blog.find({
                category: req.params.cate,
                'isBlocked.status': false,
            })
                .populate('authorId', '_id username email userAvatar')
                .sort({ createdAt: -1, title: 1 })
                .skip(page != 1 ? (page - 1) * limit : 0)
                .limit(limit),
        ]);
        return res.status(200).json({ blogs: categoryBlogs, total: totalBlogs });
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
        const [title, scheduleTitle] = await Promise.all([
            Blog.findOne({ title: req.body.title }),
            ScheduleBlog.findOne({ title: req.body.title }),
        ]);
        if (title || scheduleTitle) {
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
            const author = await User.findById(userId).select('-password');
            author.subscribeUsers.forEach((user) => {
                createNoti(
                    'new blog',
                    user,
                    author._id,
                    `Author ${author.username} just posted a new blog with the title: ${savedBlog.title}`,
                    { slug: savedBlog.slug, blogId: savedBlog._id }, // Thêm blogId
                );
                pushNewNoti(
                    userOnline.get(user.toString()),
                    savedBlog.thumb,
                    savedBlog.title,
                    '',
                    '',
                    `Author ${author.username} just posted a new blog with the title: ${savedBlog.title}`,
                    'new blog',
                );
            });

            res.status(200).json(savedBlog);
        } catch (error) {
            next(error);
        }
    } else {
        const [title, scheduleTitle] = await Promise.all([
            Blog.find({ title: req.body.title }),
            ScheduleBlog.findOne({ title: req.body.title }),
        ]);
        if (title.length > 1 || scheduleTitle) {
            return next(errorHandler(400, 'Title already exists, please give another title'));
        }
        const newSlug = req.body.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        let { slug, isUpdated, ...rest } = req.body;
        try {
            const updatedBlog = await Blog.findOneAndUpdate(
                { slug: req.body.slug },
                { ...rest, slug: newSlug, isUpdated: true },
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
    const userId = req.params.userId;
    try {
        const blog = await Blog.findOneAndUpdate({ slug }, { $inc: { viewed: 1 } }, { new: true }).populate(
            'authorId',
            '_id username email userAvatar userDesc subscribeUsers',
        );
        if (!blog) {
            return next(errorHandler(404, 'Blog not found'));
        }

        const similarAuthorBlogs = await Blog.find({
            authorId: blog.authorId._id,
            _id: { $ne: blog._id },
            'isBlocked.status': false,
        }).limit(5);

        if (userId != 'undefined') {
            const user = await User.findById(userId);
            const hasViewed = user.viewedBlogsHistory.some(
                (viewedBlog) => viewedBlog.blog.toString() === blog._id.toString(),
            );

            if (hasViewed) {
                await User.updateOne(
                    { _id: userId, 'viewedBlogsHistory.blog': blog._id },
                    { $set: { 'viewedBlogsHistory.$.viewedAt': new Date() } },
                );
            } else {
                await User.findByIdAndUpdate(
                    userId,
                    { $push: { viewedBlogsHistory: { blog: blog._id, viewedAt: new Date() } } },
                    { new: true, upsert: true },
                );
            }

            let subscribed = blog.authorId.subscribeUsers.some(
                (subscribedUser) => subscribedUser.toString() === userId.toString(),
            );
            return res.status(200).json({ blog, similarAuthorBlogs, isSubscribed: subscribed });
        }
        return res.status(200).json({ blog, similarAuthorBlogs });
    } catch (error) {
        next(error);
    }
};

export const updateLikeBlog = async (req, res, next) => {
    let userId = req.params.userId;
    let blogId = req.body._id;
    try {
        let [blog, user] = await Promise.all([
            Blog.findById(blogId).populate('authorId', '_id username email userAvatar userDesc'),
            User.findById(userId).select('username'),
        ]);
        let index = blog.likes.indexOf(userId);
        if (index > -1) {
            blog.likes.splice(index, 1);
        } else {
            blog.likes.push(userId);
            if (blog.authorId._id != userId) {
                createNoti('like', blog.authorId._id, userId, `User ${user.username} like your blog`, {
                    slug: blog.slug,
                    blogId: blog._id, // Thêm blogId
                });
                pushNewNoti(
                    userOnline.get(blog.authorId._id.toString()),
                    blog.thumb,
                    blog.title,
                    '',
                    '',
                    `User ${user.username} like your blog`,
                    'like',
                );
            }
        }
        blog = await blog.save();
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
        const [blog, user] = await Promise.all([
            Blog.findByIdAndUpdate(
                blogId,
                {
                    $push: { rating: { userId, star: ratingStar } },
                },
                { new: true },
            ).populate('authorId', '_id username email userAvatar'),
            User.findOne({ _id: userId }).select('_id username'),
        ]);
        if (blog.authorId._id != userId) {
            createNoti(
                'rate',
                blog.authorId._id,
                user._id,
                `User ${user.username} rating ${ratingStar} stars for your blog: ${blog.title}`,
                { slug: blog.slug, blogId: blog._id }, // Thêm blogId và slug
            );
            pushNewNoti(
                userOnline.get(blog.authorId._id.toString()),
                blog.thumb,
                blog.title,
                '',
                '',
                `User ${user.username} rating ${ratingStar} stars for your blog: ${blog.title}`,
                'rate',
            );
        }

        if (!blog) {
            return next(errorHandler(404, 'Blog not found'));
        }
        return res.status(200).json({ blog });
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
        return res.status(200).json({ blog });
    } catch (error) {
        next(errorHandler(400, 'Blog not found'));
    }
};

export const deleteBlog = async (req, res, next) => {
    const blogId = req.params.blogId;
    const userId = req.user._id;
    if (req.user._id != userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }

    try {
        if (!req.user.isAdmin) {
            const blog = await Blog.findById(blogId, 'authorId').exec();
            if (!blog) {
                return next(errorHandler(400, 'Blog not found'));
            }
            if (blog.authorId.toString() !== userId.toString()) {
                return next(errorHandler(400, 'You are not allowed to delete this blog'));
            }
        }

        await Promise.all([
            Blog.deleteOne({ _id: blogId }),
            Comment.deleteMany({ blogId }),
            Noti.deleteMany({ blogId }),
        ]);

        return res.status(200).json('The blog has been deleted');
    } catch (error) {
        next(error);
    }
};

export const manageBlogs = async (req, res, next) => {
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

        const [blogs, totalBlogs] = await Promise.all([
            Blog.find(filters)
                .populate('authorId', '_id username email userAvatar')
                .sort({ createdAt: sort, title: 1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Blog.countDocuments(filters).exec(),
        ]);

        return res.status(200).json({ blogs, total: totalBlogs });
    } catch (error) {
        next(error);
    }
};

export const blockBlog = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id.toString() !== userId.toString()) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const blogId = req.body.blogId;
    try {
        const blog = await Blog.findById(blogId, 'authorId isBlocked').exec();
        if (!blog) {
            return next(errorHandler(400, 'Blog not found'));
        }
        if (blog.isBlocked.status == false) {
            if (!req.user.isAdmin && blog.authorId.toString() !== userId) {
                return next(errorHandler(403, 'You are not allowed to block this blog'));
            }
            let role = req.user.isAdmin && blog.authorId.toString() !== userId.toString() ? 'admin' : 'user';
            await Blog.findByIdAndUpdate(blogId, {
                $set: { 'isBlocked.status': true, 'isBlocked.blockedBy': role },
            });
            return res.status(200).json({ message: `Blog has been blocked by ${role}` });
        } else {
            // Nếu bài viết đã bị khóa thì kiểm tra xem ai đã khóa và xem có quyền mở khóa không
            if (blog.isBlocked.blockedBy === 'admin' && !req.user.isAdmin) {
                return next(errorHandler(400, 'Only an admin can unblock this blog'));
            } else if (
                blog.isBlocked.blockedBy === 'user' &&
                blog.authorId.toString() !== userId.toString() &&
                !req.user.isAdmin
            ) {
                return next(errorHandler(403, 'Only the author or an admin can unblock this blog'));
            } else {
                await Blog.findByIdAndUpdate(blogId, {
                    $set: { 'isBlocked.status': false, 'isBlocked.blockedBy': null },
                });
                return res.status(200).json({ message: 'Blog has been unblocked successfully' });
            }
        }
    } catch (error) {
        next(error);
    }
};

export const adminBlogManagement = async (req, res, next) => {
    try {
        const page = req.query.page;
        const startIndex = req.query.startIndex;
        const limit = req.query.limit;

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const [latestBlogs, lastMonthBlogs, totalBlogs] = await Promise.all([
            Blog.find()
                .populate('authorId', '_id username email userAvatar')
                .sort({ createdAt: -1, title: 1 })
                .skip(startIndex ? startIndex : page != 1 ? (page - 1) * limit : 0)
                .limit(limit),
            Blog.countDocuments({ createdAt: { $gte: oneMonthAgo } }).exec(),
            Blog.countDocuments(),
        ]);
        return res.status(200).json({ blogs: latestBlogs, lastMonthBlogs, total: totalBlogs });
    } catch (error) {
        next(error);
    }
};
