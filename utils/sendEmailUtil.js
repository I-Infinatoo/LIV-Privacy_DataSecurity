const nodemailer = require('nodemailer');
const fs = require('fs');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'liv.project.final@gmail.com',
        pass: 'eznlvpwvhdytcmht'
    }
});

function sendEmailTo(filePath, name, email, callback) {
    // const jsonFile=fs.readFileSync(filePath);
    // const jsonFile=fs.readFileSync('C:\\Users\\ishu1\\OneDrive\\Desktop\\GULAM\\testFolder\\testProject_liv\\UploadedFiles\\notes_enc.json');
    const jsonFile=fs.readFileSync('C:\\Users\\ishu1\\OneDrive\\Desktop\\GULAM\\testFolder\\testProject_liv\\UploadedFiles\\tempFile.json');
    const mailText=`Hi ${name},\nPlease find the attached JSON file.\nThe file is password protected (name+email).`;

    let mailOptions = {
        from: 'liv.project.final@gmail.com', // sender address
        bcc: [email], // list of BCC recipients
        subject: `PFA Keys`, // Subject line
        text: mailText, // plain text body
        attachments: [
            {
                filename: 'Key.json',
                content: jsonFile
            }
        ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            callback(false);
        } else {
            console.log('Email sent: ' + info.response);
            callback(true);
        }
    });
}

module.exports = {
    sendEmailTo
};