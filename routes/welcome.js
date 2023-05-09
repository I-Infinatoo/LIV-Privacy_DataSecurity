const express = require('express');
const router = express.Router();

const path = require('path');
const multer  = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const tokenUtils = require('../utils/sessionTokenUtil');
const deleteFile = require('../utils/deleteFileUtil');

/*
 * Also, if you plan to handle large file uploads, you may want to consider using a streaming approach 
 * instead of writing the entire file to disk before processing it. The Multer middleware provides 
 * options for handling streamed uploads, which can help reduce memory usage and improve performance.
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = './UploadedFiles';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    console.log('inside the welcome route');
    
    const sessionToken = req.cookies.sessionToken;
    console.log('got token from req');

    // Check if the session token is valid
    if (tokenUtils.isValidSessionToken(sessionToken)) {
        // Render the welcome page
        console.log('varified the token');
        res.sendFile(path.join(__dirname, '../public/', 'welcomePage.html'));
    } else {
        // Redirect to the login page
        console.log('token not verified, redirecting to login route');
        // alert('Retry! Login Again');
        res.redirect('/login');
    }
});

router.post('/', upload.single('file'), function (req, res) {
    if (req.file) {
      // Get the path of the uploaded file
      const filePath = path.join(__dirname, '..', 'UploadedFiles', req.file.originalname);
      
      /**
       * Get the selected option form the form
       */ 
      const typeEncDec = req.body.typeEncDec;
      if(typeEncDec === 'encrypt') {
        console.log('Encyprion is selected');
        const option = req.body.option;
        console.log(` ::: level = ${option}`);
        
        const javaProcess = spawn('java', ['-cp', './javaProgram', 'encryptionJava', filePath, option]);
        let dataReceivedFromProgram='';

        javaProcess.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
          dataReceivedFromProgram+=data.toString();
        });
  
        javaProcess.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
  
        javaProcess.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          // res.send(`File uploaded and processed successfully. Path of the copied file: ${filePath}`);
          // res.send(`File uploaded and processed successfully.<br>${dataReceivedFromProgram}`);
          
          // delete the uploaded file only after the java program finishes its work
        //   fs.unlink(filePath, (err) => {
        //     if (err) {
        //       console.error(err);
        //       return;
        //     }
          
        //     console.log(`${filePath} is deleted`);
        // })
        console.log(`file uploaded and now deleting file: ${filePath}`);
        deleteFile.checkAndDeleteFile(filePath);

          //provide the link to home page  
        //   res.send(`<div id="message">${dataReceivedFromProgram}</div>
        //   <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>

        //   <script>
        //     document.getElementById("message").style.color = "black";
            
        //     const link = document.createElement("link");
        //     link.rel = "stylesheet";
        //     link.type = "text/css";
        //     link.href = "/css/style.css";
        //     document.head.appendChild(link);
        //   </script>
        // `);
          res.status(200).send(`
            <html>
              <head>
                <title>LIV: Status</title>
                <link rel="stylesheet" type="text/css" href="/css/style.css">
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

        });
  
     } else if (typeEncDec == 'decrypt') {
        console.log('Decyption is selected');
  
        const javaProcess = spawn('java', ['-cp', './javaProgram', 'decryptionJava', filePath]);
        let dataReceivedFromProgram='';

        javaProcess.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
          dataReceivedFromProgram+=data.toString();
        });
  
        javaProcess.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
  
        javaProcess.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          // res.send(`File uploaded and processed successfully. Path of the copied file: ${filePath}`);
          // res.send(`File uploaded and processed successfully.<br>${dataReceivedFromProgram}`);

          // delete the uploaded enc file
        //   fs.unlink(filePath, (err) => {
        //     if (err) {
        //       console.error(err);
        //       return;
        //     }
          
        //     console.log(`${filePath} is deleted`);
        // })
        console.log(`uploaded enc. file and now deleting file: ${filePath}`);
        deleteFile.checkAndDeleteFile(filePath);

          // provide the link to home page
        //   res.send(`<div id="message">${dataReceivedFromProgram}</div>
        //     <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>

        //   <script>
        //     document.getElementById("message").style.color = "black";
            
        //     const link = document.createElement("link");
        //     link.rel = "stylesheet";
        //     link.type = "text/css";
        //     link.href = "/css/style.css";
        //     document.head.appendChild(link);
        //   </script>
        // `);
        res.status(200).send(`
        <html>
          <head>
            <title>LIV: Status</title>
            <link rel="stylesheet" type="text/css" href="/css/style.css">
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
        });
      }
  
      /** 
       * 
      // // Run the Java program and pass the file path as a command line argument
      // const javaProcess = spawn('java', ['-cp', 'javaProgram', 'tryTryClass', filePath]);
  
      // javaProcess.stdout.on('data', (data) => {
      //   console.log(`stdout: ${data}`);
      // });
  
      // javaProcess.stderr.on('data', (data) => {
      //   console.error(`stderr: ${data}`);
      // });
      
      // javaProcess.on('close', (code) => {
      //   console.log(`child process exited with code ${code}`);
      //   res.send(`File uploaded and processed successfully. Path of the copied file: ${filePath}`);
  
      //   // delete the uploaded file only after the java program finishes its work
      //   fs.unlink(filePath, (err) => {
        //     if (err) {
      //       console.error(err);
      //       return;
      //     }
      
      //     console.log(`${filePath} was deleted`);
      //   })
      // });
      
      // // Copy the uploaded file to a new file
      // fs.copyFileSync(uploadedFilePath, copiedFilePath);
      
      // const fileExtension = path.extname(filePath);
      // console.log(`File ext: ${fileExtension}`);
      
      // const fileNameWithoutExtension = path.basename(filePath, fileExtension);
      // console.log(`File without ext: ${fileNameWithoutExtension}`);
      
      // const copyFilePath = path.join(__dirname, 'UploadedFiles', `${fileNameWithoutExtension}_copy${fileExtension}`);
      // console.log(`Copy file path: ${copyFilePath} \nFile path: ${filePath}`);
      
      // fs.copyFile(filePath, copyFilePath, (err) => {
        //   if (err) {
          //     console.error(`Error copying file: ${err}`);
          //     return;
          //   }
          
          //   console.log(`File copied to ${copyFilePath}`);
          //   res.send(`File uploaded successfully. Copied file path: ${copyFilePath}`);
          // });
          
          // fs.copyFileSync(filePath, copyFilePath);
          
          //IMPORTANT delete file only after java program completion, currently due to async nature
          //route is deleting file before java could use it
          
          */
    
    }
    else {
      // res.send('No file was uploaded.');
      // res.render('upload', { message: 'No file was uploaded.', output: '' });
      // 400 Bad Request
      res.status(400).send(`
      <html>
        <head>
          <title>LIV: Status</title>
          <link rel="stylesheet" type="text/css" href="/css/style.css">
        </head>
        <body>
          <div id="message">No file was uploaded.</div>
          <p id="first">Back to<a href="/welcomePage.html"> Home</a></p>
          <script>
            document.getElementById("message").style.color = "black";
          </script>
        </body>
      </html>
    `);
    }
  });

module.exports = router