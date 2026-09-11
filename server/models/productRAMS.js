const mongoose = require('mongoose');

const productRamsSchema = mongoose.Schema({
    productRams:{
        type: String,
        default: null
    }
})

productRamsSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productRamsSchema.set('toJSON', {
    virtuals:true,
});
productRamsSchema.set('toObject', {
   virtuals: true,
});

module.exports = mongoose.model('productRams', productRamsSchema);