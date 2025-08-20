import {Schema, model} from "mongoose";

const tokenSchema  = Schema({
  refreshToken: {type: String, required: true},
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
});

export default model('Token', tokenSchema);