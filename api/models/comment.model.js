import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        blogId: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'Blog',
        },
        authorId: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User',
        },
        content: {
            type: String,
            require: true,
        },
        likes: {
            type: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
