const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const net = require('net');

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// check and start the server on the next available port
function portIsFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.on('error', () => {
      resolve(false);
    });

    server.on('listening', () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port);
  });
}
async function startServer(port) {

  if(port >= 65535) {
    console.log('No port is available! checked till port number: 65535');
    return;
  }
  const isFree = await portIsFree(port);

  if (isFree) {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } else { 
    // if not free then check for the next port
    console.log(`Port ${port} is already in use`);
    startServer(port + 1);
  }
}
startServer(port);

/*// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
*/