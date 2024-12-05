// auth.js
const jwt = require("jsonwebtoken");
const secret = "siri$123@$";

function setUser(user) {
    return jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role,
    },
     secret, { expiresIn: '1h' });
}

function getUser(token) {
    if (!token) {
        return null; // Token is required for verification
    }
    try {
        return jwt.verify(token, secret); // If token is valid, it returns the decoded user
    } catch (error) {
        console.error("Invalid or expired token", error);
        return null;
    }
}

module.exports = {
    getUser,
    setUser,
};
