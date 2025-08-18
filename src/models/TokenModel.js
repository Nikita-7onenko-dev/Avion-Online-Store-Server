import {Schema, model} from "mongoose";

const tokenSchema  = Schema({
  refreshToken: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
});

export default model('Token', tokenSchema);