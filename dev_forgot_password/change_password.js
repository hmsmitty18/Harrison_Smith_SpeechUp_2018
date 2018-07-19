// Speech Up 2018

// Dependencies
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

//Create data base connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'speechup-dev'
});

//create local host connection
const app = express();
app.listen('1600', () => {
    console.log('Server started on port 1600');
});

//connect to the db and console.log 'connected'
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected...');
})


//This post request checks to see how much time has passed since the user orignally pressed forgot password
//If it was within allowed time, it loads page, if not, it does not load the page 
app.post(`/uploadpassword/`, (req, res) => {
    var fpid = req.query.fpid;
    var password = req.query.password;
    try {
        bcrypt.hash(password, 10, (h_err, hash) => {
            if (h_err) {
                res.send("Error hashing password");
                return;
              }
              password = hash;
            let check_exists = db.query(`SELECT * FROM user WHERE fpid = '${fpid}'`, (err, result) => {
                if (result === null) {
                    res.send('89');
                }
                if (result.length < 1) {
                    res.send('89');
                    return;
                }
                //Check the time before updating the password

                //This retreives the information from the db to check the time
                let update = db.query(`UPDATE user SET password = '${password}' WHERE fpid = '${fpid}'`, (err, result) => {
                    console.log(password);
                    res.send('201');
                });
            });
        });
    } catch (err) {
        console.log(err);
        res.send(err);
        return;
    }
});