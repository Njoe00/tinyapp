const toString = () => {
  return (Math.random()+ 1).toString(36).substring(6);
};



const { json } = require("express");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.post("/urls", (req, res) => {
  const shortURL = toString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const ID = req.params.id
  const templateVars = { id: ID, longURL: urlDatabase[ID]};
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
res.send("<hrml><body>Hello <b>World</b></body></html>\n")
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});