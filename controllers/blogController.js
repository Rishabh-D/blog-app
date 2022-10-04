const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");

const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { blogs: result, title: "All blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      console.log(result)
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const blog_create_get = (req, res) => {
  res.render("create", { title: "Create a new blog" });
};

const blog_create_post = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret string signature", (err, decodedToken) => {
      if (err) {
        res.send("Your blog could not be saved. Please login/Sign up.");
      } else {
        id = decodedToken.id;
        // res.body["id"] = id;
        req.body.id = id;
        console.log("logging body", req.body);
        const blog = new Blog(req.body);
        // console.log("logging blog", blog);
        blog
          .save()
          .then((result) => {
            res.redirect("/blogs");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else {
    res.send("Your blog could not be saved. Please login/Sign up.");
  }
};

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
};
