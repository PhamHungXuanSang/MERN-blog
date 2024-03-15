import mongoose from 'mongoose';
import { errorHandler } from '../utils/error.js';
import Comment from '../models/comment.model.js';
import Blog from '../models/blog.model.js';
import Noti from '../models/noti.model.js';

export const addComment = async (req, res, next) => {
    try {
        let { _id, comment, blogAuthor, userId: commentedBy, replyingTo } = req.body;

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
            likes: [],
            numberOfLikes: 0,
            commentedBy,
        };
        if (replyingTo) {
            newComment.parent = replyingTo;
            newComment.isReply = true;
        }
        newComment = await new Comment(newComment).save();
        let { comment: commentContent, updatedAt: commentedAt, children } = newComment;

        let blog = await Blog.findOneAndUpdate({ _id }, { $push: { comments: newComment._id } });

        // Nếu tác giả tự cmt vào bài viết của mình thì không tạo thông báo, nếu tác giả rep cmt của người khác thì thông báo cho người đó
        let newNotification = {
            type: replyingTo ? 'reply' : 'comment',
            blogId: _id,
            recipient: blogAuthor,
            sender: commentedBy,
            message: `User ${commentedBy} commented on the article ${blog.title}`,
        };
        if (replyingTo) {
            newNotification.repliedOnComment = replyingTo;
            const parentComment = await Comment.findOneAndUpdate(
                { _id: replyingTo },
                { $push: { children: newComment._id } },
            );
            newNotification.recipient = parentComment.commentedBy;
        }
        newNotification = await new Noti(newNotification).save();

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
            // Noti.findOneAndDelete({ _id }) // Xóa cái thông báo về cmt
            //     .then((noti) => console.log('comment or reply noti deleted: ' + noti))
            //     .catch((error) => console.log(error));

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
