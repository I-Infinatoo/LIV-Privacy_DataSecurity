const nodemailer = require('nodemailer');
const fs = require('fs');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // user: 'liv.project.final@gmail.com',
        // pass: 'eznlvpwvhdytcmht'
        user: 'herokusa81@gmail.com',
        pass: 'zdbhccqpjfeipynh'
    }
});

function sendEmailTo(filePath, name, email, callback) {
    const jsonFile=fs.readFileSync(filePath);
    // console.log(jsonFile);
    const mailText=`Hi ${name},\nPlease do not share this email.\nThe attached file contains Decryption Key.\n\nThe file is password protected and your password will be: LAST 4 CHARACTERS OF YOUR EMAIL ID (characters before '@') + FIRST 4 CHARACTER OF YOUR NAME\nFor eg. EmailId: abcd12ef@gmail.com, Name: Abcdefg Ijkl. Then the password will be 12efAbcd.\n\n\n\nRegards,\nTeam LIV`;
    let mailOptions = {
        // from: 'herokusa81@gmail.com', // sender address
        from: 'liv.project.final@gmail.com', // sender address
        bcc: [email], // list of BCC recipients
        subject: `LIV: Please find attached`, // Subject line
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
            // console.log(error);
            callback(false);
        } else {
            // console.log('Email sent: ' + info.response);
            callback(true);
        }
    });
}

module.exports = {
    sendEmailTo
};