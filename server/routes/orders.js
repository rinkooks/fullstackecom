const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res) =>{
  try{
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPosts = await Orders.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if(page > perPage){
      return res.status(404).json({message: "Page Not Found"})
    }

   const orderList = await Orders.find()
   .skip((page - 1) * perPage)
   .limit(perPage)
   .exec(); 

   // without pagination
   // const categoryList = await Category.find();

    if(!orderList){
      res.status(500).json({ success : false })  
    }
    // without pagination
   // res.send(categoryList);
    return res.status(200).json({
       "orderList":orderList,
       "totalPages": totalPages,
       "page":page
    })

   }catch(error){
    res.status(500).json({success: false })
   } 
});
router.get('/all', async (req, res) => {
  const list = await Orders.find();
  res.status(200).json(list);
});

router.get('/:id', async(req, res)=>{
   //categoryEditId = req.params.id;

   const order = await Orders.findById(req.params.id);
   if(!order){
    res.status(500).json({ message:'The order with the given ID was not found.'})
   } 
  return res.status(200).send(order); 

})

router.post('/create', async (req, res) => {
  try {
    const order = new Orders({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pincode: req.body.pincode,
      amount: req.body.amount,
      paymentId: req.body.paymentId,
      email: req.body.email,
      userId: req.body.userId,
      products: req.body.products
    });

    await order.save();
    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
 
   const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

   if(!deletedOrder){
     res.status(404).json({message:'Order not found', success:false})
   }

    res.status(200).json({
      success: true,
      message: "Order Deleted"
    });


});


router.put('/:id', async (req, res) => {
   const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pincode: req.body.pincode,
      amount: req.body.amount,
      paymentId: req.body.paymentId,
      email: req.body.email,
      userId: req.body.userId,
      products: req.body.products,
      status:req.body.status
    },
    { new: true }
  );
  if(!order){
    return res.status(400).json({
      message:'order cannot be updated',
      success:false
    })  
  }
  res.send(order);
});

module.exports = router;