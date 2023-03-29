const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const uuid = require('uuid').v4;  // for session token

const passwordUtils = require('../utils/passwordUtil'); // import passwordUtils module
// const {validateEmail, validatePassword} = require('../utils/pass-emailFormatChecker');

router.get('/', (req, res) => {
  // res.sendFile('./../public/loginPage.html');
  res.sendFile(path.join(__dirname, '/../public/loginPage.html'));
});

router.post('/', (req, res) => {
  const { email, password } = req.body;
  const credentialsPath = 'credentials.json';
  const sessionTokensPath = 'session_tokens.json'; // path to session tokens file

  // Check if credentials.json file exists and read the file
  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(`${credentialsPath}`));
  } catch (err) {
    credentials = {};
  }

  // Check if user with the provided email exists
  if (!credentials[email]) {
    return res.status(401).send('Invalid email or password');
  }

  // Retrieve salt and hash from credentials
  const { salt, hash } = credentials[email];

  // Verify password
  const passwordIsValid = passwordUtils.verifyPassword(password, salt, hash);

  if (!passwordIsValid) {
    return res.status(401).send('Invalid email or password');
  }

  // generate a session token
  const sessionToken = uuid();

  // write the session token to the session_tokens file
  let sessionTokens;
  try{
    sessionTokens = JSON.parse(fs.readFileSync(`${sessionTokensPath}`));
  } catch (err) {
    sessionTokens = {};
  }
  sessionTokens[email] = sessionToken;

  fs.writeFileSync(`${sessionTokensPath}`, JSON.stringify(sessionTokens));

  // set the sessionToken as the cookie
  res.cookie('sessionToken', sessionToken);

  // Password is valid, return success message
  // res.status(200).send('Login successful');
  console.log('sessionToken: ' + sessionToken + '\nLogined');
  
  // redirect to welcome route
  res.redirect('/welcome');

});

module.exports = router;
