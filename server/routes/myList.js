const { MyList } = require('../models/myList');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) =>{
  try{
   const myList = await MyList.find(req.query);

    if(!myList){
      res.status(500).json({ success : false })  
    }
    // without pagination
   // res.send(categoryList);
    return res.status(200).json(myList)

   }catch(error){
    res.status(500).json({success: false })
   } 
});

router.post('/add', async (req, res) => {
  try {
   // const item = await MyList.find({ productId: req.body.productId, userId: req.body.userId});
    const item = await MyList.findOne({ productId: req.body.productId, userId: req.body.userId});
    
    //if(item.length===0){
    if(!item){
     let list = new MyList({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: String(req.body.rating), 
      price: req.body.price,     
      productId: req.body.productId,
      userId: req.body.userId
     });

     const myList = await list.save(); 
     return res.status(201).json(myList);
    }else{
     return res.status(409).json({ status:false, msg:"Product already added in the my list" });
    }
  } catch (error) {
    console.log("CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
 
    const item = await MyList.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "The item given id  is not found!"
      });
    }

    const deleteItem = await MyList.findByIdAndDelete(req.params.id);

    if(!deleteItem){
      res.status(404).json({message: 'Item not found!', success:false})
    }
    res.status(200).json({
      success: true,
      message: "MyList Item Deleted"
    });
});

router.get('/:id', async(req, res)=>{
   const item = await MyList.findById(req.params.id);

   if(!item){
     res.status(500).json({ message:'The item with the given ID was not found.'})
   }
  return res.status(200).send(item);
});


module.exports = router;