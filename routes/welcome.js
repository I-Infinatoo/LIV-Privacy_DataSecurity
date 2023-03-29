const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const {isValidSessionToken} = require('../utils/sessionTokenUtil');

router.get('/', (req, res) => {
    console.log('inside the welcome route');
    
    const sessionToken = req.cookies.sessionToken;
    console.log('got token from req');

    // Check if the session token is valid
    if (isValidSessionToken(sessionToken)) {
        // Render the welcome page
        console.log('varified the token');
        res.sendFile(path.join(__dirname, '../public/', 'welcomePage.html'));
    } else {
        // Redirect to the login page
        console.log('token not verified, redirecting to login route');
        res.redirect('/login');
    }
});

module.exports = router