import UsersFolder from '../models/usersFolder.model.js';
import Blog from '../models/blog.model.js';
import { errorHandler } from '../utils/error.js';

export const getUserFolder = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    try {
        const userFolders = await UsersFolder.findOne({ userId });
        let folderNameArr = userFolders.folders.map((folder) => folder.folderName);
        return res.status(200).json({ folderNameArr });
    } catch (error) {
        next(error);
    }
};

export const addNewFolder = async (req, res, next) => {
    const folderName = req.body.folderName;
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    try {
        const userFolder = await UsersFolder.findOne({ userId });
        // Nếu không tìm thấy userFolder, tức là chưa có folder nào, tạo mới
        if (!userFolder) {
            const newUserFolder = new UsersFolder({
                userId,
                folders: [{ folderName, blogIds: [] }], // Thêm folder mới với không có blog nào
            });

            const newFolder = await newUserFolder.save();
            return res.status(200).json({ folderName, newFolder });
        } else {
            // Kiểm tra xem folderName đã tồn tại hay chưa
            const folderExists = userFolder.folders.some((folder) => folder.folderName === folderName);

            if (folderExists) {
                // Nếu folder đã tồn tại, trả về thông báo lỗi
                return next(errorHandler(400, 'Folder name already exists.'));
            }

            // Nếu folder chưa tồn tại, thêm folder mới vào mảng folders
            userFolder.folders.push({ folderName, blogIds: [] });
            const newFolder = await userFolder.save();
            return res.status(200).json({ folderName, newFolder });
        }
    } catch (error) {
        next(error);
    }
};

export const saveBlogToFolder = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const { folderName, blogId } = req.body;
    try {
        const userFolder = await UsersFolder.findOne({ userId });
        if (!userFolder) {
            return next(errorHandler(404, 'User folder not found.'));
        }
        const folderIndex = userFolder.folders.findIndex((folder) => folder.folderName === folderName);
        if (folderIndex === -1) {
            return next(errorHandler(404, 'Folder not found.'));
        }
        if (userFolder.folders[folderIndex].blogIds.includes(blogId)) {
            return next(errorHandler(409, 'Blog already added to folder.'));
        }
        userFolder.folders[folderIndex].blogIds.push(blogId);
        await userFolder.save();
        return res.status(200).send({ message: 'Blog added to folder successfully.' });
    } catch (error) {
        next(error);
    }
};

export const getBlogsByFolder = async (req, res, next) => {
    const userId = req.params.userId;
    const folder = req.body.folder;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    try {
        const userFolders = await UsersFolder.findOne({ userId });
        let folderNameArr = userFolders.folders.map((folder) => folder.folderName);
        let blogsPromises = [];
        if (folder === 'all') {
            userFolders.folders.forEach((folder) => {
                folder.blogIds.forEach((blogId) => {
                    blogsPromises.push(Blog.findById(blogId).populate('authorId', 'username userAvatar'));
                });
            });
        } else {
            const specificFolder = userFolders.folders.find((fd) => fd.folderName === folder);
            if (!specificFolder) {
                return next(errorHandler(404, 'Folder not found.'));
            }
            specificFolder.blogIds.forEach((blogId) => {
                blogsPromises.push(Blog.findById(blogId).populate('authorId', 'username userAvatar'));
            });
        }
        const blogs = await Promise.all(blogsPromises);
        return res.status(200).json({ folderNameArr, blogs });
    } catch (error) {
        next(error);
    }
};

export const deleteBlogInFolder = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const blogId = req.body.blogId;
    const folderName = req.body.folderName;
    try {
        const userFolder = await UsersFolder.findOne({ userId: userId });
        let folder = userFolder.folders.find((f) => f.folderName === folderName);
        folder.blogIds = folder.blogIds.filter((id) => id.toString() !== blogId);
        const userFolders = await userFolder.save();
        let blogsPromises = [];
        if (folder.folderName === 'all') {
            userFolders.folders.forEach((folder) => {
                folder.blogIds.forEach((blogId) => {
                    blogsPromises.push(Blog.findById(blogId).populate('authorId', 'username userAvatar'));
                });
            });
        } else {
            const specificFolder = userFolders.folders.find((fd) => fd.folderName === folder.folderName);
            specificFolder.blogIds.forEach((blogId) => {
                blogsPromises.push(Blog.findById(blogId).populate('authorId', 'username userAvatar'));
            });
        }
        const blogs = await Promise.all(blogsPromises);
        return res.status(200).json({ blogs });
    } catch (error) {
        next(error);
    }
};

export const deleteFolder = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    const folderName = req.body.folderName;
    try {
        let userFolders = await UsersFolder.findOne({ userId });
        userFolders.folders = userFolders.folders.filter((folder) => folder.folderName != folderName);
        userFolders = await userFolders.save();
        let folderNameArr = userFolders.folders.map((folder) => folder.folderName);
        let blogsPromises = [];
        userFolders.folders.forEach((folder) => {
            folder.blogIds.forEach((blogId) => {
                blogsPromises.push(Blog.findById(blogId).populate('authorId', 'username userAvatar'));
            });
        });
        const blogs = await Promise.all(blogsPromises);
        return res.status(200).json({ folderNameArr, blogs });
    } catch (error) {
        next(error);
    }
};
