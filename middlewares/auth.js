const {getUser, getAdmin} = require("../service/auth");


async function restrictToLoggedinUserOnly(req, res, next) {

    const userUid = req.cookies?.uid;
    // console.log(userUid);
    if(!userUid) return res.redirect('/login');
    const user = getUser(userUid);

    if(!user) return res.redirect("/login");
    req.user = user;
    next();
}


async function  checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;
    const user = getUser(userUid);
    req.user = user;
    next();
    
}

async function restrictToAdminOnly(req, res, next) {
    const token = req.cookies?.uid;
    if(!token) return res.status(404).redirect("/login");

    try {
        const user = await getAdmin(token);
        if(!user || user.role != "ADMIN") {
            return res.status(404).json({"status": "you are unauthorized"});
        }
        
        next();
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({"status": "server error"});
    }


}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
    restrictToAdminOnly
}