import Package from '../models/package.model.js';

export const addNewPackage = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to add new package'));
    }

    let { packageName, packagePrice, packageDescription, packageExpiry } = req.body;

    try {
        const exists = await Package.findOne({ packageName, packageExpiry });
        if (exists) {
            return res.status(400).json({ message: 'Package that existed before' });
        }
        const newPackage = new Package({
            packageName,
            packagePrice,
            packageDescription,
            packageExpiry,
        });
        const savedPackage = await newPackage.save();
        if (savedPackage) {
            const allPackages = await Package.find();
            console.log(allPackages);
            return res.status(200).json({ allPackages, message: 'New package has been saved' });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllPackages = async (req, res, next) => {
    try {
        const packages = await Package.find();
        return res.status(200).json({ packages });
    } catch (error) {
        next(error);
    }
};

export const blockPackage = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (req.user._id.toString() !== userId) {
            return next(errorHandler(403, 'Unauthorized'));
        }
        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to block package'));
        }

        const { packageId } = req.body;
        const pack = await Package.findById(packageId);

        if (!pack) {
            return next(errorHandler(404, 'Category not found'));
        }

        pack.isBlocked = !pack.isBlocked;

        await pack.save();
        const allPackages = await Package.find();
        return res
            .status(200)
            .json({ allPackages, message: `Package has been ${pack.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        next(error);
    }
};

export const getAllNotBlockedPackages = async (req, res, next) => {
    try {
        const packages = await Package.find({ isBlocked: false });
        return res.status(200).json({ packages });
    } catch (error) {
        next(error);
    }
};
