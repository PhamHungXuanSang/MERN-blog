import mongoose from 'mongoose';
import { errorHandler } from '../utils/error.js';
import Comment from '../models/comment.model.js';
import Blog from '../models/blog.model.js';
import Noti from '../models/noti.model.js';
import { userOnline } from '../index.js';
import pushNewNoti from '../utils/pushNewNoti.js';

export const addComment = async (req, res, next) => {
    try {
        let { _id, comment, blogAuthor, userId: commentedBy, username: commentedByUserName, replyingTo } = req.body;
        if (commentedBy != req.user._id) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        if (!comment.length) {
            return next(errorHandler(400, 'Please enter comment'));
        }

        let newComment = {
            blogId: _id,
            blogAuthor,
            content: comment,
            isReply: false,
            commentedBy,
        };
        if (replyingTo) {
            newComment.parent = replyingTo;
            newComment.isReply = true;
        }
        newComment = await new Comment(newComment).save();

        let blog = await Blog.findOneAndUpdate({ _id }, { $push: { comments: newComment._id } });

        let parentComment;
        let newNotification = { blogId: blog._id, commentId: newComment._id };
        if (replyingTo) {
            parentComment = await Comment.findOne({ _id: replyingTo });
            newNotification.repliedOnComment = replyingTo;
            Comment.findOneAndUpdate({ _id: replyingTo }, { $push: { children: newComment._id } })
                .then((parentComment) => {
                    newNotification.recipient = parentComment.commentedBy;
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        function createNoti(type, recipient, sender, message) {
            newNotification = {
                ...newNotification,
                type,
                recipient,
                sender,
                message,
            };
            new Noti(newNotification)
                .save()
                .then(() => {})
                .catch((error) => {
                    console.log(error);
                });
        }

        // function pushNewNoti(socketId, message) {
        //     io.to(socketId).emit('newNotification', {
        //         thumb: blog.thumb,
        //         title: blog.title,
        //         message,
        //     });
        // }

        if (commentedBy == blogAuthor) {
            // Tác giả bình luận hoặc phản hồi.
            if (replyingTo && parentComment && parentComment.commentedBy != blogAuthor) {
                createNoti(
                    'reply',
                    parentComment.commentedBy,
                    blogAuthor,
                    `The author has responded your comment: ${comment}`,
                );
                pushNewNoti(
                    userOnline.get(parentComment.commentedBy.toString()),
                    blog.thumb,
                    blog.title,
                    '',
                    '',
                    `The author has responded your comment: ${comment}`,
                    'reply',
                );
            }
        } else {
            // Người dùng bình luận hoặc phản hồi.
            if (!replyingTo) {
                createNoti(
                    'comment',
                    blogAuthor,
                    commentedBy,
                    `User ${commentedByUserName} comment in your post: ${comment}`,
                );
                pushNewNoti(
                    userOnline.get(blogAuthor.toString()),
                    blog.thumb,
                    blog.title,
                    '',
                    '',
                    `User ${commentedByUserName} comment in your post: ${comment}`,
                    'comment',
                );
            } else if (replyingTo && parentComment) {
                if (parentComment.commentedBy == blogAuthor) {
                    createNoti(
                        'reply',
                        blogAuthor,
                        commentedBy,
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                    );
                    pushNewNoti(
                        userOnline.get(blogAuthor.toString()),
                        blog.thumb,
                        blog.title,
                        '',
                        '',
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                        'reply',
                    );
                } else if (parentComment.commentedBy == commentedBy) {
                } else {
                    createNoti(
                        'reply',
                        parentComment.commentedBy,
                        commentedBy,
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                    );
                    pushNewNoti(
                        userOnline.get(parentComment.commentedBy.toString()),
                        blog.thumb,
                        blog.title,
                        '',
                        '',
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                        'reply',
                    );
                }
            }
        }
        return res.status(200).json({ ...newComment });
    } catch (error) {
        next(error);
    }
};

export const getBlogComment = async (req, res, next) => {
    let { blogId, skip } = req.body;
    try {
        const comment = await Comment.find({ blogId, isReply: false })
            .populate('commentedBy', 'username userAvatar')
            .skip(skip)
            .sort({ updatedAt: -1 });
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

export const getBlogReplies = async (req, res, next) => {
    let { _id, skip } = req.body;
    let maxLimit = 5;

    try {
        const doc = await Comment.findOne({ _id })
            .populate({
                path: 'children',
                options: {
                    limit: maxLimit,
                    skip: skip,
                    sort: { updatedAt: -1 },
                },
                populate: {
                    path: 'commentedBy',
                    select: 'username userAvatar',
                },
                select: '-blogId',
            })
            .select('children');
        return res.status(200).json({ replies: doc.children });
    } catch (error) {
        next(error);
    }
};

const deleteCommentAndNoti = (_id) => {
    Comment.findOneAndDelete({ _id })
        .then((comment) => {
            // Nếu cmt này là children (reply) của một cmt khác
            if (comment.parent) {
                Comment.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: _id } })
                    .then((cmt) => {})
                    .catch((error) => console.log(error));
            }
            Noti.findOneAndDelete({ commentId: _id }) // Xóa cái thông báo về cmt
                .then((noti) => {})
                .catch((error) => console.log(error));

            Blog.findOneAndUpdate({ _id: comment.blogId }, { $pull: { comments: comment._id } }, { new: true }) // Xóa cái id của cmt lưu trong blog.comments
                .then((blog) => {
                    // Nếu cmt đang xóa có reply thì lặp qua xóa luôn các reply
                    if (comment.children.length) {
                        comment.children.map((replies) => {
                            deleteCommentAndNoti(replies); // Gọi lại hàm deleteCommentAndNoti để thực hiện xóa các cmt là reply của cmt
                        });
                    }
                })
                .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
};

export const deleteComment = async (req, res, next) => {
    let userId = req.user._id;
    let { _id } = req.body;
    const comment = await Comment.findOne({ _id });
    if (req.user.isAdmin == true || userId == comment.blogAuthor || userId == comment.commentedBy) {
        deleteCommentAndNoti(_id);
        return res.status(200).json({ status: 'OK' });
    } else {
        return next(errorHandler(403, "You can't delete this comment"));
    }
};

export const getAllComment = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const [comments, lastMonthComments, totalComments] = await Promise.all([
            Comment.find()
                .sort({ createdAt: sortDirection })
                .skip(startIndex)
                .limit(limit)
                .populate('commentedBy', 'username userAvatar'),
            Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } }).exec(),
            Comment.countDocuments(),
        ]);

        return res.status(200).json({ comments, lastMonthComments, totalComments });
    } catch (error) {
        next(error);
    }
};
