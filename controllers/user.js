// userController.js
const User = require("../models/user");
const bcrypt = require("bcrypt"); 
const { setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
     return res.status(400).render('signup', {
        error: 'Email already registered'
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.redirect('/'); 

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).send('Internal Server Error');
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or Password! please try again",
      });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid Username or Password",
      });
    }

    // Generate and set token
    const token = setUser(user);
    res.cookie("token", token, { httpOnly: true, secure: true });

    return res.redirect("/");

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send("Internal Server Error");
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/login");
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
};
