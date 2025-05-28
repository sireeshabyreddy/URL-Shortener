const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const { restrictTo } = require('../middlewares/auth'); // Adjust the path to `auth.js`

router.get("/admin/urls",restrictTo(["ADMIN"]),async(req,res)=>{
  const allurls = await URL.find({});
  return res.render('home', {
     user: req.user,
    urls: allurls,
    showTable: true,
  });
});

router.get('/',restrictTo(['NORMAL',"ADMIN"]) ,async (req, res) => {
  
  const allurls = await URL.find({createdBy:req.user._id});
  return res.render('home', {
    user: req.user,
    urls: allurls,
    showTable: true,
   
    message: "" 
  });
});

router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get('/logout', (req, res) => {
  // If you just want to render a logout confirmation page:
  return res.render('logout'); 

});

module.exports = router;
