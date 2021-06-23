const mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcryptjs');

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
   name: {
    type: String,
    required: [true,'Please tell us your name']
   },

   email: {
       type: String,
       required: [true, 'Please provide your email'],
       unique: true,
       lowercase: true,
       validate: [validator.isEmail, 'Please provide a valid email']
   },
   photo: String,
   password: {
       type: String,
       required: [true, 'Please provide a password'],
       minlength: 8,
       select: false  // never show in db
   
   },
   passwordConfirm: {
       type: String,
       required: [true, 'Please confirm your password'],
       validate: {
           // This only works on CREATE and SAVE!!!
           validator: function(el){
             return el === this.password  // abc === abc
           },
           message: 'Passwords are not the same!'
       }
   }
})

// mongoose middleware pre-save middleware
userSchema.pre('save', async function(next){
    // Only run this function if password is modified
    if(!this.isModified('password')){
        return next()
    }

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// instance method available of all certain collection
userSchema.methods.correctPassword =async function(
    candiatePassword, userPassword
    ){
    // return true or false
    //   this.password 
    return await bcrypt.compare(candiatePassword, userPassword)
    // return await bcrypt.compare(originalPassword, hashPassword)
  
};

const User = mongoose.model('User',userSchema);

module.exports = User;