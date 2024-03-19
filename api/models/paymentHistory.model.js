import mongoose, { Schema } from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    packageName: {
        type: String,
        required: true,
        ref: 'Package',
    },
    packagePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
});

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

export default PaymentHistory;
