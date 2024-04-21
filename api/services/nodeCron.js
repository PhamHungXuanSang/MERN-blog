import cron from 'node-cron';
import ScheduleBlog from '../models/scheduleBlog.model.js';
import Blog from '../models/blog.model.js';

async function publishBlogs() {
    try {
        const date = new Date();
        const duePublishBlogs = await ScheduleBlog.find({ postingTime: { $lte: date } }).lean();
        const idsToRemove = duePublishBlogs.map((blog) => blog._id);
        const newBlogs = duePublishBlogs.map((blog) => {
            delete blog.postingTime;
            delete blog._id;
            blog.createdAt = date;
            blog.updatedAt = date;
            return blog;
        });
        await ScheduleBlog.deleteMany({ _id: { $in: idsToRemove } });
        await Blog.insertMany(newBlogs);
    } catch (error) {
        console.log(error);
    }
}

// Job 1: Chạy vào đầu mỗi giờ
export const jobAtStartOfHour = cron.schedule('0 0 * * * *', publishBlogs);

// Job 2: Chạy vào mỗi 30 phút của giờ
export const jobAtHalfPastHour = cron.schedule('* 30 * * * *', publishBlogs, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
});

// '*/5 * * * * *'
