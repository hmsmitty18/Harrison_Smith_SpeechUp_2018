// Speech Up 2018


// Dependencies
const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const moment = require('moment');

//Create data base connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'speechup-dev'
});

//create local host connection
const app = express();
app.listen('1337', () => {
    console.log('Server started on port 1337');
});

//connect to the db and console.log 'connected'
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected...');
})

//create global variables

//This post will check the database for an existing account with the specified email address
//It will then update the fpid and fptime and add them to the database
//It will finally generate and email the user a URL to reset his password
app.post('/forgotpassword', (req, res) => {

    var forgotPassId;
    var fptime;
    var email;

    //set the email variable to the 'email' parameter
    email = req.query.email;

    //insure they are strings
    if (typeof email != 'string') {
        res.send('89');
        return;
    }
    //insure length between 1 and 100
    if ((email.length < 1 || email.length > 100)) {
        res.send('89');
        return;
    }

    //Checks to see if the user exists by seeing whether anything is returned from this call

    let check_exists = db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length < 1) {
            res.send('Incorrect email was entered. Please try again.');
            return;
        }
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail', //change this
                auth: {
                    user: 'speechuptesting@gmail.com', // generated ethereal user
                    pass: 'Thisisjustatest123' // generated ethereal password
                }
            });

            forgotPassId = Math.floor(Math.random() * 1000000000);
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"noreply@speechup.com" <speechuptest@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: 'Forgot Password', // Subject line
                text: `hello`, // plain text body
                html: `<b> Click on this </b> <a href="https://www.speechup.com/forgotpassword/${forgotPassId}"> link</a> <b>  to reset your password. This link will expire 30 minutes after this email was sent. </b>` // html body
            };

            
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        })
        
        fptime = moment().unix();
        let update_db = db.query(`UPDATE user SET fpid = '${forgotPassId}', fptime = '${fptime}' WHERE email = '${email}'`, (err, result) => {
            if (err) throw err;
            res.send('201');
        });
    });
});