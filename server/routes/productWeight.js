
const ProductWeight = require('../models/productWeight');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res)=>{
    try{
        const productWeightList = await ProductWeight.find();

        if(!productWeightList){
            res.status(500).json({success: false })
        }
        return res.status(200).json(productWeightList);
    }catch(error){
        res.status(500).json({ success : false })
    }
});
router.get('/:id', async(req, res)=>{
 
    const item = await ProductWeight.findById(req.params.id);

    if(!item){
        res.status(500).json({message:'The Item with the given id was not found'})
    }
    return res.status(200).json(item);
   
});

router.post('/create', async(req, res)=>{
    let productWeight = new ProductWeight({
        productWeight:req.body.productWeight
    });

    if(!productWeight){
        res.status(500).json({
          error: err,
          success: false  
        })
    }

    productWeight = await productWeight.save();
    res.status(201).json(productWeight); 

});

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await ProductWeight.findByIdAndDelete(req.params.id);

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
  const item = await ProductWeight.findByIdAndUpdate(
    req.params.id,
    { productWeight: req.body.productWeight },
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