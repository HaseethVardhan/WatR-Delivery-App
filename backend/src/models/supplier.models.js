import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const supplierSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    suppliername: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    subscriptions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription'
        }
    ],
    address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address'
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    socketid: {
        type: String
    }
},{
    timestamps: true
})

supplierSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

supplierSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

supplierSchema.methods.generateAuthToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: '7d'
        }
    )
}

export const Supplier = mongoose.model('Supplier', supplierSchema)