const crypto = require('crypto');
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
    role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide','admin'],
    default: 'user'
    },
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
            //This only works CREATE and SAVE()!!!
            validator: function(el) {
                return el === this.password
            },
            message: 'Password are not same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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
  userSchema.pre('save',function(next){
if(!this.isModified('password')|| this.isNew) return next();
this.passwordChangedAt = Date.now()-1000;
next();
  })

  userSchema.pre(/^find/, function(next){
      // this points to the current query
      this.find({ active: {$ne: false} });
      next();
  })

userSchema.methods.correctPassword = async(candiatePassword, userPassword)=>{
    return await bcrypt.compare(candiatePassword, userPassword)

}

userSchema.methods.changesPasswordAfter = function(JWTTimestamp){
    if (this.passwordChangedAt){
       const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }
    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function(){
 const resetToken = crypto.randomBytes(32).toString('hex');

 this.passwordResetToken = crypto
 .createHash('sha256')
 .update(resetToken)
 .digest('hex');
 
 console.log({resetToken}, this.passwordResetToken);
 this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
 return resetToken;
};

const User = mongoose.model('User',userSchema);

module.exports = User;