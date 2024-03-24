import { sendEmailServices } from '../services/emailService.js';
import { errorHandler } from '../utils/error.js';

export const sendEmail = async (req, res, next) => {
    try {
        const { recipientEmail } = req.body;
        if (recipientEmail) {
            const response = await sendEmailServices(recipientEmail);
            return res.json(response);
        }
        return next(errorHandler(400, 'The email is required'));
    } catch (error) {
        next(error);
    }
};
