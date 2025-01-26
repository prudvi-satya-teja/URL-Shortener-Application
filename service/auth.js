
// FOR JWT AUTHENTICATION
const jwt = require("jsonwebtoken");
const secret = "Prudvi$123@5";
const { AUTH} = require("../models/user");


function setUser( user) {
    return jwt.sign({
        _id : user._id,
        email: user.Email
    }, secret);
}

function getUser(token) {
    if(!token) return null;
    try {
        return jwt.verify(token, secret);
    }
    catch(err) {
        return null;
    }
}

async function getAdmin(token) {
    try {
        const decoded = jwt.verify(token, secret);
        const userId = decoded._id;
        const user = await AUTH.findOne({_id: userId});
        if (!user) {
            console.log("No user found with this ID.");
            return null;
        }
        return user;
    }
    catch(err) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
    getAdmin
}





   // for session based authentication 
// const sessionIdToUserMap = new Map();

// function setUser(id, user) {
//     sessionIdToUserMap.set(id, user);
// }

// function getUser(id) {
//     return sessionIdToUserMap.get(id);
// }

// module.exports = {
//     setUser,
//     getUser
// }
