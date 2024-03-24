import Package from '../models/package.model.js';

export const addNewPackage = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(400, 'You are not allowed to add new package'));
    }
    
    let { packageName, packagePrice, packageDescription, packageExpiry } = req.body;
    
    try {
        const exists = await Package.findOne({ packageName, packageExpiry });
        if (exists) {
            return res.status(200).json('Package that existed before');
        }
        const newPackage = new Package({
            packageName,
            packagePrice,
            packageDescription,
            packageExpiry,
        });
        await newPackage.save();
        return res.status(200).json('New package has been saved');
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
