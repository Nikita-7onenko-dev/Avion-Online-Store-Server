import {Schema, model} from "mongoose";

const userSchema  = Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String}
});

export default model('User', userSchema);