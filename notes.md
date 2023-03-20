## pre-requisits:

1. `credentils.json` must be present with the permissions.


## done:

1. the final file structure is:
    ```
    root directory: testproject_liv
    app.js: testproject_liv/app.js
    signupPage.html: testproject_liv/public/signupPage.html
    loginPage.html: testproject_liv/public/loginPage.html
    credentials.json: testproject_liv/credentials.json
    passwordUtil.js: testproject_liv/utils/passwordUtil.js
    index.html: testproject_liv/public/index.html
    login.js: testproject_liv/routes/login.js
    signup.js: testproject_liv/routes/signup.js
    validate.js: testproject_liv/public/js/validate.js
    ```

2. The built-in `crypto` module in Node.js to generate a hash value of the password received from the user in the login form.
    - remaining, use of salt value.

3. email and password validators must be used in script tag of the form page

4. only one entry is allowed all the time in the `credentials.json` file.

## remaining:

1. Use `credentails.txt` instead of `credentials.json`. 

2. check for the empty port, in case `3000` is engaged.
  