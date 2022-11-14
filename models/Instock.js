var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InstockSchema = new Schema (
  {
    in_stock: { type: Boolean, required: true}
  }
);

// Virtual property of InStock URL
InstockSchema
.virtual('url')
.get ( function () {
  return '/catalog/instock' + this._id;
});

// Export model
module.exports = mongoose.model('InstockSchema', InstockSchema);