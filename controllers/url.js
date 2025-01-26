const { json } = require("express");
const { URL } = require("../models/url");
const shortid = require("shortid");


//handler for generating short url
async function handleGenerateShortUrl (req, res) {
    const url = req.body.url;
  
    if(!url) {
        return res.status(400).json({ status: "Please enter a url"});
    }

    const urlIsThere = await URL.find({"userId": req.user._id, "redirectUrl": url});

    if(urlIsThere.length) {
        const urls = await URL.find({"userId" : req.user._id});
        return res.status(201).render('userhome', {
            shortid: urlIsThere[0].shortUrl,
            userUrls: urls,
            user: req.user
        })
    }

    const shortUrl = shortid.generate();
    try {
        const newUrl = new URL({
            shortUrl : shortUrl, 
            redirectUrl: url,
            userId: req.user._id,
        });
        await newUrl.save();

        const urls = await URL.find({"userId" : req.user._id});
        return res.status(201).render('userhome', {
            shortid: shortUrl,
            userUrls: urls,
            user: req.user
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).render({'status': "server error"});
    }
}

// handler for redirecting to the original url based on the given short id
async function handleRedirectUrl(req, res) {
    const shortId = req.params.id;

    try {
        const urlObject = await  URL.findOne({ "shortUrl": shortId });
        if(!urlObject) {
            return res.status(400).json({"status": "Please enter a valid shorturl"})
        }

        urlObject.visHistory.push({timestamps: new Date()});
        await urlObject.save();

        const redirectUrl =  `https://${urlObject.redirectUrl}`;
        return res.status(302).redirect(redirectUrl);
    }
    catch(err) {
        console.log(err);
        return res.status(505).json({"status": "server Error"});
    }
}

// handling the analytics of the given short id -> visited count 
async function handleUrlAnalytics(req, res) {
    const shortId = req.params.id;
    
    try {
        const urlIsThere = await URL.findOne({"shortUrl" : shortId});

        if(!urlIsThere) {
            return res.end("short id is requried");
        }
        const count =  await urlIsThere.visHistory.length;
        return res.status(200).json({"count": `${count}`});
    }
    catch(err) {
        console.log(err);
        return res.json(500).json({"status": "serverError"});
    }

}

module.exports = {
    handleGenerateShortUrl,
    handleRedirectUrl,
    handleUrlAnalytics
}
