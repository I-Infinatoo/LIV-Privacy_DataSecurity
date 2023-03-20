const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(express.static('./public/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Read the stored credentials from a file
const storedCredentials = JSON.parse(fs.readFileSync('credentials.json'));

//  --------------------------- Functions ----------------------------------
// Function to validate the email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate the password format
function validatePassword(password) {
  
    /* Old regex, misses the check for the special characters 
    // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit
    //   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    */
    
    //Must include at least 1 small letter, 1 capital letter, 1 number, 1 special character and must be at least of 8 chars   
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
}

// Function to generate the hash value
function generateHash(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  // return hash.digest('binary');
  return hash.digest('hex');
}

//  ----------------------------- Functions over -----------------------------

/* integrated html code, to display the login form
// Route to display the login form
// app.get('/', (req, res) => {
//   res.send(`
//     <html>
//       <head>
//         <title>Login</title>
//       </head>
//       <body>
//         <form method="post" action="/login">
//           <label>Email:</label>
//           <input type="email" name="email" required><br><br>
//           <label>Password:</label>
//           <input type="password" name="password" required><br><br>
//           <button type="submit">Login</button>
//         </form>
//       </body>
//     </html>
//   `);
// });
*/

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Route to handle the login form submission
    // app.post('/login', (req, res) => {
app.post('/login', (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;

  console.log( "Hash of current password: " + generateHash(password));

  if (!validateEmail(email)) {
    res.send('Invalid email format');
    return;
  }

  if (!validatePassword(password)) {
    res.send('Invalid password format');
    return;
  }

  // Check if the credentials match the stored credentials
  if (email === storedCredentials.email && password === storedCredentials.password) {
    res.send('Login successful!');
  } else {
    res.send('Incorrect email or password');
  }
});

app.listen(port, () => {
    console.log('Server started on port 3000');
});
