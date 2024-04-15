import UsersFolder from '../models/usersFolder.model.js';
import { errorHandler } from '../utils/error.js';

export const getUserFolder = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user._id !== userId) {
        return next(errorHandler(403, 'Unauthorized'));
    }
    try {
        const userFolders = await UsersFolder.findOne({ userId });
        let folderNameArr = userFolders.folders.map((folder) => folder.folderName);
        console.log(folderNameArr);
        return res.status(200).json({ folderNameArr, userFolders });
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
