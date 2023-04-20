const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json()); // takes any json data that comes along with request and it parses it to JavaScript object so we can use it inside the code and attach it in the request object so we can access it in the request handlerers
app.use(cookieParser()); // to access cookie method in response object

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://aleksandro:gzF2lzgI0EYtTF4b@cluster0.41krbbu.mongodb.net/node-auth?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to db");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies
app.get("/set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.send("You got the cookies");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});
