var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DrugSchema = new Schema (
  {
    name: { type: String, required: true, maxlength: 100},
    description: {type: String, required: true, maxlength: 100},
    price: {type: String, required: true, maxlength: 100},
    min_qty: {type: Number, required: true, max: 10000},
    category: {type: Schema.Types.ObjectId, ref: 'CategorySchema'},
    preorder: {type: Schema.Types.ObjectId, ref: 'PreorderSchema'},
    in_stock: {type: Schema.Types.ObjectId, ref:'InstockSchema'}
  }
);

// Virtual property for drug's URL
DrugSchema
.virtual('url')
.get( function () {
  return '/catalog/drug' + this._id;
});

// Export model 
module.exports = mongoose.model('DrugSchema', DrugSchema);