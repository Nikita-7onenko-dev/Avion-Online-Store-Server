import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {type: String, required: true},
  productType: {type: Array, required: true},
  category: {type: Array, required: true},
  designer: {type: String, required: true},
  price: {type: Number, required: true},
  dateAdded: {type: Date, required: true},
  popularityScore: {type: Number, required: true},
  description: {type: String, required: true},
  features: {type: Array},
  height: {type: Number, required: true},
  width: {type: Number, required: true},
  depth: {type: Number, required: true},
  image: {type: String, required: true},
  aspectRatio: {type: String, required: false}
}).index(
  {name: 1, designer: 1}, {unique: true}
);

export default mongoose.model('ProductModel', productSchema, 'products');