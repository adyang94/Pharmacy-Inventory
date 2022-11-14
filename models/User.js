var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model( "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    // admin: { type: Boolean, required: false }
  })
);

