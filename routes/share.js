const express = require('express');
const router = express.Router();

const path = require('path');
const multer  = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');

// for input sanitization against XSS
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const tokenUtils = require('../utils/sessionTokenUtil');
const emailUtils = require('../utils/sendEmailUtil');
const {protectWithPassword, removePassword, createPassword} = require('../utils/filePasswordUtil');
const deleteFile = require('../utils/deleteFileUtil');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './UploadedFiles';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'keyFile' || file.fieldname === 'receivedFile' || file.fieldname === 'encFile') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});


router.get('/', (req, res) => {
  // first verify the token, then move further 
  const sessionToken = req.cookies.sessionToken;
    console.log('got token from req');

    // Check if the session token is valid
    if (tokenUtils.isValidSessionToken(sessionToken)) {
        res.sendFile(path.join(__dirname, '/../public/share.html'));
    } else {
        // Redirect to the login page
        console.log('token not verified, redirecting to login route');
        // alert('Retry! Login Again');
        res.redirect('/login');
    }
});

router.post('/', upload.fields([
        {name: 'keyFile', optional: true}, 
        {name: 'receivedFile', optional: true}, 
        {name: 'encFile', optional: true}
    ]), (req, res) => {

    console.log('inside the share route');
    let { sendOrDec, email, name, keyFilePassphrase } = req.body;
    
    // sanitize
    email = DOMPurify.sanitize(email);
    name = DOMPurify.sanitize(name);
    keyFilePassphrase = DOMPurify.sanitize(keyFilePassphrase);

    // Handle multiple file upload
    const keyFile = req.files ? req.files.keyFile : null;
    const receivedFile = req.files ? req.files.receivedFile : null;
    const encFile = req.files ? req.files.encFile : null;
   
    // get the path of the files
    const keyFilePath = keyFile ? path.join(__dirname, '..', keyFile[0].path) : null;
    const receivedFilePath = receivedFile ? path.join(__dirname, '..', receivedFile[0].path) : null;
    const encFilePath = encFile ? path.join(__dirname, '..', encFile[0].path) : null;
    

    // if selected to send the file
    if(sendOrDec === 'sendFile') {
        // 1. call the `send`-java class
        // 2. when class is executed, secure the `*.json` file with the passphrase
        // 3. delete the uploaded enc_file
        // 4. email the `*.json` file to the recipient
        console.log('selected to send');
        console.log(`encFilePath: ${encFilePath}`);
        
        // 1. call the `send`-java class
        // java-program will return the key-file-name 
        const javaProcess = spawn('java', ['-cp', './javaProgram', 'send', encFilePath]);
        let dataReceivedFromProgram=null;

        javaProcess.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
          dataReceivedFromProgram=data.toString().trim(); 
          dataReceivedFromProgram = path.join(__dirname, '/../UploadedFiles', dataReceivedFromProgram);
        });
        
        javaProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        
        javaProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            
            let filePath=dataReceivedFromProgram;
            filePath=filePath.replace(/\\/g, '\\\\');
            
            // protect the file
            protectWithPassword(filePath, createPassword(email, name), (PassSuccess) => {

                if(PassSuccess) {
                  emailUtils.sendEmailTo(filePath, name, email, (emailSuccess) => {
                    if(emailSuccess) {
                      // if successfully sended the email, then delete the file
                      // fs.unlink(filePath, (err) => {
                      //   if (err) {
                      //     console.error(err);
                      //     return;
                      //   }
                      
                      //   console.log(`${filePath} is deleted`);
                      // })
                      console.log(`sent email and now deleting file: ${filePath}`);
                      deleteFile.checkAndDeleteFile(filePath);
                      // provide the link for home page
                        // res.send(`<div id="message">${dataReceivedFromProgram}<br>Email sent to ${email}</div>
                        // <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>

                        // <script>
                        // document.getElementById("message").style.color = "black";
                        
                        // const link = document.createElement("link");
                        // link.rel = "stylesheet";
                        // link.type = "text/css";
                        // link.href = "/css/style.css";
                        // document.head.appendChild(link);
                        // </script>
                        // `);
                        res.status(200).send(`
                        <html>
                          <head>
                            <title>LIV: Status</title>
                            <link rel="stylesheet" type="text/css" href="/css/route.css">
                          </head>
                          <body>
                            <div id="message">${dataReceivedFromProgram}<br>Email sent to ${email}</div>
                            <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>
                            <script>8
                              document.getElementById("message").style.color = "black";
                            </script>
                          </body>
                        </html>
                      `);
                      } else {

                        // if not able to send the email, delete the generated file
                        // fs.unlink(filePath, (err) => {
                        //   if (err) {
                        //     console.error(err);
                        //     return;
                        //   }
                        
                        //   console.log(`${filePath} is deleted`);
                        // })
                        console.log(`no email sent and now deleting file: ${filePath}`);
                        deleteFile.checkAndDeleteFile(filePath);
                            // res.send(`<div id="message">Error in sending email.</div>
                            // <p id="first">Back to<a href="/share.html"> Share</a></p>

                            // <script>
                            // document.getElementById("message").style.color = "black";
                            
                            // const link = document.createElement("link");
                            // link.rel = "stylesheet";
                            // link.type = "text/css";
                            // link.href = "/css/style.css";
                            // document.head.appendChild(link);
                            // </script>
                            // `);
                            // 503 Service Unavailable
                            res.status(503).send(`
                            <html>
                              <head>
                                <title>LIV: Status</title>
                                <link rel="stylesheet" type="text/css" href="/css/route.css">
                              </head>
                              <body>
                                <div id="message">Error in sending email.</div>
                                <p id="first">Back to<a href="/share.html"> Share</a></p>
                                <script>
                                  document.getElementById("message").style.color = "black";
                                </script>
                              </body>
                            </html>
                          `);
                        }
                    });
                } else {
                  // if failed to protect the file, then delete the generated key file
                  // fs.unlink(filePath, (err) => {
                  //   if (err) {
                  //     console.error(err);
                  //     return;
                  //   }
                  
                  //   console.log(`${filePath} is deleted`);
                  // })
                  console.log(`unable to protect file and now deleting file: ${filePath}`);
                  deleteFile.checkAndDeleteFile(filePath);

                  // res.send(`<div id="message">Error occured while protecting file.</div>
                  //   <p id="first">Back to<a href="/share.html"> Share</a></p>

                  // <script>
                  // document.getElementById("message").style.color = "black";
                  
                  // const link = document.createElement("link");
                  // link.rel = "stylesheet";
                  // link.type = "text/css";
                  // link.href = "/css/style.css";
                  // document.head.appendChild(link);
                  // </script>
                  // `);
                  // 501 Not Implemented
                  res.status(501).send(`
                  <html>
                    <head>
                      <title>LIV: Status</title>
                      <link rel="stylesheet" type="text/css" href="/css/route.css">
                    </head>
                    <body>
                      <div id="message">Error occured while protecting file.</div>
                      <p id="first">Back to<a href="/share.html"> Share</a></p>
                      <script>
                        document.getElementById("message").style.color = "black";
                      </script>
                    </body>
                  </html>
                `);
                }  
                
            });
        });
    }
    // if selected to decrypt the received file 
    else if(sendOrDec === 'decryptFile') {
        // 1. unlock the key file with the provided passphrase
        // 2. call the `decrypt`-java class
        // 3. display the output(decFilePath)

        // remove the password from the Key file
        removePassword(keyFilePath, keyFilePassphrase, (passSuccess) => {
          if(passSuccess) {
            // decrypt the enc_file
            const javaProcess = spawn('java', ['-cp', './javaProgram', 'decrypt', receivedFilePath, keyFilePath]);
            let dataReceivedFromProgram=null;

            javaProcess.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
              dataReceivedFromProgram=data.toString(); 
              dataReceivedFromProgram = path.join(__dirname, '/../UploadedFiles', dataReceivedFromProgram);
            });
            
            javaProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
            
            javaProcess.on('close', (code) => {
              console.log(`child process exited with code ${code}`);

              protectWithPassword(keyFilePath, keyFilePassphrase, (isEncrypted)=>{
                if(isEncrypted) {
                  // after dec. provide the link to home page
                  // res.send(`<div id="message">${dataReceivedFromProgram}</div>
                  // <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>

                  //   <script>
                  //   document.getElementById("message").style.color = "black";
                    
                  //   const link = document.createElement("link");
                  //   link.rel = "stylesheet";
                  //   link.type = "text/css";
                  //   link.href = "/css/style.css";
                  //   document.head.appendChild(link);
                  //   </script>
                  // `);
                  res.status(200).send(`
                  <html>
                    <head>
                      <title>LIV: Status</title>
                      <link rel="stylesheet" type="text/css" href="/css/route.css">
                    </head>
                    <body>
                      <div id="message">${dataReceivedFromProgram}</div>
                      <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>
                      <script>
                        document.getElementById("message").style.color = "black";
                      </script>
                    </body>
                  </html>
                `);
                } else {
                    // after decryption, remove the unlocked keyfile
                    // fs.unlink(keyFilePath, (err) => {
                    //   if (err) {
                    //     console.error(err);
                    //     return;
                    //   }
                    
                    //   console.log(`${filePath} is deleted`);
                    // })
                    console.log(`after dec. and now deleting file: ${keyFilePath}`);
                    deleteFile.checkAndDeleteFile(keyFilePath);
                }
              })
            });
          } else {
            // if invalid password then send the link to go back
            // res.send(`<div id="message">Invalid Password or Key file</div>
            //           <p id="first">Back to<a href="/share.html"> Share</a></p>
            //               <script>
            //               document.getElementById("message").style.color = "black";
                          
            //               const link = document.createElement("link");
            //               link.rel = "stylesheet";
            //               link.type = "text/css";
            //               link.href = "/css/style.css";
            //               document.head.appendChild(link);
            //               </script>
            //   `);
            // 401 Unauthorized
            res.status(401).send(`
            <html>
              <head>
                <title>LIV: Status</title>
                <link rel="stylesheet" type="text/css" href="/css/route.css">
              </head>
              <body>
                <div id="message">Invalid Password or Key file</div>
                <p id="first">Back to<a href="/share.html"> Share</a></p>
                <script>
                  document.getElementById("message").style.color = "black";
                </script>
              </body>
            </html>
          `);
          }
        })
    }
});

module.exports=router;
