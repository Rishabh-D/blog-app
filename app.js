const express = require("express");

const app = express();

// registering view engine for express

app.set("view engine", "ejs");
app.set("views", "pages");

//listening for requests
port = 8080;
host = "127.0.0.1";
app.listen(port, host, () => {
  console.log(`listening at ${host}` + ":\\" + `${port}`);
});

//serving, routing

app.get("/", (req, res) => {
  //   the directory specified is relative. But node looks for it in the root
  //   folder of the system. So we add a object as a parameter and specify root as the project folder
  //   res.sendFile("./pages/index.html", { root: __dirname });

  //rendering view
  res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// if user accidently types `about-us` insted of `about` in the url then we redirect him {res.redirect('/validUrl')}
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Add blogs" });
});

// 404, keep this line at the end always
app.use((req, res) => {
  res.status(404);
  res.render("notFound404", { title: "Error 404" });
});
