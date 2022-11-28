const toString = () => {
  return (Math.random() + 1).toString(36).substring(6);
};

const urlsforUser = (id) => {
  for (key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      return urlDatabase[key].longURL;
    }
  }
};

const {json} = require("express");
const express = require("express");

const app = express();
const PORT = 8080; // default port 8080 


app.set("view engine", "ejs" );
app.use(express.urlencoded({extended:true}));
// const cookieSession = require('cookie-session');
// app.use(cookieSession({
//   name:'session1',
//   secret: "all your bases belong to us",

//   maxAge: 90000
// }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require("bcryptjs");



const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lw",
  },
  i3BoGr: {
    longURL: "http://www.google.com",
    userID: "aJ48lw",
  },

};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123",
  },
};

app.get("/urls", (req, res) => {
  const userID = req.cookies.user_id
  if (userID) {
    const userURls = (userID, urlDatabase)
    const templateVars = {user: users[userID], urls: userURls};
    return res.render("urls_index", templateVars);
  }
  return res.send("Error you need a registered account to view URLS");
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  if (users[req.cookies.user_id]) {
    res.redirect("/urls");
    return;
  }
  return res.render("urls_register", templateVars);
});

app.post("/urls", (req, res) => {
  const id = toString();
  urlDatabase[id] = { longURL: req.body.longURL, userID: req.cookies.user_id};
  if (req.cookies.user_id) {
    return res.redirect(`/urls/${id}`);

  }
  return res.send("you cannot make shorten URLs' without an account");

});


app.get('/login', (req, res) => {
  if (users[req.cookies.user_id]) {
    res.redirect("/urls");
    return;
  }
  const templateVars = { user: users[req.cookies.user_id] };
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
      return res.send("400 status code. Email already exists. ");
    }
  }
  const id = toString();
  const hashedPassword = bcrypt.hashSync(password, 3);
  const user = {id: id, email: email, password: hashedPassword};
  users[id] = user;
  res.cookie("user_id", id);
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const id = toString();
  const email = req.body.email
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 3);
  for (let key in users) {
    if (users[key].email === email) {
      if (bcrypt.compareSync("123", hashedPassword)) {
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

app.post("/logout", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  res.clearCookie("user_id", templateVars);
  return res.redirect("/login");
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies.user_id] };
  if (users[req.cookies.user_id]) {
    res.render("urls_new", templateVars);
    return;
  }
  return res.redirect("/login");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const user = users.userRandomID;
  const templateVars = { id: id, longURL: urlDatabase[id].longURL, userID: req.cookies.user_id, user };
  if (longURL !== urlDatabase[id].longURL) {
    return res.send("Error this URL does not exist");
  } else if (urlDatabase[id].userID === req.cookies.user_id) {
    return res.render("urls_show", templateVars);
  } else {
    return res.send("Error this URL does not belong to this user");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id].longURL = req.body.longURL;
  return res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const id = toString();
  urlDatabase[id].longURL = req.body.longURL;
  res.redirect("/urls");
  return;
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  urlDatabase[id];
  if (urlDatabase[id].userID === req.cookies.user_id) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } return res.send("Error this URL does not belong to this user");
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id];
  const longURL = urlDatabase[id].longURL;
  if (longURL) {
    return res.redirect(longURL);
  }
  return res.send("shortend URL does not exist");
});

app.get("/", (req, res) => {
  const email = req.cookies.email;

  return res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<hrml><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


