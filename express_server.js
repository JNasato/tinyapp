const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const helperFunctions = require('./helpers');
const generateRandomString = helperFunctions.generateRandomString;
const emailLookUp = helperFunctions.emailLookUp;
const getUserByEmail = helperFunctions.getUserByEmail;

const urlDatabase = {
  'sgq3y6': {
    longURL: 'https://www.example.com',
    userID: 'userRandomID'
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$OFIiXZYMIMD98fBx/SXKpumuxjl1m74h0uTwovC3hrFsfnmL4OFL6"
  },
};

//------------------------- URLs ROUTES -------------------------//

//Page to create new URL
app.get('/urls/new', (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    userID,
    user: users[userID],
  };
  if (userID === undefined) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

//DELETE request
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL.slice(1);
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.send('Cannot delete URL');
  }
});

app.route('/urls/:shortURL')
  //show shortURL view after creating
  .get((req, res) => {
    const shortURL = req.params.shortURL.slice(1);
    const userID = req.session.user_id;
    const templateVars = {
      userID,
      user: users[userID],
      urls: urlDatabase,
      shortURL
    };
    res.render('urls_show', templateVars);
  })
  //update specified longURL to use shortURL
  .post((req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = req.body.longURL;
    if (req.session.user_id === urlDatabase[shortURL].userID) {
      urlDatabase[shortURL] = longURL;
      res.redirect('/urls');
    } else {
      res.send('Cannot edit URL');
    }
  });

app.route('/urls')
  //Main page -> show URL database
  .get((req, res) => {
    const userID = req.session.user_id;
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
    const randomURL = generateRandomString(6);
    const longURL = req.body.longURL;
    const userID = req.session.user_id;
    urlDatabase[randomURL] = {
      longURL,
      userID
    }
    res.redirect(`/urls/:${randomURL}`);
  });

//JSON for URL Database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//------------------------- REGISTER ROUTES -------------------------//

app.route('/register')
  //Show registration view
  .get((req, res) => {
    const userID = req.session.user_id;
    const templateVars = {
      userID,
      user: users[userID],
    };
    res.render('registration', templateVars);
  })
  //Add new user to users database
  .post((req, res) => {
    const userRandomID = generateRandomString(9);
    const password = req.body.password;
    bcrypt.hash(password, 10).then((hashedPassword) => {
      const userObj = {
        id: userRandomID,
        email: req.body.email,
        password: hashedPassword
      }

      if (emailLookUp(users, req.body.email)) {
        res.status(400).send('Status code 400: E-mail already exists');
      } else if (userObj.email === "" || req.body.password === "") {
        res.status(400).send('Status code 400: Please provide E-mail and password');
      } else if (req.body.password.length < 4) {
        res.status(400).send('Status code 400: Password must be at least 4 characters');
      } else if (req.body.password !== req.body.password_confirm) {
        res.status(400).send('Status code 400: Passwords do not match');
      } else {
        users[userRandomID] = userObj;

        req.session.user_id = userRandomID;
        res.redirect('/urls');
      }
    });
  });

//------------------------- LOGIN / LOGOUT ROUTES -------------------------//

app.route('/login')
  .get((req, res) => {
    const userID = req.session.user_id;
    const templateVars = {
      userID,
      user: users[userID],
    };
    res.render('login', templateVars);
  })
  .post((req, res) => {
    const userEmail = req.body.email;
    const user = getUserByEmail(users, userEmail)
    if (emailLookUp(users, userEmail)) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          req.session.user_id = user.id;
          res.redirect('/urls');
        } else {
          res.status(403).send('Status code 403: Incorrect email or password');
        }
      });
    } else {
      res.status(403).send('Status code 403: Incorrect email or password');
    }
  });

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//------------------------- OTHER ROUTES -------------------------//

//Redirect user to long URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get('/', (req, res) => {
  res.redirect('/register');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

