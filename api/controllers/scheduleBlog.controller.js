import ScheduleBlog from '../models/scheduleBlog.model.js';
import Blog from '../models/blog.model.js';

export const addToSchedule = async (req, res, next) => {
    const userId = req.params.userId;
    const postingTime = req.body.postingTime;

    if (!req.body.blog.title.length) {
        return next(errorHandler(400, 'Please provide a blog title to publish'));
    }
    if (!req.body.blog.description.length || req.body.blog.description.length > 200) {
        return next(errorHandler(400, 'Please provide a blog description under 200 characters'));
    }
    if (!req.body.blog.content.blocks.length) {
        return next(errorHandler(400, 'Please provide a blog content to publish'));
    }
    if (!req.body.blog.tags.length || req.body.blog.tags.length > 10) {
        return next(errorHandler(400, 'Please provide tags to publish blog, maximum 10 tags'));
    }
    req.body.blog.tags = req.body.blog.tags.map((tag) => tag.toLowerCase());

    if (!req.body.blog.slug) {
        const [title, scheduleTitle] = await Promise.all([
            Blog.findOne({ title: req.body.blog.title }),
            ScheduleBlog.findOne({ title: req.body.blog.title }),
        ]);
        if (title || scheduleTitle) {
            return next(errorHandler(400, 'Title already exists, please give another title'));
        }
        const slug = req.body.blog.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        const newScheduleBlog = new ScheduleBlog({
            ...req.body.blog,
            slug,
            authorId: userId,
            postingTime,
        });

        try {
            const savedScheduleBlog = await newScheduleBlog.save();
            // const author = await User.findById(userId).select('-password');
            // author.subscribeUsers.forEach((user) => {
            //     createNoti(
            //         'new blog',
            //         user,
            //         author._id,
            //         `Author ${author.username} just posted a new blog with the title: ${savedScheduleBlog.title}`,
            //         { slug: savedScheduleBlog.slug },
            //     );
            //     pushNewNoti(
            //         userOnline.get(user.toString()),
            //         savedScheduleBlog.thumb,
            //         savedScheduleBlog.title,
            //         '',
            //         '',
            //         `Author ${author.username} just posted a new blog with the title: ${savedScheduleBlog.title}`,
            //     );
            // });

            return res.status(200).json(savedScheduleBlog);
        } catch (error) {
            next(error);
        }
    } else {
        const [title, scheduleTitle] = await Promise.all([
            Blog.findOne({ title: req.body.blog.title }),
            ScheduleBlog.findOne({ title: req.body.blog.title }),
        ]);
        if (title || scheduleTitle) {
            return next(errorHandler(400, 'Title already exists, please give another title'));
        }
        const newSlug = req.body.blog.title
            .split(' ')
            .join('-'.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-'))
            .trim();
        let { slug, ...rest } = req.body.blog;
        try {
            const updatedBlog = await ScheduleBlog.findOneAndUpdate(
                { slug: req.body.blog.slug },
                { ...rest, slug: newSlug },
                {
                    new: true,
                },
            );
            return res.status(200).json(updatedBlog);
        } catch (error) {
            next(error);
        }
    }
};
