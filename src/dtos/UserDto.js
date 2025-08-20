

export default class UserDto{
  email;
  _id;
  isActivated;
  constructor(userModel) {
    this.email = userModel.email;
    this._id = userModel._id;
    this.isActivated = userModel.isActivated;
  }

}