const express = require("express");
const { handleGenerateShortUrl,
        handleRedirectUrl,
        handleUrlAnalytics } = require("../controllers/url");
const router = express.Router();

router.post("/generate-short-id", handleGenerateShortUrl)      // route for generatingg short url

router.get("/analytics/:id", handleUrlAnalytics);   // route for provide the analytics of shortid such as visit count
     
router.get("/redirect-url/:id", handleRedirectUrl);  // route for redirect to the original url based on the given shortid

module.exports = {
        router
};




