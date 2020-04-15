const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const generateRandomString = function(longURL){
  let urlString = Math.random().toString(36).substr(2, 6);
  urlDatabase[urlString] = longURL;
  //log the URL database after the new URL as been added
  return urlString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//JSON for URL Database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});


app.route('/urls')
  .get((req, res) => {
    const templateVars = { 
      username: req.cookies["username"],
      urls: urlDatabase 
    };
    res.render('urls_index', templateVars);
  })
  //Post request from input form in /urls/new
  .post((req, res) => {
    //Redirect to the shortURL code generated in function
    res.redirect(`/urls/:${generateRandomString(req.body.longURL)}`);
  });

app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render('urls_new', templateVars);
});

app.route('/urls/:shortURL')
  //show shortURL view after creating
  .get((req, res) => {
    const shortURL = req.params.shortURL.slice(1);
    const templateVars = { 
      // username: req.cookies["username"],
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

//DELETE request
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL.slice(1);
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

