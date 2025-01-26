const mongoose = require("mongoose");

const authSchema = new mongoose.Schema (
    {
        name: {
            type:String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            default: "NORMAL"
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const AUTH = mongoose.model("users", authSchema);

module.exports = {
    AUTH
}