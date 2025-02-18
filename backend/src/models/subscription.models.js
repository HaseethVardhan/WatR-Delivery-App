import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
},{
    timestamps: true
})

export const Subscription = mongoose.model('Subscription', subscriptionSchema)