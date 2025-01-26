const {v4 : uuidv4} = require("uuid");
const {AUTH} = require("../models/user");
const {setUser, getUser}  = require("../service/auth");
const { URL } = require("../models/url");

// singup user
async function handleSignUp(req, res) {
    const body = req.body;

    console.log(body);

    if(!body.name ||
        !body.email ||
        !body.userName ||
        !body.password ||
        !body.password2 
    ) {
        return res.json({"status": "all fields are required"});
    }

    const existingUesr = await AUTH.findOne({email : body.email});

    if(existingUesr) {
        return res.json({"status": "user with same email already exists"});
    }

    existingUser = await AUTH.findOne({userName : body.userName});

    if(existingUesr) {
        return res.json({"status": "username already taken"});
    }

    if(body.password != body.password2) {
        return res.json({"status": "passwords must be same"});
    }

    try {
        const newUser = new AUTH({
            name: body.name,
            email: body.email,
            userName: body.userName,
            password: body.password
        });

        await newUser.save();
        return res.render("login");
    }
    catch(err) {
        console.log(err);
        return res.status(505).json({"status": "Server  Eroor"})
    }
}

// user login
async function handleLogin(req, res) {
    const body = req.body;

    if(!body.email && !body.password) {
        return res.json({"status": "please enter correct details"});
    }

    const user = await AUTH.findOne({email: body.email});

    if (user) {
        if (body.password == user.password) {

           //  // const sessionId = uuidv4();  //FOR SESSION BASED AUTH
           //    // setUser(sessionId, user);
            const token = setUser(user);       // FOR JWT AUTH
            res.cookie("uid", token, {
                httpOnly: true,
            });

            const urls = await URL.find({"userId": user._id});
            return res.render("userhome", {
                shortid: null,
                user,
                userUrls : urls
            });
        }
        else {
            return res.status(400).json({"message": "Please enter correct password"});
        }
    }
    
    return res.json({message: "Please enter valid details"});
}

//user logout
async function handleLogout(req, res) {
    return res.status(400).render("login");
}

//user password reset
async function handlePasswordReset(req, res) {
    const body = req.body;

    if(!body.email || !body.oldPassword || !body.newPassword) {
        return res.json(404).json({"message": "please enter valid detials"});
    }

    const user = await AUTH.findOne({email: body.email, password: body.oldPassword});

    if(user) {
        user.password = body.newPassword;
        await user.save();
        return res.status(200).json({"message": "password changed Successfully"});
    }
    else {
        return res.status(404).json({"msg": "please enter valid email and password"});
    }

}


module.exports = {
    handleSignUp,
    handleLogin,
    handleLogout,
    handlePasswordReset
}