const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const passwordUtils = require('../utils/passwordUtil'); // import passwordUtils module

router.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '/../public/signupPage.html'));
});



router.post('/', (req, res) => {

  const { email, password } = req.body;
  const credentialsPath = 'credentials.json';

  // Check if credentials.json file exists and read the file
  let credentials;
  try {
    // credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const data = JSON.parse(fs.readFileSync(credentialsPath));

    if(data.trim !== '') { // credentials.json has prior content
      return res.status(400).send('User already exists');
    }
    
    credentials = JSON.parse(data);
  } catch (err) {
    credentials = {};
  }

  // // Check if user with the same email already exists
  // if (credentials[email]) {
  //   return res.status(400).send('User already exists');
  // }

  // Generate salt and hash for the password
  const { salt, hash } = passwordUtils.hashPassword(password);

  // Save email and hashed password to credentials.json
  credentials[email] = { salt, hash };
  fs.writeFileSync(credentialsPath, JSON.stringify(credentials));

  // Return success message
  res.status(201).send('User created successfully');
});

module.exports = router;