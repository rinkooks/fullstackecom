const {order} = require('../models/orders.js');
const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  try {
    const products = req.body.products;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.productTitle?.substr(0, 30) + "...",
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
       // totalItems: products.length.toString()
       // cart: JSON.stringify(lineItems),
      },
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items: lineItems,
      mode: "payment",

      shipping_address_collection: {
        allowed_countries: ["US", "IN"],
      },
      //success_url: `${process.env.REACT_APP_API_URL}/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `http://localhost:3000/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get('/payment/complete', async (req, res) => {

  const result = await Promise.all([
    stripe.checkout.sessions.retrieve(
      req.query.session_id,
      {
        expand: ['payment_intent.payment_method']
      }
    ),

   stripe.checkout.sessions.listLineItems(
      req.query.session_id
    )
  ]);
  res.status(200).json(result);
});

router.get('/cancel', async(req, res) =>{
   res.redirect('/')
})




module.exports = router;