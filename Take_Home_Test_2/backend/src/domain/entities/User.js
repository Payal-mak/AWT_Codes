class User {
  constructor({ id, name, email, password, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // Hashed password
    this.role = role || 'student'; // Default role, could be 'student' or 'librarian'
  }
}

module.exports = User;
