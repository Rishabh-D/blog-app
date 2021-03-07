const express = require("express");
const mongoose = require("mongoose");
const app = express();
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/middleware.js");
//listening for requests
port = 8080;
host = "127.0.0.1";
// registering view engine for express

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //to parse data as string/array
app.use(express.json()); //parse json data as js array
app.use(cookieParser());
//connection string for mongoDb
const dbURI =
  "mongodb+srv://Rishabh:Fg8r42YovE01PZjp@cluster0.9vvbp.mongodb.net/node_finance";

//the object { useNewUrlParser: true, useUnifiedTopology: true } will remove deprecation warning
// server will listen only after connection is established

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    //listening for requests
    app.listen(port, host, () => {
      console.log(`listening at ${host}` + ":\\" + `${port}`);
    });
  })
  .catch((err) => console.log("error connecting to db", err));

/*
database:
app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "new blog",
    snippet: "about my new blog",
    body: "about my new blog few lines more",
  });

  blog
    .save()
    .then((result) => res.send(result))
    .catch((err) => {
      console.log(err);
    });
});
*/

//serving, routing
app.get("*", checkUser);

app.get("/", (req, res) => {
  //   the directory specified is relative. But node looks for it in the root
  //   folder of the system. So we add a object as a parameter and specify root as the project folder
  //   res.sendFile("./pages/index.html", { root: __dirname });

  //rendering view
  //if someone visits home page, then display all the blogs,
  //fetching all the blogs can be done in all-blogs route, sp just redurect user to it

  // res.render("index", { title: "Home" });
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// if user accidently types `about-us` insted of `about` in the url then we redirect him {res.redirect('/validUrl')}
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

// all blog routes will be handled by blogRoutes
app.use("/blogs", blogRoutes);
// all auth routes will be handled by blogRoutes
console.log("here");
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
