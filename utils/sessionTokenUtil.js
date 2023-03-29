const path = require('path');
const fs = require('fs');

function isValidSessionToken(sessionToken ) {
    
    if (!sessionToken) {
      return false;
    }

    const sessionTokensPath = 'session_tokens.json'; // path to session tokens file
    console.log('got the sessionTokenPath');

    // Check if session_tokens.json file exists and read the file
    let sessionTokens;
    try {
        sessionTokens = JSON.parse(fs.readFileSync(`${sessionTokensPath}`));
    } catch (err) {
        sessionTokens = {};
    }
  
    for(let email in sessionTokens) {
        console.log("sessionTokens[email].sessionToken: " + sessionTokens[email]);
        if(sessionTokens[email] === sessionToken) {
            // console.log("sessionTokens[email].sessionToken: " + sessionTokens[email].sessionToken);
            return true;
        }
    }
    
    console.log('not matched');
    return false;  
}

module.exports = {isValidSessionToken};