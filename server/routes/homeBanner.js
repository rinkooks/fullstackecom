const HomeBanner = require('../models/homeBanner');
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
const { BADNAME } = require('dns');
const { triggerAsyncId } = require('async_hooks');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { isModuleNamespaceObject } = require('util/types');

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
router.post('/create', async (req, res) => {
  try {
    const newEntry = new HomeBanner({
      images: req.body.images
    });
    const savedBanner = await newEntry.save();

    res.status(201).json({
      success: true,
      data: savedBanner
    });
  } catch (error) {

  res.status(500).json({success: false, message: error.message});
  }
});

router.get('/', async(req, res) =>{
  try{   
   const bannerImagesList = await HomeBanner.find(); 
    if(!bannerImagesList){
      res.status(500).json({ success : false })  
    }   
    return res.status(200).json(bannerImagesList)
   }catch(error){
    res.status(500).json({success: false })
   } 
});
router.get('/:id', async(req, res) =>{
 // slideEditId = req.params.id;
  const slide = await HomeBanner.findById(req.params.id);

  if(!slide){
    res.status(500).json({message: 'The slide with the given ID was no found.'});
  }
  return res.status(200).send(slide);  
});

router.delete('/deleteImage', async(req, res)=>{
  const imgUrl = req.query.img;
  const urlArr = imgUrl.split('/');
  const image =urlArr[urlArr.length-1];
  const imageName = image.split('.')[0];

  const response = await cloudinary.uploader.destroy(imageName, (error, result)=>{

  })
  if(response){
    res.status(200).send(response);
  }  
})

router.delete('/:id', async (req, res) => {
  try {
     const banner = await HomeBanner.findById(req.params.id);
     if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }
    // 🔥 Check each image
    for (const imageUrl of banner.images) {
        // CLOUDINARY DELETE     
      const urlArr = imageUrl.split('/');
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split('.')[0];

      await cloudinary.uploader.destroy(`imageupload/${imageName}`);

     // LOCAL UPLOADS DELETE
      const localImage = imageUrl.split('/').pop();
      const imagePath = path.join(__dirname, "../uploads", localImage);
     if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await HomeBanner.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Banner deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    // =========================
    // DELETE OLD IMAGES
    // =========================

    for (const imageUrl of banner.images) {

      // cloudinary delete
      const urlArr = imageUrl.split('/');
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split('.')[0];

      await cloudinary.uploader.destroy(`imageupload/${imageName}`);
      // local delete
      const localImage = imageUrl.split('/').pop();

      const imagePath = path.join(__dirname, "../uploads", localImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    // =========================
    // UPDATE NEW IMAGES
    // =========================

    const updatedBanner = await HomeBanner.findByIdAndUpdate(
      req.params.id,
      {
        images: req.body.images
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedBanner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

});
/*router.put('/:id', async (req, res) => {
   const homeSlide = await HomeBanner.findByIdAndUpdate(
    req.params.id,
    {     
      images: req.body.images     
    },
    { new: true }
  );
  if(!homeSlide){
    return res.status(400).json({
      message:'Home Banner cannot be updated',
      success:false
    })  
  }
  res.send(homeSlide);
}); */

module.exports = router;