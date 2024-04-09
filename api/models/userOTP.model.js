import mongoose, { Schema } from 'mongoose';

const UserOTPSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
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
