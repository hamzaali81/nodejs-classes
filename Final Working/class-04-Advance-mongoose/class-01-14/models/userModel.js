const mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcryptjs');
const crypto = require('crypto'); 

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
   role: {
       type: String,
       enum: ['user', 'guide', 'lead-guide', 'admin'],
       default: 'user'
   },
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

userSchema.pre(/^find/, function(next){
   // this points to the current query
//    this.find({ active: true })
   this.find({ active: {$ne: false} })
   next();
});

// resetPassword

userSchema.pre('save', function(next){
   if(!this.isModified('password') || this.isNew) return next();
   
   this.passwordChangedAt = Date.now() - 1000;
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

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    // console.log('this.passwordChangedAt',this.passwordChangedAt);
  if(this.passwordChangedAt){
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
//    console.log(changedTimestamp, JWTTimestamp);
//    console.log('this.passwordChangedAt', passwordChangedAt);
   return JWTTimestamp < changedTimestamp; // 100 < 200
  }
  
    // False means NOT changed
    return false
};

userSchema.methods.createPasswordResetToken = function(){
   const resetToken = crypto.randomBytes(32).toString('hex');
    
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   console.log({resetToken}, this.passwordResetToken);
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   
   return resetToken;
}; 


const User = mongoose.model('User',userSchema);

module.exports = User;  