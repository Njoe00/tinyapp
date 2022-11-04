const toString = () => {
  return (Math.random() + 1).toString(36).substring(6);
};

const { json, text } = require("express");
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
};


app.get("/register", (req, res) => {
  const templateVars = { username: null }
  return res.render("urls_register", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = toString();
  urlDatabase[shortURL] = req.body.longURL;
  return res.redirect(`/urls/${shortURL}`);
});

app.get('/login', (req, res) => {
  const templateVars = { username: null };
  return res.render('login', templateVars);

});

app.post('/register', (req, res) => {
  const email = req.body.email
  const id = toString();
  const password = req.body.password
  console.log(email, id, password)
  const templateVars = { id: id, email: email, password: password };
  users[id] = templateVars;
  res.cookie(email, id);
  console.log(users);
  return res.redirect("/urls");
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.clearCookie("username", username);
  return res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies.username;
  const templateVars = { username }
  return res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const ID = req.params.id;
  const username = req.cookies.username;
  const templateVars = { id: ID, longURL: urlDatabase[ID], username };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/edit", (req, res) => {
  const ID = req.params.id;
  urlDatabase[ID] = req.body.longURL
  return res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  return res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  return res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const username = req.cookies.username;
  console.log(username);
  const templateVars = { urls: urlDatabase, username };
  return res.render("urls_index", templateVars);
});



app.get("/", (req, res) => {
  return res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<hrml><body>Hello <b>World</b></body></html>\n")
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// <!-- <h3> Logged in as <%= username %> </h3> -->
//           <!-- <form action="/login" method="POST"> -->
//             <!-- <label for="userName"></label><br> -->
//             <!-- <input name="username" placeholder="username" type="text" id="username"/><br> -->
//             <!-- <button type="submit" class="btn btn-primary">login</button><br> --></br>