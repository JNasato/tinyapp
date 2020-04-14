const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function(longURL){
  let urlString = Math.random().toString(36).substr(2, 6);
  urlDatabase[urlString] = longURL;
  //log the URL database after the new URL as been added
  console.log(urlDatabase);
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
  res.send('Hello!');
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//Post request from input form in /urls/new
app.post("/urls", (req, res) => {
  //Redirect to the shortURL code generated in function
  res.redirect(`/urls/:${generateRandomString(req.body.longURL)}`);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new.ejs');
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL.slice(1);
  const templateVars = { "shortURL": shortURL, "longURL": urlDatabase[shortURL] };
  res.render('urls_show', templateVars);
});

//Redirect user to long URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

