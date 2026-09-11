const Category = require('../models/Category');
const { Product } = require('../models/Products');
const express = require('express');
const router = express.Router();
//const pLimit = require('p-limit');
//const cloudinary= require('cloudinary').v2;
const fs = require('fs');
const multer  = require('multer');
const path = require("path");

var imagesArr=[];
var productEditid;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
})
const upload = multer({ storage: storage })

router.post("/upload", upload.array("images"), async (req, res) => {
   try {
      const { productId } = req.body;
      let imagesArr = [];
      // 🔥 If edit → delete old images
      if (productId) {
        const product = await Product.findById(productId);
        if (product?.images?.length) {
          for (const image of product.images) {
            const imgPath = `uploads/${image}`;
            if (fs.existsSync(imgPath)) {
              fs.unlinkSync(imgPath);
            }
          }
        }
      }
      // ⭐ Save new images
      req.files.forEach(file => {
        imagesArr.push(file.filename);
      });
      return res.status(200).json({
        success: true,
        images: imagesArr
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
});

// ============= GET ALL PRODUCTS ==============
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > perPage){
      return res.status(404).json({message: "Page Not Found"})
    }

    const productList = await Product.find().populate("category subCat")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec(); 
    
    //const productList = await Product.find().populate("product");
     if(!productList){
      res.status(500).json({ success : false })  
    }

    return res.status(200).json({
       "productList":productList,
       "totalPages": totalPages,
       "page":page
    })
   // return res.status(200).json(productList);

  } catch (error) {
    console.log("GET Error:", error);
    return res.status(500).json({
      message: "Error fetching products",
      error: error.message,
      success: false
    });
  }
});

router.get('/featured', async(req, res) =>{
  const productList = await Product.find({isFeatured:true})
  
  if(!productList){
    res.status(500).json({success : false})
  }

  return res.status(200).json(productList);

});

// ============= CREATE PRODUCT ==============
router.post('/create', async (req, res) => {
  try {
    // Validate category
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({ message: "Invalid Category!" });
    }

    // Upload images to Cloudinary
    //const limit = pLimit(2);

  //  const imagesToUpload = req.body.images.map((image) =>
  //    limit(async () => {
  //      return await cloudinary.uploader.upload(image);
  //    })
  //  );

  //  const uploadedImages = await Promise.all(imagesToUpload);
  //  const imgurl = uploadedImages.map(item => item.secure_url);

    // Create Product
    const product = new Product({
      name: req.body.name,
      subCat: req.body.subCat,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldprice: req.body.oldprice,
      catName: req.body.catName,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount:req.body.discount,
      productRams:req.body.productRams,
      productSize:req.body.productSize,
      productWeight:req.body.productWeight
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct
    });

  } catch (error) {
  console.log("CREATE PRODUCT ERROR:", error);
  return res.status(500).json({
    message: "Product creation failed",
    error: error.message,
    success: false
  });
}
});


// ============= DELETE PRODUCT ==============
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    } 
    const images = product.images || [];
    for (const image of images) {
      const imgPath = `uploads/${image}`;
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: "Delete failed",
      error: error.message,
      success: false
    });
  }
});


// ============= GET SINGLE PRODUCT ==============
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false
      });
    }

    return res.status(200).json(product);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching product",
      error: error.message,
      success: false
    });
  }
});


// ============= UPDATE PRODUCT ==============
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not updated",
        success: false
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product
    });

  } catch (error) {
    return res.status(500).json({
      message: "Update failed",
      error: error.message,
      success: false
    });
  }
});

module.exports = router;

/** router.get('/', async(req, res)=>{
    const productList = await Product.find().populate("category");
    
    if(!productList){
      res.status(500).json({ success: false })
    }
    res.send(productList);
})

router.post('/create', async(req, res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
      return res.status(404).send("invalid Category!");
    }

    const limit = pLimit(2);
    const imagesToUpload = req.body.images.map((image)=>{
      return limit(async()=>{
        const result = await cloudinary.uploader.upload(image);
        return result;
      })
    });

    const uploadStatus = await Promise.all(imagesToUpload);

    const imgurl = uploadStatus.map((item)=>{
      return item.secure_url
    })

    if(!uploadStatus){
      return res.status(500).json({
        error : "images cannot upload!",
        status: false
      })
    }

   // let product = new Product(req.body);
   let product = new Product({
      name:req.body.name,
      description:req.body.description,
      images:imgurl,
      brand:req.body.brand,
      price:req.body.price,
      oldprice:req.body.oldprice,
      category:req.body.category,
      countInStock:req.body.countInStock,
      rating:req.body.rating,     
      isFeatured:req.body.isFeatured
    });

    product = await product.save();
    if(!product){
      res.status(500).json({
        error: err,
        success: false
      })
    } 
    res.status(201).json(product);
});

router.delete('/:id', async(req, res)=>{
   const deleteProduct = await Product.findByIdAndDelete(req.params.id);

   if(!deleteProduct){
    return res.status(404).json({
      message:"Product Not found!",
      status: false
    });
   }
   res.status(200).send({
      message: "the product is deleted!",
      status: true
   })
});

router.get('/:id', async(req, res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
      res.status(500).json({message : "The Product with the given ID was not found."})
    }
    return res.status(200).send(product);
})

router.put('/:id', async(req, res)=>{
  const product = await Product.findByIdAndUpdate(
   req.params.id,
   req.body,
   {new:true} 
  );

  if(!product){
    res.status(404).json({
      message:"The Product can not be updated!",
      status : false
    })
  }
  res.status(200).json({
    message: "the product is updated",
    status:true
  })

})


module.exports = router; **/