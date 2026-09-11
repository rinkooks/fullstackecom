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
});

const createCategories = (categories, parentId=null) =>{
  const categoryList =[];
  let category;
  if(parentId == null){
    category = categories.filter((cat) => cat.parentId == undefined);
  }else{
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for(let cat of category){
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      images: cat.images,
      color: cat.color,
      slug: cat.slug,
      Children: createCategories(categories, cat._id)
    });
  }
  return categoryList;
}

router.get('/', async(req, res) =>{
   try{
    const categoryList = await Category.find();

    if(!categoryList){
      res.status(500).json({ success: false})
    }
   
   if(categoryList){
    const categoryData = createCategories(categoryList);

    return res.status(200).json({
      categoryList : categoryData
    })
   }
   }catch(error){
    res.status(500).json({success:false})
   }

});

router.get(`/get/count`, async(req, res) =>{
   const categoryCount = await Category.countDocuments({parentId:undefined});
   if(!categoryCount){
     res.status(500).json({success: false})
   }else{
   res.send({categoryCount: categoryCount})
  } 
});

router.get(`/subCat/get/count`, async(req, res) =>{
   const categories = await Category.find();
   if(!categories){
     res.status(500).json({success: false})
   }else{
  
   const subCatList = [];
   for(let cat of categories){
    if(cat.parentId!== undefined){
      subCatList.push(cat);
    }
   }
   res.send({
      categoryCount : subCatList.length,
   })
  }
});

/*router.get('/', async(req, res) =>{
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

    if(!categoryList){
      res.status(500).json({ success : false })  
    }
   
    return res.status(200).json({
       "categoryList":categoryList,
       "totalPages": totalPages,
       "page":page
    })

   }catch(error){
    res.status(500).json({success: false })
   } 
}); */
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
  let catObj = {};
  if(req.body.images && req.body.images.length > 0){
    catObj = {
      name: req.body.name,
      images: req.body.images,
      color: req.body.color,
      slug: req.body.name
    }
  }else{
    catObj = {
    name: req.body.name,    
    slug: req.body.name
   };
  }

  if(req.body.parentId){
    catObj.parentId = req.body.parentId
  }

  let category = new Category(catObj);
  if(!category){
    res.status(500).json({error: err, success: false});
  }
  category = await category.save();
  
  imagesArr = [];
  res.status(201).json(category);  
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