const express = require("express");
const { handleSignUp, 
        handleLogin,
        handleLogout,
        handlePasswordReset
      } = require("../controllers/user");

const router = express.Router();

router.post("/signup" , handleSignUp);

router.post("/login", handleLogin);

router.post("/logout", handleLogout);

router.post("/password-reset", handlePasswordReset);

module.exports = {
    router
}