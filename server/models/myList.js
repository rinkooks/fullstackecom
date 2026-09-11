const mongoose = require('mongoose');

const myListSchema = new mongoose.Schema({
   productTitle:{
    type:String,
    required:true
   },
   image:{
     type:String,
     required:true
    },
   rating:{
    type:String,
    required:true
   },
   price:{
    type:Number,
    required:true
   },   
   productId:{
    type:String,
    required:true
   },
   userId:{
    type:String,
    required:true
   }
})

myListSchema.virtual('id').get(function () {
  return this._id.toString();
});
myListSchema.set('toJSON', {
  virtuals: true,
});
myListSchema.set('toObject', {
  virtuals: true,
});


exports.MyList = mongoose.model('MyList', myListSchema);

