const { getUser } = require("../service/auth");

async function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if (!tokenCookie ) {
        return next();
    }

    const token = tokenCookie ;
    try {
        const user = await getUser(token); // Ensure getUser is an async function if it uses external calls.
        req.user = user;
    } catch (error) {
        console.error("Authentication error:", error);
    }
   return  next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            return res.redirect("/login"); // For APIs, use res.status(401).send("Unauthorized")
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).end("Unauthorized"); // 403 for forbidden access
        }
        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};
