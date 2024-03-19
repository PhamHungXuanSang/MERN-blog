import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        userAvatar: {
            type: String,
            default: 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg',
        },
        userDesc: {
            type: String,
            default: '',
            maxlength: 200,
        },
        youtubeLink: {
            type: String,
            default: '',
        },
        facebookLink: {
            type: String,
            default: '',
        },
        tiktokLink: {
            type: String,
            default: '',
        },
        githubLink: {
            type: String,
            default: '',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        transaction: {
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
        },
        createPermission: {
            // Query userId ở bảng Transaction để biết true / false
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
