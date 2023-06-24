const mongoose = require("mongoose")

// user schema / model / table
const schema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    otp: {
        type: Number,
    },
    token: {
        type: String,
        trim: true
    },
    is_disable: {
        type: Boolean,
        default: false,
    },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const User = mongoose.model("user", schema)
module.exports = User 