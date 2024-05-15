import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        blogId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Blog',
        },
        blogAuthor: {
            // Tác giả bài viết
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        commentedBy: {
            // Tác giả comment
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        isReply: { type: Boolean, default: false }, // Comment này là reply hoặc không
        content: { type: String, required: true },
        parent: { type: Schema.Types.ObjectId, ref: 'Comment' }, // Comment cha của cmt này
        children: { type: [Schema.Types.ObjectId], ref: 'Comment' }, // Comment con của cmt này
    },
    { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
