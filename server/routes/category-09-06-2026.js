const Category = require('../models/Category');
const { imageUpload } = require('../models/imageUpload');
const express = require('express');
const router = express.Router();

/*const pLimit = require('p-limit');*/
const cloudinary= require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret
});

const fs = require('fs');
const multer  = require('multer');
const path = require("path");
const ImageUpload = require('../models/imageUpload');

var imagesArr=[];
//var categoryEditId;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    /** for image upload in folder
    cb(null, path.join(__dirname, "../uploads")); **/

    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage })

router.post("/upload", upload.array("images"), async (req, res) => {
   try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded"
      });
    }

    let uploadedImages = [];

    for (const file of req.files) {

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "imageupload"
      });

      uploadedImages.push(result.secure_url);

      // delete local file
      fs.unlinkSync(file.path);
    }

    res.status(200).json({
      success: true,
      images: uploadedImages
    });
    } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }

  /** try {
    const { categoryId } = req.body;
    let imagesArr = [];
    // 🔥 If edit → delete old images
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (category?.images?.length) {
        for (const image of category.images) {
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
  } **/
  /* try {   

   if(categoryEditId!== undefined){
     const category = await Category.findById(categoryEditId);
     const images = category.images; 
      
    if(images.length!==0){
      for(image of images){
        fs.unlinkSync(`uploads/${image}`);
      }
    }
   }

   imagesArr = [];  
    req.files.forEach((file) => {
      imagesArr.push(file.filename);
    });

    return res.status(200).json({
      success: true,
      images: imagesArr
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message
    });
  }*/
});

router.get('/', async(req, res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > perPage){
      return res.status(404).json({message: "Page Not Found"})
    }

   const categoryList = await Category.find()
   .skip((page - 1) * perPage)
   .limit(perPage)
   .exec(); 

   // without pagination
   // const categoryList = await Category.find();

    if(!categoryList){
      res.status(500).json({ success : false })  
    }
    // without pagination
   // res.send(categoryList);
    return res.status(200).json({
       "categoryList":categoryList,
       "totalPages": totalPages,
       "page":page
    })

   }catch(error){
    res.status(500).json({success: false })
   } 
});
router.get('/all', async (req, res) => {
  const list = await Category.find();
  res.status(200).json(list);
});

router.get('/:id', async(req, res)=>{
   //categoryEditId = req.params.id;

   const category = await Category.findById(req.params.id);
   if(!category){
    res.status(500).json({ message:'The category with the given ID was not found.'})
   } 
  return res.status(200).send(category); 

})

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    // 🔥 Check each image
    for (const image of category.images) {
      const publicId = image.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);

     // two line for delete image in server folder
      const isUsed = await Category.findOne({       
        _id: { $ne: category._id },
        images: image
      });
     // if condition for delete image in server folder
      if (!isUsed) {
        const imgPath = `uploads/${image}`;
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
    }
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category Deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/create', async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      images: req.body.images,
      color: req.body.color
    });

    await category.save();
    res.status(201).json(category);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.put('/:id', async (req, res) => {
  /* const limit = pLimit(2);
   const imageToUpload = req.body.images.map((image) => {  
    return limit(async ()=>{
      const result = await cloudinary.uploader.upload(image);
      return result
    })
   })

   const uploadStatus = await Promise.all(imageToUpload);

   const imgUrl = uploadStatus.map((item)=>{
     return item.secure_url
   })

   if (!uploadStatus || uploadStatus.length === 0) {
    return res.status(400).json({
      error:"images cannot upload!",
      status:false
    })
   }*/

   const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      images: req.body.images,
      color: req.body.color
    },
    { new: true }
  );
  if(!category){
    return res.status(400).json({
      message:'Category cannot be updated',
      success:false
    })  
  }
  res.send(category);
});

module.exports = router;