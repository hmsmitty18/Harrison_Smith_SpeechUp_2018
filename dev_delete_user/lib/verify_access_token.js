// Speech Up 2017
// Functions for verifying an access_token
// Params - access_token (str)

// Dependencies
var q = require('q');
var jwt = require('jsonwebtoken');

// Constants
const GOOD_TOKEN = 200;
const BAD_TOKEN = 89 // https://dev.twitter.com/overview/api/response-codes
const config = require('./config');

// Declare export
var exports = module.exports = {};

// Bool : true if access_token is ok, ctx.fail() otherwise
exports.verify_access_token = function(ctx, access_token, aid, udid) {

  var deferred = q.defer();

  // Verify the token
  jwt.verify(access_token, config.secret, function(err, decoded) {

    // If verification of token fails
    if (err) {
      ctx.fail(BAD_TOKEN);
      return;
    }

    // Make sure aid and udid match up with the token's
    if (aid !== decoded.aid || udid !== decoded.udid) {
      ctx.fail(BAD_TOKEN);
      return;
    }

    // Otherwise, token is good
    deferred.resolve(true);

  });

  return deferred.promise;

};
