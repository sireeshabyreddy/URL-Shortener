// userController.js
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { getUser, setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/"); // Redirect to home after sign-up
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.render("login", {
            error: "Invalid Username or Password",
        });
    }

    // Generate and set the token
    const token = setUser(user); // Assuming setUser sets a token
    res.cookie("token", token, { httpOnly: true, secure: true }); // Secure cookie

    // Redirect after successful login
    return res.redirect("/"); // After login, redirect to home or the intended page
}


module.exports = {
    handleUserSignUp,
    handleUserLogin,
};
