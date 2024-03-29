const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const app = express();
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/middleware.js");

//listening for requests
port = process.env.PORT || 3000;
dotenv.config();
// registering view engine for express

// set view engine as ejs(embedded javascript to insert bit of js in html)
app.set("view engine", "ejs"); 

// let the nodejs know where are all the views (ejs files) located
app.set("views", "pages");

// static files like assets or htmls are stored , this file will be served in public folder to the user everytime any request is made
app.use(express.static("public"));


app.use(express.urlencoded({ extended: true })); //to parse form dataa
app.use(express.json()); //parse json data coming from client and attach it to the req.body
app.use(cookieParser());
//connection string for mongoDb
const dbURI = process.env.DB_URI
console.log(dbURI)

//the object { useNewUrlParser: true, useUnifiedTopology: true } will remove deprecation warning
// server will listen only after connection is established

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    //listening for requests
    app.listen(port, () => {
      console.log(`listening at ${port}`);
    });
  })
  .catch((err) => console.log("error connecting to db", err));


// for all routes
app.get("*", checkUser);

app.get("/", (req, res) => {
  //   the directory specified is relative. But node looks for it in the root
  //   folder of the system. So we add a object as a parameter and specify root as the project folder
  //   res.sendFile("./pages/index.html", { root: __dirname });

  //rendering view
  //if someone visits home page, then display all the blogs,
  //fetching all the blogs can be done in all-blogs route, so just redurect user to it

  // res.render("index", { title: "Home" });
  res.redirect("/blogs");
});
console.log("is it re-running everytime a request is made? : NO")
app.get("/about", (req, res) => {

  // render is used for template engine, node already know where to find about.js since u set that in app.set("views", "pages");
  res.render("about", { title: "About" });
});

// if user accidently types `about-us` insted of `about` in the url then we redirect him {res.redirect('/validUrl')}
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

// all blog routes will be handled by blogRoutes
app.use("/blogs", blogRoutes);

app.use(authRoutes);

app.get("/set-cookie", (req, res) => {
  res.cookie("newUser", false);
  res.cookie("anyData", "No");
  res.send("sending cookies");
});

// 404, keep this line at the end always
app.use((req, res) => {
  res.status(404);
  res.render("notFound404", { title: "Error 404" });
});
