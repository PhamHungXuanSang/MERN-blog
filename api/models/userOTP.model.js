import mongoose, { Schema } from 'mongoose';

const UserOTPSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        OTP: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

const UserOTP = mongoose.model('UserOTP', UserOTPSchema);

export default UserOTP;
