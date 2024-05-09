import Blog from '../models/blog.model.js';
// import RefreshToken from '../models/refreshToken.model.js';
import User from '../models/user.model.js';
import createNoti from '../utils/createNoti.js';
import { io, userOnline } from '../index.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import pushNewNoti from '../utils/pushNewNoti.js';

export const getUserProfile = async (req, res, next) => {
    const username = req.params.username;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 2);
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
        return next(errorHandler(404, 'User not found'));
    }
    try {
        let blogs = await Blog.find({ authorId: user._id, 'isBlocked.status': false })
            .populate('authorId', '_id username email userAvatar createdAt')
            .sort({ createdAt: -1, title: 1 });

        let totalViews = 0;
        blogs.forEach((blog) => {
            totalViews += blog.viewed;
        });

        let allBlogs = blogs;

        blogs = blogs.slice(page != 1 ? (page - 1) * limit : 0, page != 1 ? (page - 1) * limit + limit : 0 + limit);

        return res.status(200).json({ user, blogs, allBlogs, totalViews }); // đoạn này có thể tối ưu
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
        return res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req, res, next) => {
    if (req.user._id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }

    try {
        // const refreshToken = req.cookies.refresh_token;
        // await RefreshToken.deleteOne({ refreshToken });
        await User.findByIdAndDelete(req.params.userId);
        res.clearCookie('access_token');
        // res.clearCookie('refresh_token');
        return res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const getAllUser = async (req, res, next) => {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 2);
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    try {
        const [users, totalUsers, lastMonthUsers] = await Promise.all([
            User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit).select('-password').exec(),
            User.countDocuments().exec(),
            User.countDocuments({ createdAt: { $gte: oneMonthAgo } }).exec(),
        ]);

        return res.status(200).json({ users, totalUsers, lastMonthUsers });
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(400, 'You are not allowed to update user role'));
    }
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const isBlocked = role === 'blocked-user';
        const isAdmin = role === 'admin';
        const usersLength = parseInt(req.query.usersLength); // trả về làm sao để đảm bảo phân trang
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { isBlocked, isAdmin } },
            { new: true },
        ).select('-password');
        if (!updatedUser) {
            throw new Error('User not found');
        }
        const socketId = userOnline.get(userId.toString());
        if (role == 'blocked-user') {
            createNoti('system', userId, null, `Your account has been set to ${role} role`);
            if (socketId) {
                io.to(socketId).emit('forcedLogout', 'Forced Logout');
                userOnline.delete(userId.toString());
            }
        } else {
            createNoti('system', userId, null, `Your account has been set to ${role} role`);
            if (socketId) pushNewNoti(socketId, '', '', '', '', `Your account has been set to ${role} role`, 'system');
        }

        const users = await User.find().sort({ createdAt: -1 }).limit(usersLength).select('-password').exec();
        return res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const email = req.params.email;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcryptjs.hashSync(newPassword, 10);
        const user = await User.findOneAndUpdate({ email }, { $set: { password: hashedPassword } }, { new: true });
        if (user.password) {
            return res.status(200).json('Password has been reset');
        } else {
            return next(errorHandler(400, 'Some thing went wrong'));
        }
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const email = req.params.email;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;

        // Retrieve the user from the database
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(400, 'User not found'));
        }

        // Check if the oldPassword is correct
        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return next(errorHandler(400, 'Old password is not correct'));
        }

        // Check if newPassword and confirmNewPassword match
        if (newPassword !== confirmNewPassword) {
            return next(errorHandler(400, 'New password and confirmation do not match'));
        }

        // Encrypt the new password and update the database
        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
        const updateResult = await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedNewPassword } },
            { new: true },
        );

        // Check if the password update was successful
        if (updateResult) {
            return res.status(200).json({ message: 'Password has been reset successfully' });
        } else {
            return next(errorHandler(400, 'Something went wrong during password reset'));
        }
    } catch (error) {
        next(error);
    }
};

export const toggleSubscribe = async (req, res, next) => {
    const authorId = req.params.authorId; // tác giả
    const userId = req.params.userId; // Người bấm đăng ký

    try {
        const user = await User.findOne({ _id: authorId });
        if (!user) {
            return res.status(404).json('User not found');
        }
        const subscriber = await User.findOne({ _id: userId }).select('username');
        const index = user.subscribeUsers.indexOf(userId);
        if (index > -1) {
            user.subscribeUsers.splice(index, 1);
            const isSaved = await user.save();
            if (isSaved) {
                createNoti('subscriber', authorId, userId, `User ${subscriber.username} just unsubscribed`, {
                    username: subscriber.username,
                });
                pushNewNoti(
                    userOnline.get(authorId.toString()),
                    '',
                    '',
                    user.userAvatar,
                    '',
                    `User ${subscriber.username} just unsubscribed`,
                    'subscriber',
                );
                return res.status(200).json('Unsubscribed');
            }
        } else {
            user.subscribeUsers.push(userId);
            const isSaved = await user.save();
            if (isSaved) {
                createNoti(
                    'subscriber',
                    authorId,
                    userId,
                    `User ${subscriber.username} just subscribed to receive notifications about your new blog`,
                    {
                        username: subscriber.username,
                    },
                );
                pushNewNoti(
                    userOnline.get(authorId.toString()),
                    '',
                    '',
                    user.userAvatar,
                    '',
                    `User ${subscriber.username} just subscribed`,
                    'subscriber',
                );
                return res.status(200).json('Subscribed');
            }
        }
    } catch (error) {
        next(error);
    }
};

