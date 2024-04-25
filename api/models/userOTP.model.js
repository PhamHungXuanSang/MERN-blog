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
            default: () => new Date(+new Date() + 5 * 60 * 1000),
            index: { expires: '5m' },
        },
    },
    { timestamps: true },
);

const UserOTP = mongoose.model('UserOTP', UserOTPSchema);

export default UserOTP;
