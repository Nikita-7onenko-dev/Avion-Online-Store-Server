import {Schema, model} from "mongoose";

const orderDetailSchema = new Schema({
  productName: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = Schema({
  email: {type: String, required: true},
  phone: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  country: {type: String, required: true},
  city: {type: String, required: true},
  address: {type: String, required: true},
  shippingMethod: {type: String, required: true},
  payment: {type: String, required: true},
  date: {type: Date, required: true},
  orderDetails: {type: [orderDetailSchema], required: true}
})

export const Order = model("Order", orderSchema);