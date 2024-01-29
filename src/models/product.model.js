const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  logo: {
    type: String,
    required: false,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;

