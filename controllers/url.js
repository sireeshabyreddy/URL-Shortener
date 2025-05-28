const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Check if URL already exists for this user (or globally if no user)
    let existingUrl = null;
    if (req.user) {
        existingUrl = await URL.findOne({ redirectURL: body.url, createdBy: req.user._id });
    } else {
        existingUrl = await URL.findOne({ redirectURL: body.url });
    }

    if (existingUrl) {
        // Render home page with the message "URL already done"
        return res.render("home", {
            user: req.user,
            id: existingUrl.shortId,
            urls: [],            // no table here
            showHomeButton: true,
            showTable: false,
            message: "URL already done please ,Refer to the Analytics table for ShortenedUrl"
        });
    }

    // Generate unique shortId
    let shortID;
    let urlExists = true;

    while (urlExists) {
        shortID = shortid.generate();
        const existingShortId = await URL.findOne({ shortId: shortID });
        if (!existingShortId) {
            urlExists = false;
        }
    }

    // Create new URL entry
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user ? req.user._id : null,
    });

    // Redirect to home to show table
    return res.redirect("/");
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}



module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
   
};
