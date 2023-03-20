const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const passwordUtils = require('../utils/passwordUtil'); // import passwordUtils module
// const {validateEmail, validatePassword} = require('../utils/pass-emailFormatChecker');

router.get('/', (req, res) => {
  // res.sendFile('./../public/loginPage.html');
  res.sendFile(path.join(__dirname, '/../public/loginPage.html'));
});

router.post('/', (req, res) => {
  const { email, password } = req.body;
  const credentialsPath = 'credentials.json';

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

  // Password is valid, return success message
  res.status(200).send('Login successful');
});

module.exports = router;
