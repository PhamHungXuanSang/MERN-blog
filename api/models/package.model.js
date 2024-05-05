import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true,
        unique: true,
    },
    packagePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    packageDescription: {
        type: Array,
        required: true,
    },
    packageExpiry: {
        type: Number,
        min: 1,
        required: true,
        unique: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const Package = mongoose.model('Package', packageSchema);

export default Package;
