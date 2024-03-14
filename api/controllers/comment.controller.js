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
        //return res.status(200).json({ comment, commentedAt, _id: newComment._id, userId: commentedBy, children });
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
