const { default: mongoose } = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        shortUrl: {
            type: String,
            required: true,
            unique: true,
        },
        redirectUrl: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        visHistory: [
            {timestamps: {type : Number}}
        ]
    },
    {
        timestamps:  true,
    }
);

const URL = mongoose.model("urls", urlSchema);

module.exports = {
    URL,
}







































































































