import {Schema, model} from "mongoose";

const userSchema  = Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  username: {type: String, required: true},

  phone: String,
  firstName: String,
  lastName: String,
  country: String,
  city: String,

  role: {type: String, enum: ["Customer", "Admin"], default: "Customer", required: true },
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String}
}, {timestamps: true});

export default model('User', userSchema);