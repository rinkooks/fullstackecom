const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   slug:{
     type:String,
     required:true,
     unique:true
   },
   images:[
    {
     type:String     
    }
   ],
   color:{
    type:String,   
   },
   parentId:{
      type:String
   }
},{timestamps:true})

categorySchema.virtual('id').get(function () {
  return this._id.toString();
});
categorySchema.set('toJSON', {
  virtuals: true,
});
categorySchema.set('toObject', {
  virtuals: true,
});

//const Category = mongoose.model('Category', categorySchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;
exports.categorySchema = categorySchema;

//exports.Category = mongoose.model('Category', categorySchema);