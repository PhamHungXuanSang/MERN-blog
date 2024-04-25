import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const transactionSchema = new mongoose.Schema( // Dựa vô bảng này để biết còn hạn create hay không
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isTrialed: {
            type: Boolean,
            default: false,
        },
        createPermission: {
            type: Boolean,
            default: false,
        },
        packageId: {
            type: Schema.Types.ObjectId,
            ref: 'Package',
        },
        expirationDate: {
            type: Date,
        },
    },
    { timestamps: true },
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
