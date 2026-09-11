const mongoose = require('mongoose');
const homeBannerSchema = new mongoose.Schema({
 
   images:[
    {
     type:String,
     required:true
    } 
  ] 
})

homeBannerSchema.virtual('id').get(function () {
  return this._id.toString();
});
homeBannerSchema.set('toJSON', {
  virtuals: true,
});
homeBannerSchema.set('toObject', {
  virtuals: true,
});

module.exports = mongoose.model('HomeBanner', homeBannerSchema);

