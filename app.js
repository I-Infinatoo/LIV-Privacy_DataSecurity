const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const welcomeRoute = require('./routes/welcome');

const app = express();
const port = 3000;

// set up the cookieParser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up static file serving middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set up index route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up signup route
app.use('/signup', signupRoute);

// Set up login route
app.use('/login', loginRoute);

// set up welcome route
app.use('/welcome', welcomeRoute);

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
