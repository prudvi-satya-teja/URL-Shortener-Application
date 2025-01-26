const express = require("express");
const router = express.Router();
const { URL } = require("../models/url");
const { AUTH } = require("../models/user");


router.get("/urls", async (req, res) => {

    try {
        const users = await URL.find({});
        const allUser = await Promise.all(users.map(async user => {
            const userDetails = await AUTH.findById(user.userId);
            return {...user.toObject(), userDetails};
        }))
        return res.render("admin", {
            shortid: null,
            allUser
        });
    }
    catch(err) {
        console.log(err);
        return res.json({"message": "error"})
    }
});


module.exports = {
    router
}