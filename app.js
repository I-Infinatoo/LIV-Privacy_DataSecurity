const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const window = require('window');
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

/*
// Add a route to handle the request to notify the server that the user has closed the browser
app.post('/browser-closed', (req, res) => {
  console.log('User has closed the browser');
  res.sendStatus(200);
});
*/

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// // Listen for beforeunload event on client-side
// window.addEventListener('beforeunload', () => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', '/close-browser', true);
//   xhr.send();
// });