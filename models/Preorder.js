var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PreorderSchema = new Schema (
  {
    preorder: { type: Boolean, required: true}
  }
);

// Virtual property of InStock URL
PreorderSchema
.virtual('url')
.get ( function () {
  return '/catalog/instock' + this._id;
});

// Export model
module.exports = mongoose.model('PreorderSchema', PreorderSchema);