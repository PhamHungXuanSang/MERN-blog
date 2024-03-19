import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true,
    },
    packagePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    packageDescription: {
        type: String,
        required: true,
    },
});

const Package = mongoose.model('Package', packageSchema);

export default Package;
