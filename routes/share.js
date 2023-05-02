const express = require('express');
const router = express.Router();

const path = require('path');
const multer  = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');

const tokenUtils = require('../utils/sessionTokenUtil');
const emailUtils = require('../utils/sendEmailUtil');
const {protectWithPassword, removePassword, createPassword} = require('../utils/filePasswordUtil');


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
    const { sendOrDec, email, name, keyFilePassphrase } = req.body;
    // Handle multiple file upload
    const keyFile = req.files ? req.files.keyFile : null;
    const receivedFile = req.files ? req.files.receivedFile : null;
    const encFile = req.files ? req.files.encFile : null;
   
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

                    emailUtils.sendEmailTo(filePath, name, email, (success) => {
                        if(success) {
                        res.send(`<div id="message">${dataReceivedFromProgram}<br>Email sent to ${email}</div>
                        <script>
                        document.getElementById("message").style.color = "black";
                        
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.type = "text/css";
                        link.href = "/css/style.css";
                        document.head.appendChild(link);
                        </script>
                        `);
                        } else {
                            res.send(`<div id="message">Email not sent.</div>
                            <script>
                            document.getElementById("message").style.color = "black";
                            
                            const link = document.createElement("link");
                            link.rel = "stylesheet";
                            link.type = "text/css";
                            link.href = "/css/style.css";
                            document.head.appendChild(link);
                            </script>
                            `);
                        }
                    });
                } else {
                  res.send('Error protecting file');
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

              // after decryption, remove the unlocked keyfile
              res.send(`<div id="message">${dataReceivedFromProgram}</div>
                          <script>
                          document.getElementById("message").style.color = "black";
                          
                          const link = document.createElement("link");
                          link.rel = "stylesheet";
                          link.type = "text/css";
                          link.href = "/css/style.css";
                          document.head.appendChild(link);
                          </script>
              `);
            });
          } else {
            res.send(`<div id="message">Invalid Password or Key file</div>
                          <script>
                          document.getElementById("message").style.color = "black";
                          
                          const link = document.createElement("link");
                          link.rel = "stylesheet";
                          link.type = "text/css";
                          link.href = "/css/style.css";
                          document.head.appendChild(link);
                          </script>
              `);
          }
        })
    }
});

module.exports=router;
