import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const notiSchema = new mongoose.Schema(
    {
        blogId: {
            type: Schema.Types.ObjectId,
            ref: 'Blog',
        },
        recipient: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ['system', 'like', 'comment', 'reply'], // Chỉ 1 trong các kiểu này mới được lưu vào db
            required: true,
            default: 'system',
        },
        commentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
        repliedOnComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    },
    { timestamps: true },
);

const Noti = mongoose.model('Noti', notiSchema);

export default Noti;
