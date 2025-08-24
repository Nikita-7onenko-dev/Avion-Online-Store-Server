import {Schema, model} from "mongoose";

const userSchema  = Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  username: {type: String, required: true},
  phone: { type: String },
  role: {type: String, enum: ["User", "Admin"], default: "User", required: true },
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String}
}, {timestamps: true});

export default model('User', userSchema);