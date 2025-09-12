

export default class UserDto{

  email;
  username;
  _id;
  isActivated;
  role;
  phone;
  firstName;
  lastName;
  country;
  city;


  constructor(userModel) {
    this.email = userModel.email;
    this.username = userModel.username;
    this._id = userModel._id;
    this.isActivated = userModel.isActivated;
    this.role = userModel.role;
    this.phone = userModel.phone;
    this.firstName = userModel.firstName;
    this.lastName = userModel.lastName;
    this.country = userModel.country;
    this.city = userModel.city;
  }

}