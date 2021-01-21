const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


// name , email , photo , passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tells us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provider  valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate:{
            //This only works create and save
            validator: function(el) {
                return el === this.password
            },
            message: 'Password are not same'
        }
    }

})

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 10);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });

userSchema.methods.correctPassword = async(candiatePassword, userPassword)=>{
    return await bcrypt.compare(candiatePassword, userPassword)

}

const User = mongoose.model('User',userSchema);

module.exports = User;