const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// for input sanitization against XSS
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const passwordUtils = require('../utils/passwordUtil'); // import passwordUtils module

router.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '/../public/signupPage.html'));
});



router.post('/', (req, res, next) => {

  let { email, password } = req.body;
 
  // sanitization
  email = DOMPurify.sanitize(email);
  password = DOMPurify.sanitize(password);

  const credentialsPath = 'credentials.json';

  // Check if credentials.json file exists and read the file
  let credentials;
  try {
    // credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const data = JSON.parse(fs.readFileSync(credentialsPath));

    if(data.trim !== '') { // credentials.json has prior content
      // return res.status(400).send('User already exists');
      return next(Object.assign(new Error('User already exists'), { statusCode: 400 }));

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
  // res.status(201).send('User created successfully');
  res.sendFile(path.join(__dirname, '/../public/index.html'));

});

module.exports = router;