export const getViewedBlogsHistory = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 4);

    try {
        const userWithBlogs = await User.findById(userId).populate('viewedBlogsHistory.blog').exec();
        if (!userWithBlogs) {
            return next(errorHandler(404, 'User not found'));
        }
        const filteredAndSortedViewedBlogs = userWithBlogs.viewedBlogsHistory
            .filter((bl) => bl.blog && bl.blog.isBlocked.status === false)
            .sort((a, b) => b.viewedAt - a.viewedAt);

        const slicedViewedBlogsHistory = filteredAndSortedViewedBlogs.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            viewedBlogsHistory: slicedViewedBlogsHistory,
            total: filteredAndSortedViewedBlogs.length,
        });
    } catch (error) {
        next(error);
    }
};

export const getTopAuthors = async (req, res, next) => {
    const limit = parseInt(req.body.limit, 10) || 3;
    //const startIndex = parseInt(req.body.startIndex, 10) || 0;
    try {
        // Bước 1: Lấy ra danh sách authors đã viết blog và không bị khóa
        let authorsWithBlogs = await Blog.aggregate([
            { $match: { 'isBlocked.status': false } },
            {
                $group: {
                    _id: '$authorId',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1, createdAt: 1 } },
            //{ $skip: startIndex },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'authorDetails',
                },
            },
            { $unwind: '$authorDetails' },
            {
                $project: {
                    _id: 0,
                    username: '$authorDetails.username',
                    email: '$authorDetails.email',
                    userAvatar: '$authorDetails.userAvatar',
                    userDesc: '$authorDetails.userDesc',
                    count: 1,
                },
            },
            { $limit: limit },
        ]);

        // Nếu số lượng tác giả đủ 'limit', trả về kết quả.
        if (authorsWithBlogs.length === limit) {
            return res.status(200).json({ topAuthors: authorsWithBlogs });
        }

        // Bước 2: Nếu số lượng không đủ, lấy thêm users dựa trên createdAt.
        const authorsNeeded = limit - authorsWithBlogs.length;
        const additionalAuthors = await User.find({
            _id: { $nin: authorsWithBlogs.map((a) => a.authorId) }, // Loại bỏ những người dùng đã có blog
        })
            .sort({ createdAt: 1 })
            .limit(authorsNeeded)
            .select('-password -__v');

        // Bước 3: Kết hợp hai danh sách lại với nhau.
        const topAuthors = [
            ...authorsWithBlogs,
            ...additionalAuthors.map((a) => ({
                username: a.username,
                email: a.email,
                userAvatar: a.userAvatar,
                userDesc: a.userDesc,
                count: 0,
            })),
        ];

        return res.status(200).json({ topAuthors });
    } catch (error) {
        next(error);
    }
};

export const getAllUserProfile = async (req, res, next) => {
    const startIndex = parseInt(req.body.startIndex, 10) || 0;
    const limit = parseInt(req.body.limit || 2);
    try {
        const users = await User.find().select('-password');
        if (users.length === 0) {
            return res.status(200).json({ paginationUsers: [], allUsers: 0 });
        }
        let paginationUsers = [];
        let allUsers = users.length;
        for (const user of users) {
            let blogs = await Blog.find({ authorId: user._id, 'isBlocked.status': false });
            let totalViews = blogs.reduce((sum, blog) => sum + blog.viewed, 0);
            let totalLike = 0;
            let allAverageRating = 0;
            let numberBlogsReviewed = 0;
            blogs.forEach((blog) => {
                totalLike += blog.likes.length;
                if (blog.averageRating > 0) {
                    numberBlogsReviewed++;
                    allAverageRating += blog.averageRating;
                }
            });
            allAverageRating = allAverageRating / numberBlogsReviewed;
            paginationUsers.push({ user, blogs, totalViews, totalLike, allAverageRating });
        }
        paginationUsers = paginationUsers.slice(startIndex, startIndex + limit);
        return res.status(200).json({ paginationUsers, allUsers });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscribeAuthors = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const authors = await User.find({ subscribeUsers: userId }).select('_id username userAvatar');
        return res.status(200).json({ authors });
    } catch (error) {
        next(error);
    }
};

export const getAllNotThisUser = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        next(error);
    }
};
