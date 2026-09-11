const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name:{
       type: String,
       required: true
    },
    phone:{
       type: String,
       default: "",
       unique: true,
       sparse: true
    },
    email:{
       type: String,
       required: true,
       unique: true
    },
    password:{
       type: String,
      // required: true
    },
    images:[
    {
     type:String,
     required:true
    }
   ],
   isAdmin:{
       type: Boolean,
       default: false
   },
   isVerified:{
      type: Boolean,
      default: false
   },
   otp:{
      type:String
   },
   otpExpires:{
      type:Date
   },
   date:{
      type: Date,
      default: Date.now
   } 
},{timeStamps:true})

UserSchema.virtual('id').get(function () {
  return this._id.toString();
});
UserSchema.set('toJSON', {
  virtuals: true,
});
UserSchema.set('toObject', {
  virtuals: true,
});

exports.User = mongoose.model('User', UserSchema);