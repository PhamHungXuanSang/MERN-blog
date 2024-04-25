import mongoose, { Schema } from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    packageId: {
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    packageExpiry: {
        type: Number,
        min: 1,
        required: true,
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
    transactionType: {
        type: String,
        enum: ['package renewal', 'buy package'],
        required: true,
    },
});

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

export default PaymentHistory;
