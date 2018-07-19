// Speech Up 2018
// index.ts - dev_delete_user
// Deletes a user from the database
// tsc -w to compile
// Path - https://dev.api.speechup.com/auth/delete-user
// Type - GET
// Access_token required : true
// Params - access_token, aid (string) , uuid (string), udid (string)

// Dependencies
import {Handler} from 'aws-lambda';
import jwt from 'jsonwebtoken';
var access_token_funcs = require('./lib/verify_access_token');
var funcs = require('./delete_user_funcs');

// Constants
import * as pool from './lib/db';
const constants = require('./lib/constants');
const config = require('./lib/config');
const SUCCESS = 201;
const BAD_TOKEN = 89

// Main
const handle: Handler = async (e, ctx, callback) => {

  try {

    // Ensure all inputs were passed
    if (e.Authorization === undefined || e.aid === "" ||
      e.udid === "" || e.uuid === "") {
      ctx.fail(BAD_TOKEN);
      return;
    }

    // Ensure all inputs have a length between 1-100
    if ((aid.length < 1 || aid.length > 100) ||
      (uuid.length < 1 || uuid.length > 100) ||
      (udid.length < 1 || udid.length > 100)) {
      ctx.fail(BAD_TOKEN);
      return;
    }

    // Variable declarations and assignments
    const Authorization = e.Authorization;
    var uuid = e.uuid
    var udid = e.udid;
    var aid = e.aid;

    // Verify access token
    access_token_funcs.verify_access_token(ctx, Authorization, aid, udid).then( async function (valid) {

      // If the token is not valid
      if (!valid) {
        ctx.fail(BAD_TOKEN);
        return;
      }

      // Check to see if the ID's exist/match in the database 
      await funcs.check_user_match(ctx, aid, uuid);

      // Deletes the row of a matched user from database
      await funcs.delete_user_db(ctx, aid, uuid);
      ctx.succeed(SUCCESS);

    });
  } catch (e) {
    console.log(e);
    ctx.fail(e);
    return;
  }
}
