import mongoose, { Schema } from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
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
        likes: {
            type: [],
        },
        rating: {
            type: [
                {
                    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                    star: { type: Number, required: true, min: 1, max: 5 },
                },
            ],
        },
        comments: {
            type: Array,
            default: [],
        },
        viewed: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true },
);

blogSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

blogSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

blogSchema.set('toJSON', { virtuals: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
