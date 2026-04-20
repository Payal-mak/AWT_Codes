class User {
  constructor(id, name, email, password, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'student'; // 'student' or 'librarian'
  }
}
module.exports = User;
