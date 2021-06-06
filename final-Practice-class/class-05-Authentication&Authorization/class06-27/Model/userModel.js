//npm install bcryptjs ---> password encrypt

const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role: {
    type: String,
    enum: ['user','guide', 'lead-guide','admin'], //check value
    default: 'user'
    },
    password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false // Important in security(Not show in any output)
    },
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

    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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
}));

// Password Reset functionality
userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next();  // isNEw mongoose method

  this.passwordChangedAt = Date.now() - 1000;  // this is important logic
  next();
});

userSchema.pre(/^find/, function(next){
  // this points to the current query
  this.find({ active: true });
  next();
});

// Instance Method (use login)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword); //compare password
}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
// By default false
   if(this.passwordChangedAt){
       const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10); //(Base 10)
       console.log(changedTimestamp, JWTTimestamp);
       return JWTTimestamp < changedTimestamp; // 300 < 200
   }
   // False means NOT changed
   return false;
}

// Instance method reset password
userSchema.methods.createPasswordResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
      
//    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   this.passwordResetToken = crypto.randomBytes(32).toString('hex');
   console.log(resetToken);

   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;


// {
//     "name": "hamzaali81",
//     "email": "hamza123@gmail.com",
//     "password": "pass12345",
//     "passwordConfirm": "pass12345"
// }
