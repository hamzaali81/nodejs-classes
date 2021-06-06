//npm install bcryptjs ---> password encrypt

const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcryptjs');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name : {
        type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please Provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']


    },
    photo: String,
    password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false // Important in security
    },
    // Managing passwords
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el){
               return el === this.password;
            },
        message: 'Password are not the same'

        }

    }
});

userSchema.pre('save', (async function(next) {
    // Only runs this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete PasswordConfirm field
    this.passwordConfirm = undefined;
    next();
}))

const User = mongoose.model('User', userSchema);
module.exports = User;


// {
//     "name": "hamzaali81",
//     "email": "hamza123@gmail.com",
//     "password": "pass12345",
//     "passwordConfirm": "pass12345"
// }
