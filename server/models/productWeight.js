const mongoose = require('mongoose');

const productWeightSchema = mongoose.Schema({
    productWeight:{
        type : String,
        default : null
    }
})

productWeightSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productWeightSchema.set('toJSON', {
    virtuals:true,
});
productWeightSchema.set('toObject', {
  virtuals: true,
});

module.exports = mongoose.model('productWeight', productWeightSchema);