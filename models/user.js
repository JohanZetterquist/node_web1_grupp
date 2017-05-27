const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schema for user model
const UserSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true }
});

//Hook that runs before save to hash and salt password
UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next()
  bcrypt.genSalt((error, salt) => {
    if (error) return next(error)
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)
      user.password = hash;
      next()
    });
  });
});

//Method for checking if given password is correct
UserSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.password, (error, match) => {
    if (error) return callback(error)
    callback(null, match);
  });
}

module.exports = mongoose.model('User', UserSchema);
