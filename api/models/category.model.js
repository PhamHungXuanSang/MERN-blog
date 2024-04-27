import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
});
const Category = mongoose.model('Category', categorySchema);

export default Category;
