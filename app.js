const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host       :'localhost',
    user       :'root',
    password   :'12345678',
    database   :'speechup-dev'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Connected...');
})

const app = express();

app.post('/deleteuser', (req, res) => {
    let aid = req.query.aid;
    let uuid = req.query.uuid;

    //insure they are strings
    if(typeof aid != 'string' || typeof uuid != 'string'){
        res.send('89');
        return;
    }
    //insure length between 1 and 100
    if((aid.length < 1 || aid.length > 100) ||
     (uuid.length < 1 || uuid.length > 100) ){
        res.send('89');
        return;
    }

    let check_aid = db.query(`SELECT * FROM user WHERE aid = ${aid} AND uuid = ${uuid}`, (err, result) => {
        if(err) throw err; 
        console.log(result);
        
        if(result.length < 1){
            res.send('89');
            return;
        }
        let sql =  `DELETE FROM user WHERE aid = ${aid} AND uuid = ${uuid}`;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('201');
        });
    }); 
});


app.listen('1337', () => {
    console.log('Server started on port 1337');
});
