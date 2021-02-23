const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const app = express();

//listening for requests
port = 8080;
host = "127.0.0.1";
// registering view engine for express

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//connection string for mongoDb
const dbURI =
  "mongodb+srv://Rishabh:Fg8r42YovE01PZjp@cluster0.9vvbp.mongodb.net/node_finance?retryWrites=true&w=majority";

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

//database:
// app.get("/add-blog", (req, res) => {
//   const blog = new Blog({
//     title: "new blog",
//     snippet: "about my new blog",
//     body: "about my new blog few lines more",
//   });

//   blog
//     .save()
//     .then((result) => res.send(result))
//     .catch((err) => {
//       console.log(err);
//     });
// });

//serving, routing

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

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Add blogs" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => res.redirect("/blogs"))
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) =>
      res.render("details", { blog: result, title: "Blog Details" })
    )
    .catch((err) => console.log(err));
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 404, keep this line at the end always
app.use((req, res) => {
  res.status(404);
  res.render("notFound404", { title: "Error 404" });
});
