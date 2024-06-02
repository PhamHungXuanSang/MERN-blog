import cron from 'node-cron';
import ScheduleBlog from '../models/scheduleBlog.model.js';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js';
import createNoti from '../utils/createNoti.js';
import pushNewNoti from '../utils/pushNewNoti.js';
import { userOnline } from '../index.js';

async function publishBlogs() {
    try {
        const date = new Date();
        const duePublishBlogs = await ScheduleBlog.find({ postingTime: { $lte: date } }).lean();
        const idsToRemove = duePublishBlogs.map((blog) => blog._id);
        const newBlogs = duePublishBlogs.map((blog) => {
            delete blog.postingTime;
            return { ...blog, createdAt: date, updatedAt: date };
        });

        await ScheduleBlog.deleteMany({ _id: { $in: idsToRemove } });
        const insertedBlogs = await Blog.insertMany(newBlogs); // Lưu ý rằng insertedBlogs sẽ có _id mới do MongoDB cấp

        const authorIds = [...new Set(insertedBlogs.map((blog) => blog.authorId.toString()))];
        const authors = await User.find({ _id: { $in: authorIds } }).select('-password');
        const authorMap = new Map(authors.map((author) => [author._id.toString(), author]));

        const notificationPromises = insertedBlogs.map(async (blog) => {
            const author = authorMap.get(blog.authorId.toString());
            if (!author) return; // Nếu không tìm thấy author, bỏ qua

            for (const user of author.subscribeUsers) {
                try {
                    createNoti(
                        'new blog',
                        user,
                        author._id,
                        `Author ${author.username} just posted a new blog with the title: ${blog.title}`,
                        { slug: blog.slug, blogId: blog._id }, // Thêm blogId
                    );

                    if (userOnline.has(user.toString())) {
                        pushNewNoti(
                            userOnline.get(user.toString()),
                            blog.thumb,
                            blog.title,
                            '',
                            '',
                            `Author ${author.username} just posted a new blog with the title: ${blog.title}`,
                            'new blog',
                        );
                    }
                } catch (notifyError) {
                    console.log(notifyError);
                }
            }
        });

        await Promise.all(notificationPromises);
    } catch (error) {
        console.log(error);
    }
}

// // Job 1: Chạy vào đầu mỗi giờ
// export const jobAtStartOfHour = cron.schedule('0 0 * * * *', publishBlogs);

// Job 2: Chạy cứ mỗi 5 phút một lần
export const jobEveryFiveMinutes = cron.schedule('*/5 * * * *', publishBlogs, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
});
