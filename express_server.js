const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {};

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const emailLookUp = (users, emailCheck) => {
  for (let user in users) {
    if (users[user].email === emailCheck) {
      return [true, users[user]];
    }
  }
  return false;
}

const generateRandomString = function(){
  return Math.random().toString(36).substr(2, 6);
}

//Create new URL
app.get('/urls/new', (req, res) => {
  const userID = req.cookies["user_id"];
  const templateVars = {
    userID,
    user: users[userID],
  };
  res.render('urls_new', templateVars);
});

//DELETE request
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL.slice(1);
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.route('/urls/:shortURL')
  //show shortURL view after creating
  .get((req, res) => {
    const shortURL = req.params.shortURL.slice(1);
    const userID = req.cookies["user_id"];
    const templateVars = { 
      userID,
      user: users[userID],
      "shortURL": shortURL, "longURL": urlDatabase[shortURL] 
    };
    res.render('urls_show', templateVars);
  })
  //update specified longURL to use shortURL
  .post((req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect('/urls')
  });

//Redirect user to long URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.route('/urls')
  //Main page -> show URL database
  .get((req, res) => {
    const userID = req.cookies["user_id"];
    const templateVars = { 
      userID,
      user: users[userID],
      urls: urlDatabase 
    };
    res.render('urls_index', templateVars);
  })
  //Post request from input form in /urls/new
  .post((req, res) => {
    //Redirect to the shortURL code generated in function
    const randomURL = generateRandomString();
    urlDatabase[randomURL] = req.body.longURL;
    res.redirect(`/urls/:${randomURL}`);
  });

//JSON for URL Database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.route('/register')
  //Show registration view
  .get((req, res) => {
    const userID = req.cookies["user_id"];
    const templateVars = {
      userID, 
      user: users[userID],
    };
    res.render('registration', templateVars);
  })
  //Add new user to users database
  .post((req, res) => {
    const userRandomID = generateRandomString();
    const userObj = {
      id: userRandomID,
      email: req.body.email,
      password: req.body.password
    }

    if(emailLookUp(users, req.body.email)[0]) {
      res.status(400).send('Status code 400: E-mail already exists');
    } else if (userObj.email === "" || userObj.password === "") {
      res.status(400).send('Status code 400: Please provide E-mail and password');
    } else if (userObj.password.length < 4) {
      res.status(400).send('Status code 400: Password must be at least 4 characters');
    } else if (userObj.password !== req.body.password_confirm) {
      res.status(400).send('Status code 400: Passwords do not match');
    } else {
      users[userRandomID] = userObj;
      res.cookie('user_id', userRandomID);
      res.redirect('/urls');
      console.log(userObj);
    }
  });

app.route('/login')
  .get((req, res) => {
    const userID = req.cookies["user_id"];
    const templateVars = {
      userID, 
      user: users[userID],
    };
    res.render('login', templateVars);
  })
  .post((req, res) => {
    const loginCheck = emailLookUp(users, req.body.email);
    if(loginCheck[0]) {
      if(loginCheck[1].password === req.body.password) {
        res.cookie('user_id', loginCheck[1].id);
        res.redirect('/urls');
      }
    } else {
      res.status(403).send('Status code 403: Incorrect email or password');
    }
  });

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/', (req, res) => {
  res.redirect('/register');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

