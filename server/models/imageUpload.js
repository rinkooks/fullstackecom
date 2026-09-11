const mongoose = require('mongoose');

const imageUploadSchema = new mongoose.Schema({  
  images:[
    {
     type:String,
     required:true
    }
  ]   
})

imageUploadSchema.virtual('id').get(function () {
  return this._id.toString();
});
imageUploadSchema.set('toJSON', {
  virtuals: true,
});
imageUploadSchema.set('toObject', {
  virtuals: true,
});

const ImageUpload = mongoose.models.ImageUpload || mongoose.model('ImageUpload', imageUploadSchema);

module.exports = ImageUpload;
exports.imageUploadSchema = imageUploadSchema;
