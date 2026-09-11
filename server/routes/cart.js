const { Cart } = require('../models/Cart');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) =>{
  try{
   const cartList = await Cart.find(req.query);

    if(!cartList){
      res.status(500).json({ success : false })  
    }
    // without pagination
   // res.send(categoryList);
    return res.status(200).json(cartList)

   }catch(error){
    res.status(500).json({success: false })
   } 
});

router.post('/add', async (req, res) => {
  try {
    const cartItem = await Cart.find({ productId: req.body.productId, userId: req.body.userId});
    
    if(cartItem.length===0){
     let cartList = new Cart({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: String(req.body.rating), // ensure string
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId
     });

     const savedCart = await cartList.save(); 
     return res.status(201).json(savedCart);
    }else{
      res.status(409).json({status:false, msg:"Product already added in the cart"});
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
 
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "The Cart item given id  is not found!"
      });
    }

    const deleteItem = await Cart.findByIdAndDelete(req.params.id);

    if(!deleteItem){
      res.status(404).json({message: 'Cart Item not found!', success:false})
    }
  
    res.status(200).json({
      success: true,
      message: "Cart Item Deleted"
    });
});

router.get('/:id', async(req, res)=>{
   const cartItem = await Cart.findById(req.params.id);

   if(!cartItem){
     res.status(500).json({ message:'The cart item with the given ID was not found.'})
   }
  return res.status(200).send(cartItem);
});

router.put('/:id', async (req, res) => { 

   const cartList = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId
    },
    { new: true }
  );
  if(!cartList){
    return res.status(500).json({
      message:'Cart Item cannot be updated',
      success:false
    })  
  }
  res.send(cartList);
});


module.exports = router;