const mongoose = require('mongoose');

const subCatSchema = new mongoose.Schema({
   category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
   },
   subCat:{     
    type:String,
    required:true
   }  
})

subCatSchema.virtual('id').get(function () {
  return this._id.toString();
});
subCatSchema.set('toJSON', {
  virtuals: true,
});
subCatSchema.set('toObject', {
  virtuals: true,
});

const SubCat = mongoose.models.SubCat || mongoose.model('SubCat', subCatSchema);

module.exports = SubCat;
exports.subCatSchema = subCatSchema;

//exports.Category = mongoose.model('Category', categorySchema);