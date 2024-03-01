import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        authorId: {
            type: String,
            require: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: [],
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        thumb: {
            type: String,
            default: 'https://expeditionmeister.com/oc-content/plugins/blog/img/blog/blog-default.png',
        },
        category: {
            type: String,
            default: 'uncategorized',
        },
        liked: {
            type: Number,
            default: 0,
        },
        viewed: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true },
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
