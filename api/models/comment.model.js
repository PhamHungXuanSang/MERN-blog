import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        blogId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Blog',
        },
        blogAuthor: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Blog',
        },
        commentedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        isReply: { type: Boolean, default: false },
        content: { type: String, required: true },
        parent: { type: Schema.Types.ObjectId, ref: 'Comment' },
        children: { type: [Schema.Types.ObjectId], ref: 'Comment' },
        likes: {
            type: Array,
            default: [],
        },
        numberOfLikes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
