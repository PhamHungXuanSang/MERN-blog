import Package from '../models/package.model.js';
import PaymentHistory from '../models/paymentHistory.model.js';

export const getStatistical = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(400, 'You are not allowed to get statistical'));
    }
    const now = new Date();
    let day = req.body.day || 1;
    let month = req.body.month || 1;
    let year = req.body.year || now.getFullYear();

    try {
        const packages = await Package.find();

        let userCounts = await PaymentHistory.aggregate([{ $group: { _id: '$packageId', count: { $sum: 1 } } }]);
        let userCountForEachPackage = packages.map((pack) => {
            let countData = userCounts.find((c) => c._id.equals(pack._id)) || { count: 0 };
            return { packageName: pack.packageName, count: countData.count };
        });
        // console.log('Tổng số lượt choose paln của mỗi gói: ');
        // console.log(userCountForEachPackage); // Lấy được tổng số lượt mua của mỗi gói (kể cả gói không có lượt mua nào)

        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const paymentHistoryThisMonth = await PaymentHistory.aggregate([
            {
                $match: {
                    paymentDate: {
                        $gte: firstDayOfCurrentMonth,
                        $lt: firstDayOfNextMonth,
                    },
                },
            },
            {
                $group: {
                    _id: '$packageId',
                    count: { $sum: 1 },
                },
            },
        ]);
        let userCountForEachPackageInThisMonth = packages.map((pack) => {
            let countData = paymentHistoryThisMonth.find((c) => c._id.equals(pack._id)) || { count: 0 };

            return { packageName: pack.packageName, count: countData.count };
        });
        // console.log('Tổng số lượt choose plan của mỗi gói trong tháng hiện tại: ');
        // console.log(userCountForEachPackageInThisMonth); // Lấy số người đăng ký mới/gia hạn gói của mỗi gói trong tháng hiện tại

        let startDate;
        startDate = new Date(year, month - 1, day); // Nếu không nhập day, month, year thì lấy doanh thu toàn bộ thời gian
        var matchCondition = {};
        if (startDate) {
            matchCondition = {
                paymentDate: {
                    $gte: startDate,
                    $lt: now,
                },
            };
        }
        const revenueByPackage = await PaymentHistory.aggregate([
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: {
                        monthYear: { $dateToString: { format: '%m-%Y', date: '$paymentDate' } },
                        packageName: '$packageName',
                    },
                    totalRevenue: { $sum: '$packagePrice' },
                    originalDate: { $first: '$paymentDate' },
                },
            },
            {
                $group: {
                    _id: { monthYear: '$_id.monthYear' },
                    package: {
                        $push: { packageName: '$_id.packageName', totalRevenue: '$totalRevenue' },
                    },
                    originalDate: { $first: '$originalDate' },
                },
            },
            {
                $sort: { originalDate: 1 },
            },
        ]);
        // console.log('Doanh thu của mỗi gói theo khoảng thời gian/ tất cả thời gian: ');
        // console.log(revenueByPackage); // Doanh thu của mỗi gói theo thời gian từ startDate đến hiện tại / doanh thu của mỗi gói trong toàn bộ thời gian

        const revenue = await PaymentHistory.aggregate([
            { $match: matchCondition },
            {
                $project: {
                    packageName: 1,
                    monthYear: { $dateToString: { format: '%m-%Y', date: '$paymentDate' } },
                    paymentDate: 1,
                    packagePrice: 1,
                },
            },
            {
                $group: {
                    _id: { monthYear: '$monthYear' },
                    originalDate: { $first: '$paymentDate' },
                    revenue: { $sum: '$packagePrice' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { originalDate: 1, '_id.packageName': 1 } },
        ]);
        // console.log('Doanh thu trong khoảng thời gian/ tất cả thời gian: ');
        // console.log(revenue);
        return res
            .status(200)
            .json({ userCountForEachPackage, userCountForEachPackageInThisMonth, revenueByPackage, revenue, packages });
    } catch (error) {
        next(error);
    }
};
