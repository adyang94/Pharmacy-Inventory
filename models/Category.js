var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema (
  {
    name: {type: String, require: true, maxlength: 100}
  }
);

// Virtual property for drug's URL
CategorySchema
.virtual('url')
.get( function () {
  return 'cataglog/categories' + this._id;
});

// Export model
module.exports = mongoose.model('CategorySchema', CategorySchema);