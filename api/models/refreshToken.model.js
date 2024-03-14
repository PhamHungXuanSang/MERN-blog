import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;