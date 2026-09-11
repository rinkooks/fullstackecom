const {User} = require('../models/User');
const { imageUpload } = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
const { error } = require('console');

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

router.post('/signup', async(req, res)=>{
  const {name, phone, email, password, isAdmin} = req.body;

  try{
   const existingUser = await User.findOne({email: email});
   const existingUserByPh = await User.findOne({phone: phone});

   if(existingUser && existingUserByPh){
      return res.status(409).json({status:false, msg : "User already exists!"});
   }
   if (existingUser) {
      return res.status(409).json({
        status: false,
        msg: "Email already exists"
      });
    }

    if (existingUserByPh) {
      return res.status(409).json({
        status: false,
        msg: "Phone number already exists"
      });
    }


   const hashPassword = await bcrypt.hash(password,10)

   const result = await User.create({
     name:name,
     phone:phone,
     email:email,
     password:hashPassword,
     isAdmin:isAdmin

   })
   const token = jwt.sign({email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

   return res.status(200).json({
     status: true,
     user:result,
     token:token
   })
  }catch(error){
    console.log(error);
    res.status(500).json({status:false, msg:"something went wrong"});
  }
});

router.post('/signin', async(req, res)=>{
   const {email, password} = req.body;
   try{
    const existingUser = await User.findOne({email: email});

   if(!existingUser){
      return res.status(404).json({msg:"User not found"});
   }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if(!matchPassword){
      return res.status(400).json({msg: "Invalid credentials"})
    }
    const token = jwt.sign({email:existingUser.email, id:existingUser._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    return res.status(200).json({
      user:existingUser,
      token:token,
      msg:"user Authenticated"
    })
   }catch(error){
    console.log(error);
    res.status(500).json({msg: "something went wrong"})
   }
});

router.get('/', async(req, res)=>{
   const userList = await User.find();

   if(!userList){
    res.status(500).json({success: false})
   }
   res.send(userList);
});

router.get('/:id', async(req, res)=>{
   const user = await User.findById(req.params.id);

   if(!user){
    res.status(500).json({message: "The User with the given ID was not found"})
   }
   res.status(200).send(user);
});

router.delete('/:id', async(req, res)=>{
   User.findByIdAndDelete(req.params.id).then(user =>{
    if(user){
      return res.status(200).json({success: true, message: 'the user is deleted'})
    }else{
      return res.status(409).json({success: false, message:"user not found!"})
    }
   }).catch(err=>{
    return res.status(500).json({success:false, error: err})
   })
});

router.delete('/deleteImage', async(req, res)=>{
  const imgUrl = req.query.img;
  
  const urlArr = imgUrl.split('/');
  const image = urlArr[urlArr.length-1];

  const imageName = image.split('.')[0];
  const response = await cloudinary.uploader.destroy(imageName, (error, result)=>{

  })
  if(response){
    res.status(200).send(response);
  }   
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, password, images } = req.body;

    // Find old user
    const userExist = await User.findById(req.params.id);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Password hash
    let newPassword;
    if (password) {
      newPassword = await bcrypt.hash(password, 10);
    } else {
      newPassword = userExist.password;
    }

    // =========================
    // DELETE OLD IMAGES
    // =========================
    if (
      userExist.images &&
      userExist.images.length > 0
    ) {
      for (const imgUrl of userExist.images) {

        // agar new image same hai to delete mat karo
        if (!images.includes(imgUrl)) {

          const urlArr = imgUrl.split('/');
          const image = urlArr[urlArr.length - 1];

          const imageName = image.split('.')[0];

          await cloudinary.uploader.destroy(
            `imageupload/${imageName}`
          );
        }
      }
    }

    // =========================
    // UPDATE USER
    // =========================
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        phone,
        email,
        password: newPassword,
        images
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "User cannot be updated"
    });
  }
});
  /* const {name, phone, email, password} = req.body;

   const userExist = await User.findById(req.params.id);
   let newPassword;
   if(req.body.password){
    newPassword = await bcrypt.hash(req.body.password, 10);
   }else{
     newPassword = userExist.password
   }

   const user = await User.findByIdAndUpdate(
     req.params.id,
     {
       name:name,
       phone: phone,
       email: email,
       password:newPassword,
       images: req.body.images
     },
     {new: true}
   )
  if(!user){
    return res.status(400).send('the user cannot be updated!')
  }
  res.send(user);
});

/*router.put('/:id', async(req, res)=>{
   const {name, phone, email, password} = req.body;

   const userExist = await User.findById(req.params.id);
   let newPassword;
   if(req.body.password){
    newPassword = await bcrypt.hash(req.body.password, 10);
   }else{
     newPassword = userExist.password
   }

   const user = await User.findByIdAndUpdate(
     req.params.id,
     {
       name:name,
       phone: phone,
       email: email,
       password:newPassword
     },
     {new: true}
   )
  if(!user){
    return res.status(400).send('the user cannot be updated!')
  }
  res.send(user);
});*/


router.put(`/changePassword/:id`, async (req, res) => {
  try {
    const { name, phone, email, password, newPass, images } = req.body;
    const existingUser = await User.findOne({email: email});

    if (!existingUser) {
       res.status(404).json({ error: true, msg: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if(!matchPassword){
      return res.status(400).json({error:true, msg:"Current Password Wrong"})
    }else{

   let newPassword;
    if (newPass) {
      newPassword = await bcrypt.hashSync(newPass, 10);
    } else {
      newPassword = existingUser.passwordHash;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name:name,
        phone:phone,
        email:email,
        password: newPassword,
        images: images       
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser
    });
    };

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "User cannot be updated"
    });
  }
});

router.post("/authWithGoogle", async(req,res)=>{
  const {name, phone, email, password, images, isAdmin} = req.body;

  try{
    const existingUser = await User.findOne({email : email});
 
    if(!existingUser){
      const result = await User.create({
         name: name,
         phone: "",
         email: email,
         password: password,
         images: images ? [images] : [],
         isAdmin: false
      });

    // start google se login pr image update
    existingUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          images: images ? [images] : existingUser.images
        }
      },
      { new: true }
    );
    // end google se login pr image update

      const token = jwt.sign({email:result.email, id:result._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY)

      return res.status(200).send({
         user:result,
         token:token,
         msg:"User Login Succesfully"
      })
    }else{
      const existingUser = await User.findOne({email: email});
      const token = jwt.sign({email:existingUser.email, id:existingUser._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

      return res.status(200).send({
        user:existingUser,
        token:token,
        msg:"User Login Succesfully"
      })
    }
  }catch(error){
    console.log(error);
  }

})

module.exports = router;