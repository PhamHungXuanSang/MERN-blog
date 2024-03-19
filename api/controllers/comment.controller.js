import mongoose from 'mongoose';
import { errorHandler } from '../utils/error.js';
import Comment from '../models/comment.model.js';
import Blog from '../models/blog.model.js';
import Noti from '../models/noti.model.js';
import { getUser, io, userOnline } from '../index.js';

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
            likes: [],
            numberOfLikes: 0,
            commentedBy,
        };
        if (replyingTo) {
            newComment.parent = replyingTo;
            newComment.isReply = true;
        }
        newComment = await new Comment(newComment).save();

        let blog = await Blog.findOneAndUpdate({ _id }, { $push: { comments: newComment._id } });

        // if (!replyingTo && commentedBy == blogAuthor) {
        //     console.log('Tác giả cmt vào bài viết của tác giả => Không tạo thông báo');
        // } else if (!replyingTo && commentedBy != blogAuthor) {
        //     console.log('Nguời dùng cmt vào bài viết => Thông báo cho tác giả');
        // } else if (replyingTo && commentedBy != blogAuthor) {
        //     const parentComment = await Comment.findOne({ _id: replyingTo });
        //     if (parentComment.commentedBy == blogAuthor) {
        //         console.log('Người dùng reply cmt của tác giả => Thông báo đến tác giả');
        //     } else if (parentComment.commentedBy == commentedBy) {
        //         console.log('Người dùng reply cmt của chính mình => Thông báo đến tác giả');
        //     } else {
        //         console.log('Người dùng reply cmt của người dùng khác => Thông báo đến người dùng và tác giả');
        //     }
        // } else if (replyingTo && commentedBy == blogAuthor) {
        //     const parentComment = await Comment.findOne({ _id: replyingTo });
        //     if (parentComment.commentedBy == blogAuthor) {
        //         console.log('Tác giả reply cmt của tác giả => Không tạo thông báo');
        //     } else {
        //         console.log('Tác giả reply cmt của người dùng => Tạo thông báo đến người dùng');
        //     }
        // }

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

            // if (type == 'reply') {
            //     newNotification.repliedOnComment = replyingTo;
            //     Comment.findOneAndUpdate({ _id: replyingTo }, { $push: { children: newComment._id } })
            //         .then((parentComment) => {
            //             newNotification.recipient = parentComment.commentedBy;
            //         })
            //         .catch((error) => {
            //             console.log(error);
            //         });
            // }
            new Noti(newNotification)
                .save()
                .then(() => {})
                .catch((error) => {
                    console.log(error);
                });
        }

        function pushNewNoti(socketId, message) {
            io.to(socketId).emit('newNotification', {
                thumb: blog.thumb,
                title: blog.title,
                message,
            });
        }

        if (commentedBy == blogAuthor) {
            // Tác giả bình luận hoặc phản hồi.
            if (!replyingTo) {
                console.log('Tác giả cmt vào bài viết của tác giả => Không tạo thông báo'); //
            } else if (replyingTo && parentComment && parentComment.commentedBy != blogAuthor) {
                console.log('Tác giả reply cmt của người dùng => Tạo thông báo đến người dùng'); //
                createNoti(
                    'reply',
                    parentComment.commentedBy,
                    blogAuthor,
                    `The author has responded your comment: ${comment}`,
                );
                pushNewNoti(
                    userOnline.get(parentComment.commentedBy.toString()),
                    `The author has responded your comment: ${comment}`,
                );
            } else {
                console.log('Tác giả reply cmt của tác giả => Không tạo thông báo'); //
            }
        } else {
            // Người dùng bình luận hoặc phản hồi.
            if (!replyingTo) {
                console.log('Người dùng cmt vào bài viết => Thông báo đến tác giả'); //
                createNoti(
                    'comment',
                    blogAuthor,
                    commentedBy,
                    `User ${commentedByUserName} comment in your post: ${comment}`,
                );
                pushNewNoti(
                    userOnline.get(blogAuthor.toString()),
                    `User ${commentedByUserName} comment in your post: ${comment}`,
                );
            } else if (replyingTo && parentComment) {
                if (parentComment.commentedBy == blogAuthor) {
                    console.log('Người dùng reply cmt của tác giả => Thông báo đến tác giả'); //
                    createNoti(
                        'reply',
                        blogAuthor,
                        commentedBy,
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                    );
                    pushNewNoti(
                        userOnline.get(blogAuthor.toString()),
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                    );
                } else if (parentComment.commentedBy == commentedBy) {
                    console.log('Người dùng reply cmt của chính mình => Không tạo thông báo'); //
                } else {
                    console.log('Người dùng reply cmt của người dùng khác => Thông báo đến người dùng đó'); //
                    createNoti(
                        'reply',
                        parentComment.commentedBy,
                        commentedBy,
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
                    );
                    pushNewNoti(
                        userOnline.get(parentComment.commentedBy.toString()),
                        `User ${commentedByUserName} reply to your comment: ${comment}`,
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
