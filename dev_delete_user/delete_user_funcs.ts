// Speech Up 2018
// Function definitions for delete_user POST endpoint

import * as moment from 'moment';

// Constants
const pool = require('./lib/db');
var time_now = moment().unix(); // Current unix time in seconds


// Check to see if the ID's exist/match in the database 
export async function check_user_match(ctx, aid, uuid) {
    try {
        var result = await pool.query(`SELECT * FROM "user" WHERE aid = $1 AND uuid = $2`, [aid, uuid]);
        if (result.rows.length < 1) {
            ctx.fail('cannot delete user');
            return;
        }
    } catch (e) {
        console.log(e);
        ctx.fail(e);
        return;
    }
}

// Deletes the row of a matched user from database
export async function delete_user_db(ctx, aid, uuid) {
    try {
        var result = await pool.query(`DELETE FROM "user" WHERE aid = $1 AND uuid = $2`, [aid, uuid]);
        return;
    } catch (e) {
        console.log(e);
        ctx.fail(e);
        return;
    }
}