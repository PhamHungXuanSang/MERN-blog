import mongoose from 'mongoose';
import { errorHandler } from '../utils/error.js';
import Comment from '../models/comment.model.js';
import Blog from '../models/blog.model.js';
import Noti from '../models/noti.model.js';

export const addComment = async (req, res, next) => {
    try {
        let { _id, comment, blogAuthor, userId: commentedBy } = req.body;

        if (commentedBy != req.user._id) {
            return next(errorHandler(403, 'Unauthorized'));
        }

        if (!comment.length) {
            return next(errorHandler(400, 'Please enter comment'));
        }

        let newComment = new Comment({
            blogId: _id,
            blogAuthor,
            content: comment,
            isReply: false,
            likes: [],
            numberOfLikes: 0,
            commentedBy,
        });
        newComment = await newComment.save();
        let { comment: commentContent, updatedAt: commentedAt, children } = newComment;

        let blog = await Blog.findOneAndUpdate({ _id }, { $push: { comments: newComment._id } });

        let newNotification = new Noti({
            type: 'comment',
            blogId: _id,
            recipient: blogAuthor,
            sender: commentedBy,
            message: `User ${commentedBy} commented on the article ${blog.title}`,
        });
        newNotification = await newNotification.save();
        //return res.status(200).json({ comment, commentedAt, _id: newComment._id, userId: commentedBy, children });
        return res.status(200).json({ ...newComment });
    } catch (error) {
        next(error);
    }
};

export const getBlogComment = async (req, res, next) => {
    let { blogId, skip } = req.body;
    let maxLimit = 5;
    try {
        const comment = await Comment.find({ blogId, isReply: false })
            .populate('commentedBy', 'username userAvatar')
            .skip(skip)
            .limit(maxLimit)
            .sort({ updatedAt: -1 });
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};
