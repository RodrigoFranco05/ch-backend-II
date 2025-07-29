export default class UserDTO {
  constructor(userRaw) {
    this.id = userRaw._id ?? userRaw.id;
    this.first_name = userRaw.first_name;
    this.last_name = userRaw.last_name;
    this.email = userRaw.email;
    this.age = userRaw.age || "No se registro edad";
    this.role = userRaw.role;
    this.orders = userRaw.cart || userRaw.orders;
  }
}