// Speech Up 2018

// Dependencies
const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const axios = require('axios');

//Create data base connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'speechup-dev'
});

//create local host connection
const app = express();
app.listen('1500', () => {
    console.log('Server started on port 1500');
});

//connect to the db and console.log 'connected'
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected...');
})
 
//This get request calls the post request which determines whether to load the reset link or not
app.get('/forgotpassword/:fpid', async (req, res) => {
    try {
        var fpid = req.params.fpid;
        //This calls the post request below using an axios call
        const id = await axios.post(`http://localhost:1500/checkfptime/?fpid=${fpid}`);
        console.log(id.data);
        if(id.data != '201'){
            res.sendFile('/time_exp.html', { root : __dirname});
        } 
        res.sendFile('/reset_pass.html', { root : __dirname});
        
    } catch (err) {
        console.log(err);
        return;
    }
});

//This post request checks to see how much time has passed since the user orignally pressed forgot password
//If it was within allowed time, it loads page, if not, it does not load the page 
app.post(`/checkfptime/`, (req, res) => {
    try {
        var fpid = req.query.fpid;
        //This retreives the information from the db to check the time
        let check = db.query(`SELECT fptime FROM user WHERE fpid = ${fpid}`, (err, result) => {
            console.log(result);
            if(result === null){
                res.send('89');
                return;
            }
            if (result.length < 1) {
                res.send('89');
                return;
            }
            var currentTime = moment().unix();
            //This checks to see if 30 minutes have passed
            if (((currentTime - result[0].fptime) / 60) > 30 || currentTime < result[0].fptime) {
                res.send('89');
                return;
            }
            res.send('201');
        })
    } catch (err) {
        console.log(err);
        res.send(err);
        return;
    }
});