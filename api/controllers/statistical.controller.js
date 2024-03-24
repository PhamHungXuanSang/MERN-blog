import Package from '../models/package.model.js';
import Transaction from '../models/transaction.model.js';

export const getStatistical = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(400, 'You are not allowed to add new package'));
    }

    try {
        // Lấy danh sách tất cả các gói
        const packages = await Package.find();

        // Lấy được tổng số lượt sử dụng của mỗi gói
        const currentDate = new Date();
        let userCounts = await Transaction.aggregate([{ $group: { _id: '$packageId', count: { $sum: 1 } } }]);
        console.log(userCounts);
        userCountForEachPackage = packages.map((package) => {
            let countData = userCounts.find((c) => c._id.equals(package._id)) || { count: 0 };
            return { packageName: package.packageName, count: countData.count };
        });
        console.log(userCountForEachPackage);

        // Lấy số người đăng ký mới của mỗi gói trong tháng hiện tại
    } catch (error) {
        next(error);
    }
};
