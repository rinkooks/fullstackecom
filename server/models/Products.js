const mongoose = require("mongoose");
const Category = require("./Category");

const productSchema = mongoose.Schema({
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
    subCat:{
      type: String,
      default:''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true 
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
    location:[
      {
       value:{ type: String },
       label:{ type: String}  
      }
    ],
    dateCreated:{
        type: Date,
        default: Date.now
    }
})

productSchema.virtual('id').get(function () {
  return this._id.toString();
});
productSchema.set('toJSON', {
  virtuals: true,
});
productSchema.set('toObject', {
  virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);