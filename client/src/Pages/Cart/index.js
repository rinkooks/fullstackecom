import { Button, Rating, Table } from "@mui/material";
import { Link } from "react-router-dom";
import QuantiyDetails from "../../Components/QuantityDetails";
import emptyCart from './../../assets/images/remove-to-cart.png';
import { MdClose } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

import {loadStripe} from '@stripe/stripe-js';

const Cart=()=>{
 const [cartData, setCartData] = useState([]);
 const [productQuantity, setProductQuantity] = useState();
 let [cartFields, setCartFields] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [selectedQuantity, setSelectedQuantity] = useState();
const [changeQuantity, setChangeQuantity] = useState(0);

 const context = useContext(MyContext);
 
 
 useEffect(()=>{
   /*const user = JSON.parse(localStorage.getItem("user"));
   fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res)=>{
      setCartData(res);
      setSelectedQuantity(res?.quantity);   
   })*/

   fetchDataFromApi('/api/cart').then((res)=>{
      setCartData(res);
      setSelectedQuantity(res?.quantity);      
   }) 
 },[]) 

 const quantity=(val)=>{
    setProductQuantity(val);
    setChangeQuantity(val);
 }

const selectedItem = (item, quantityVal) => {
   setIsLoading(true);
   const user = JSON.parse(localStorage.getItem("user"));
   const updatedFields = {
      productTitle: item?.productTitle,
      image: item?.image,
      rating: item?.rating,
      price: item?.price,
      quantity: quantityVal,
      subTotal: parseInt(item?.price * quantityVal),
      productId: item?.productId,
      userId: user?.userId
   };
   editData(`/api/cart/${item?._id}`, updatedFields).then(() => {
      setTimeout(()=>{
         setIsLoading(false);
         /*const user = JSON.parse(localStorage.getItem("user"));
         fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res)=>{
            setMyListData(res);
         })*/

         fetchDataFromApi('/api/cart').then((res)=>{
            setCartData(res);
         });
      }, 500);
   });
};

const removeItem=(id)=>{
   deleteData(`/api/cart/${id}`).then((res)=>{
      context.setAlertBox({
         open:true,
         error:false,
         msg:"Item removed from cart"
      }) 
      fetchDataFromApi('/api/cart').then((res)=>{
          setCartData(res);
      })
      context.getCartData();   
   })
}


/*const checkout = async()=>{ 
   const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

   const cartProducts= cartData.map((product) =>({
      productTitle: product?.productTitle,
      image: product?.image,
      price: product?.price,
      quantity: product?.quantity
   }))

   const userData = JSON.parse(localStorage.getItem("user"));
   const body = {
      products:cartProducts,
      userId:userData.userId
   }

  // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkout`,{
   const response = await fetch(`http://localhost:5000/api/checkout`,{
      method:"POST",
      headers:{
         "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
   })

   const session = await response.json();
   const result = stripe.redirectToCheckout({
      sessionId: session.id
   })

   if(result.error){
      console.log(result.error)
   }
} */

   const checkout = async()=>{ 

   const stripe = await loadStripe(
      process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
   );

   const cartProducts = cartData.map((product) => ({
      productTitle: product?.productTitle,
      image: product?.image,
      price: product?.price,
      quantity: product?.quantity
   }));

   const userData = JSON.parse(localStorage.getItem("user"));

   const body = {
      products: cartProducts,
      userId: userData.userId
   };

   const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/checkout`,
      {
         method: "POST",

         headers: {
            "Content-Type": "application/json"
         },

         body: JSON.stringify(body)
      }
   );

   const session = await response.json();

   const result = await stripe.redirectToCheckout({
   sessionId: session.id
});

   if(result.error){
      console.log(result.error);
   }
}


    return(
     <>     
      <section className="pt-5 pb-4 cart-page"> 
        <div className="container">
           <div className="container">
             <div className="mb-4"><h2>Your Cart</h2>
             <p>There are <b className="text-red">{cartData?.length}</b> products in your List</p></div>
             {
              cartData?.length !== 0 ?

             <div className="row">                                                                                  
               <div className="col-md-8">
                 <div class="table-responsive mb-5"> 
                 <Table className="table table-bordered cart-table">
                   <thead>
                    <tr>
                     <th width="6%">Image</th>
                     <th width="25%">Product Name</th>
                     <th width="10%">Price</th>
                     <th width="15%">Quantity</th>
                     <th width="10%">Subtotal</th>
                     <th width="7%">Remove</th>
                     </tr> 
                    </thead>
                    <tbody>
                     {
                      cartData?.length !== 0 && cartData?.map((item, index)=>{
                        return(
                       <tr key={index}>
                        <td>
                        <div className="imgWraper"><img src={`${context.imageBaseUrl}/uploads/${item?.image}`} alt={item?.productTitle} />
                       </div>
                        </td>
                        <td><h6><Link to={`/details/${item?.productId}`}>{item?.productTitle.substr(0, 40)+'...'}</Link></h6>
                           <Rating name="read-only" value={item.rating} readOnly size="small" />
                        </td>
                        <td><span className="newPrice">{item.price}</span></td>  
                        <td><QuantiyDetails quantity={quantity} item={item} selectedItem={selectedItem} value={item?.quantity} /></td>
                        <td><span className="totalPrice">{item?.subTotal}</span></td>
                        <td className="text-center"><div className="removeItem" onClick={()=>removeItem(item?._id)}><Button><MdClose /></Button></div></td>  
                       </tr>   
                       ) 
                       })
                     }                       
                    </tbody> 
                 </Table>
                </div> 
               </div>
               <div className="col-md-4">
                 <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3 fs-5">
                     <span>Subtotal</span> 
                     <span className="totalPrice fw-bold">Rs. &nbsp;
                      {
                        cartData.length!== 0 &&
                        cartData.map(item => parseInt(item.price) * item.quantity)
                        .reduce((total, value) => total + value, 0)
                      }

                     </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 fs-5">
                     <span>Shipping</span> <span className="fw-bold">Free</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 fs-5">
                     <span>Estimate for</span> <span className="fw-bold">United Kingdom</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 fs-5">
                     <span>GST</span> <span className="fw-bold">0.00</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 fs-5">
                     <span>Total</span> 
                     <span className="totalPrice fw-bold">
                      Rs. &nbsp;
                      {
                        cartData.length!== 0 &&
                        cartData.map(item => parseInt(item.price) * item.quantity)
                        .reduce((total, value) => total + value, 0)
                      }
                     </span>
                  </div>
                  <div className="d-flex mb-3 fs-5 mt-3">
                   <Link to="/checkout"> 
                     <Button className="w100 btn-primary checkout-btn" variant="contained"><IoBagCheckOutline />&nbsp; Checkout </Button>
                   </Link>   
                  </div>  
                  <div className="d-flex mb-3 fs-5 mt-3">                   
                     <Button className="w100 btn-primary checkout-btn" variant="contained" onClick={checkout}><IoBagCheckOutline />&nbsp; Checkout </Button>
                
                  </div>                
                 </div>
               </div>
             </div>
             :
             <div className="empty d-flex align-items-center justify-content-center flex-column mb-4">
               <div className="mb-3"><img src={emptyCart} alt="" width="128" /> </div>
               <h3 className="mb-3">My List is currently empty </h3>
               <Link to="/"> 
                  <Button className="blue-btn bg-red btn-lg btn-round"><FaHome />&nbsp; Continue Shopping</Button>
               </Link>
            </div>   
            }
           </div>
        </div>
      </section>
      {
        isLoading === true && <div className="loading"></div> 
      }
     
     </>   
    )
}

export default Cart;