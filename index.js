const express = require("express");
const app = express();
const urlRoute = require("./routes/url");
const connectToMongoDB = require("./connect");
const URL = require("./models/url");
const path=require("path");
const staticRoute=require('./routes/staticRouter');
const userRoute=require("./routes/user");
const {checkForAuthentication,
  restrictTo,}=require("./middlewares/auth");
const cookieParser=require("cookie-parser");

const PORT = 8001;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"));

app.set("view engine","ejs");

app.set('views',path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthentication);

// Routes


/*app.get("/test",async(req,res)=>{
    const allusers=await URL.find({});
    return res.render("home",{
        urls:allusers,
    });

});*/

app.use("/url",restrictTo(["NORMAL","ADMIN"]), urlRoute);
app.use("/user", userRoute);

app.use('/',staticRoute);

// Handle redirection for short URL
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOne({ shortId });
  if (!entry) {
    return res.status(404).json({ error: "URL not found" });
  }
  // Update the visit history
  await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  // Redirect to the original URL
  res.redirect(entry.redirectURL);
});

app.post('/url/delete/:shortId', async (req, res) => {
    const { shortId } = req.params;
    try {
        await URL.findOneAndDelete({ shortId });
        res.redirect('/'); // Redirect to the homepage after deletion
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).send('Failed to delete URL');
    }
});


app.listen(PORT, () => {
  console.log(`Server started at PORT=${PORT}`);
});
