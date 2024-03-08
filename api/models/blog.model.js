import mongoose, { Schema } from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: 'User',
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
        likes: {
            type: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                },
            ],
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
        },
    },
    { timestamps: true },
);

blogSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
