## done:

1. the final file structure is:

    ```
    root directory: testproject_liv
    app.js: testproject_liv/app.js
    session_tokens.json: testproject_liv/session_tokens.json
    credentials.json: testproject_liv/credentials.json

    validate.js: testproject_liv/public/js/validate.js
    signupPage.html: testproject_liv/public/signupPage.html
    loginPage.html: testproject_liv/public/loginPage.html
    welcomePage.html: testproject_liv/public/welcomePage.html
    index.html: testproject_liv/public/index.html
    
    passwordUtil.js: testproject_liv/utils/passwordUtil.js
    sessionTokenUtil.js: testproject_liv/utils/sessionTokenUtil.js

    login.js: testproject_liv/routes/login.js
    signup.js: testproject_liv/routes/signup.js
    welcome.js: testproject_liv/routes/welcome.js
    ```

2. The built-in `crypto` module in Node.js to generate a hash value of the password received from the user in the login form.
    - use of salt value.

3. email and password validators must be used in script tag of the form page

4. only one entry is allowed all the time in the `credentials.json` file.

5. session management 

6. check for the empty port, in case `3000` is engaged.

## remaining:

1. Use `credentails.txt` instead of `credentials.json`. 

2. expire the session when browser gets closed or service(tool) stops. How will we check if the browser is closed?  

3. setup the environment using scripts
4. make installer
5. integrate core functions
6. delete the session file when sever restarts or closes
7. include the java files in the installer, explicitely