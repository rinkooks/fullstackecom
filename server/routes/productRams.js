
const ProductRams = require('../models/productRAMS');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res)=>{
    try{
        const productRamsList = await ProductRams.find();

        if(!productRamsList){
            res.status(500).json({success: false })
        }
        return res.status(200).json(productRamsList);
    }catch(error){
        res.status(500).json({ success : false })
    }
});

router.get('/:id', async(req, res)=>{
 
        const item = await ProductRams.findById(req.params.id);

        if(!item){
            res.status(500).json({message:'The Item with the given id was not found'})
        }
        return res.status(200).json(item);
   
});


router.post('/create', async(req, res)=>{
    let productRams = new ProductRams({
        productRams:req.body.productRams
    });

    if(!productRams){
        res.status(500).json({
          error: err,
          success: false  
        })
    }

    productRams = await productRams.save();
    res.status(201).json(productRams); 
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await ProductRams.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: 'Item not Found!',
        success: false
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async(req, res)=>{
  const item = await ProductRams.findByIdAndUpdate(
    req.params.id,
    { productRams: req.body.productRams },
    { new: true }
  );

   if(!item){
    return res.status(500).json({
       message : 'Item can not be updated!',
       success: false 
    })
   }

   res.send(item)
})


module.exports = router;