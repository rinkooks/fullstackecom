const SubCat = require('../models/subCat');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPosts = await SubCat.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > perPage){
      return res.status(404).json({message: "Page Not Found"})
    }

   let subCategoryList = []; 
   
   if(req.query.page !== undefined && req.query.perPage !== undefined){
     subCategoryList = await SubCat.find().populate("category")
     .skip((page - 1) * perPage)
     .limit(perPage)
     .exec();
   }else{
    subCategoryList = await SubCat.find().populate("category");
   }
  

   // without pagination
   // const categoryList = await Category.find();

    if(!subCategoryList){
      res.status(500).json({ success : false })  
    }
    // without pagination
   // res.send(categoryList);
    return res.status(200).json({
       "subCategoryList":subCategoryList,
       "totalPages": totalPages,
       "page":page
    })

   }catch(error){
    res.status(500).json({success: false })
   } 
});
/*router.get('/', async (req, res)=>{
   try{

    const subCats = await SubCat.find().populate("category");
    if(!subCats){
      res.status(500).json({success: false}) 
    }

    return res.status(200).json(subCats);

   }catch(error){
    res.status(500).json({success: false})
   }
}); */

router.get('/:id', async(req, res) => {
  
    const subCats = await SubCat.findById(req.params.id).populate("category");

    if(!subCats){
        return res.status(500).json({ message: 'The category with the given ID was not found.'})        
    }

    return res.status(200).send(subCats);
});

router.post('/create', async (req, res) => {
  try {
    console.log(req.body); // 👈 check this

    const subCats = new SubCat({
      category: req.body.category,
      subCat: req.body.subCat    
    });

    await subCats.save();
    res.status(201).json(subCats);

  } catch (error) {
    console.log(error); // 👈 check actual error
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const subCats = await SubCat.findById(req.params.id);
    if (!subCats) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found"
      });
    }    
    await SubCat.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Sub Category Deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
   const subCats = await SubCat.findByIdAndUpdate(
    req.params.id,
    {
      category: req.body.category,
      subCat: req.body.subCat      
    },
    { new: true }
  );
  if(!subCats){
    return res.status(400).json({
      message:'Sub Category cannot be updated',
      success:false
    })  
  }
  res.send(subCats);

})


module.exports = router;