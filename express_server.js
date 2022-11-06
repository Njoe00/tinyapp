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
    password: "123",
  },
};


app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  if (users[req.cookies.user_id]) {
    res.redirect("/urls");
    return;
  }
  return res.render("urls_register", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = toString();
  urlDatabase[shortURL] = req.body.longURL;
  if (users[req.cookies.user_id]) {
    res.redirect(`/urls/${shortURL}`);
    return;
  }
  res.send("you cannot make shorten URLs' without an account");
});

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  if (users[req.cookies.user_id]) {
    res.redirect("/urls");
    return;
  }
  return res.render('urls_login', templateVars);

});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (password === '' || email === '') {
    return res.send("400 status code. Email or password is empty");
  }
  for (let key in users) {
    if (users[key].email === email) {
      return res.send("400 status code. Email already exists. ")
    }
  }
  const id = toString();
  const user = { id: id, email: email, password: password };
  users[id] = user;
  res.cookie("user_id", id);
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const id = toString();
  const email = req.body.email;
  const password = req.body.password;
  for (let key in users) {
    if (users[key].email === email) {
      if (users[key].password === password) {
        const user = { id: id, email: email, password: password };
        users[id] = user;
        res.cookie("user_id", id);
        return res.redirect("/urls");
      } else {
        return res.send("error 403: username or password incorrect");
      }
    }
  }
  return res.send("error 403: username or password incorrect");
});





// app.get("/login", (req, res) => {
//   console.log(users.userRandomID)
//   if (users.userRandomID === users[req.cookies.user_id]) {
//     res.redirect("/urls");
//   }
//   return res.render("urls_login")
// });

app.post("/logout", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] }
  res.clearCookie("user_id", templateVars);
  return res.redirect("/login");
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  console.log("test");
  if (users[req.cookies.user_id]) {
    res.render("urls_new", templateVars);
    return;
  }
  return res.redirect("/login");
});

app.get("/urls/:id", (req, res) => {
  const ID = req.params.id;
  const templateVars = { id: ID, longURL: urlDatabase[ID], user: users[req.cookies.user_id] };
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
  const ID = req.params.id;
  const longURL = urlDatabase[ID];
  if (longURL) {
      res.redirect(longURL);
      return;
    }
  res.send("shortend URL does not exist");
});

app.get("/urls", (req, res) => {
  const email = req.cookies.email;
  const templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
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


