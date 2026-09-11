const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
   quantity:{
    type:Number,
    required:true
   },
   subTotal:{
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

cartSchema.virtual('id').get(function () {
  return this._id.toString();
});
cartSchema.set('toJSON', {
  virtuals: true,
});
cartSchema.set('toObject', {
  virtuals: true,
});


exports.Cart = mongoose.model('Cart', cartSchema);

