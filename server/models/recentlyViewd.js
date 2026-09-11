const mongoose = require("mongoose");
const Category = require("./Category");

const recentlyViewdSchema = mongoose.Schema({
    prodId:{
       type: String,
       default:''
    },
    name: {
      type: String,
      required: true,  
    },
    description: {
      type:String,
      required : true
    },
    images:[
        {
          type: String,
          required: true
        }
    ],
    brand:{
        type: String,
        default : ''
    },
    price: {
      type: Number,
      default: 0
    },
    oldprice: {
      type: Number,
      default: 0
    },
    catName:{
      type: String,
      default:''
    },
    subcatId:{
      type: String,
      default:''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true 
    },
    subCat: {
        type: String,
        default:''
    },
    countInStock: {
       type: Number,
       required: true 
    },
    rating: {
        type: Number,
        default: 0
    },   
    isFeatured:{
        type: Boolean,
        default: false
    },
    discount:{
      type: Number,
      required: true
    },
    productRams:[ {
      type: String,
      default: null
    }
  ],
    productSize:[ {
     type: String,
      default: null
    }],
    productWeight:[{
     type: String,
     default: null
    }],
    dateCreated:{
        type: Date,
        default: Date.now
    }
})

recentlyViewdSchema.virtual('id').get(function () {
  return this._id.toString();
});
recentlyViewdSchema.set('toJSON', {
  virtuals: true,
});
recentlyViewdSchema.set('toObject', {
  virtuals: true,
});

exports.recentlyViewd = mongoose.model('recentlyViewd', recentlyViewdSchema);