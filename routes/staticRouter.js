const express = require("express");
const router = express.Router();
const { URL }= require("../models/url");
const {AUTH} = require("../models/user");


router.get("/", async (req, res) => {
    if(!req.user) return res.redirect("/login");
    const allUser = await URL.find({  userId : req.user._id});
        return res.render("userhome", {
            urls: allUser,
        })
});

router.get("/signup", (req, res)=> {
    return res.render("signup");
});

router.get("/login", (req, res)=> {
    return res.render("login");
})

module.exports = { 
    router
};
