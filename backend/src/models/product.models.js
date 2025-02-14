import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productType: {
        type: String,
        enum: ['can', 'bottle', 'packet'],
        required: true
    },
    description:{
        type: String,
        required: true
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    minimumOrderQuantity: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
