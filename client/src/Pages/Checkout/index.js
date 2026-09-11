import React, { useContext, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import { fetchDataFromApi, postData } from "../../utils/api";

import {useNavigate} from 'react-router-dom';

const Checkout = ()=>{
 
const context = useContext(MyContext);

const history = useNavigate();

const [formFields, setFormFields] = useState({
    fullName:'',
    country:'',
    streetAddressLine1:'',
    streetAddressLine2:'',
    city:'',
    state:'',
    zipCode:'',
    phoneNumber:'',
    email:''     
});
 const [cartData, setCartData] = useState([]);
 
useEffect(()=>{
  const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res)=>{
      setCartData(res);       
    })
  },[]) 

const onChangeInput=(e)=>{
  setFormFields(()=>({
    ...formFields,
    [e.target.name]:e.target.value
  }))
}



const checkout=(e)=>{
  e.preventDefault();
  
  const total = cartData.map(item => parseInt(item.price) * item.quantity)
  .reduce((total, value) => total + value, 0);

  /**
   const totalAmount = cartData.reduce( (total, item) => total + parseInt(item.price) * item.quantity, 0 ); 
  **/
 
 // console.log(formFields);
  if(formFields.fullName=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill Full Name"
    })
    return false
  }
  if(formFields.country=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill Country Name"
    })
    return false
  }
  if(formFields.streetAddressLine1=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill Street Address"
    })
    return false
  }
  if(formFields.streetAddressLine2=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill Street Address"
    })
    return false
  }
  if(formFields.city=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill city"
    })
    return false
  }
  if(formFields.state=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill state"
    })
    return false
  }
  if(formFields.zipCode=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill zipCode"
    })
    return false
  }
  if(formFields.phoneNumber=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill phoneNumber"
    })
    return false
  }
  if(formFields.email=== ""){
    context.setAlertBox({
      open:true,
      error:true,
      msg:"Please Fill email"
    })
    return false
  }

  const addressInfo ={
    name: formFields.fullName,
    phoneNumber: formFields.phoneNumber,
    address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
    pincode: formFields.zipCode,
    date: new Date().toLocaleString(
      "en-us",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )
  }

  var options = {
   // key:"rzp_test_SofMnpMplIMjdy",
    key:"rzp_test_SofMnpMplIMjdy",
    key_secret:"3hyd1g55GJgrqLJlSwaD80vT",
    amount:parseInt(total*100),
    currency:"INR",
    order_receipt:'order_rcptid_' + formFields.fullName,
    name:"E-Bharat",
    description:"for testing purpose",
    handler: function(response) {
     //console.log(response)
     const paymentId = response.razorpay_payment_id

     const user = JSON.parse(localStorage.getItem("user"));
      
     const payload={      
          name:addressInfo.name,
          phoneNumber:formFields.phoneNumber,
          address: addressInfo.address,
          pincode: formFields.zipCode,
          amount: parseInt(total*100),
          paymentId: paymentId,
          email:user.email,
          userId:user.userId,
         // products:cartData
           products: cartData.map(item => ({
              productName: item.productTitle,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
              total: item.subTotal
          }))
     } 
     postData(`/api/orders/create`, payload).then(res=>{
        history('/orders');
     })
    },
    theme:{
      color:"#3399cc"
    }
  };
  var pay = new window.Razorpay(options);
  pay.open();
}  

  return(
   <section className="pt-5 pb-4 checkout">
    <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
        <div className="row">
          <div className="col-md-8">
            <div className="mb-3"><h2 className="hd">Billing Details</h2></div> 
            <div className="row">
             <div className="col-md-6">
              <div className="form-group">
                 <TextField label="FullName" variant="outlined" className="w-100" size="small" name="fullName" 
                 onChange={onChangeInput}  />  
              </div>   
             </div> 
             <div className="col-md-6">
              <div className="form-group">
               <TextField label="Country" variant="outlined" className="w-100" size="small" name="country" 
                 onChange={onChangeInput}  /> 
                {/*<TextField label="House Number and street name" variant="outlined" className="w-100" size="small" />
               <FormControl fullWidth>
                <InputLabel>country</InputLabel> 
                <Select value={country} label="country" onChange={handleChangeCountry} >
                 {
                  context.countryList?.length !== 0 &&  context.countryList?.map((item, index)=>{
                    return(
                       <MenuItem value={item.country}>{item.country}</MenuItem>
                    )
                  })
                 }  
                </Select> 
                </FormControl> */} 
              </div>   
             </div>
             </div>
            <div className="mb-1"><h6 className="hd">Street Address</h6></div> 
            <div className="row">  
             <div className="col-md-12">
              <div className="form-group">
                 <TextField label="House Number and street name" variant="outlined" className="w-100" size="small" name="streetAddressLine1" 
                 onChange={onChangeInput} />  
              </div>   
             </div> 
             <div className="col-md-12">
              <div className="form-group">
                 <TextField label="Appartment, Suite, Unite etc" variant="outlined" className="w-100" size="small" name="streetAddressLine2" 
                 onChange={onChangeInput} />  
              </div>   
             </div>
            </div>

            <div className="mb-1"><h6 className="hd">Town /City</h6></div> 
            <div className="row">  
             <div className="col-md-12">
              <div className="form-group">
                 <TextField label="House Number and street name" variant="outlined" className="w-100" size="small" name="city" 
                 onChange={onChangeInput} />  
              </div>   
             </div> 
            </div>
            <div className="mb-1"><h6 className="hd">State Country</h6></div> 
            <div className="row">  
             <div className="col-md-12">
              <div className="form-group">
                 <TextField label="State" variant="outlined" className="w-100" size="small" name="state" 
                 onChange={onChangeInput} />  
              </div>   
             </div> 
            </div>

            <div className="mb-1"><h6 className="hd">Postcode / ZIP</h6></div> 
            <div className="row">  
             <div className="col-md-12">
              <div className="form-group">
                 <TextField label="zip code" variant="outlined" className="w-100" size="small" name="zipCode" 
                 onChange={onChangeInput} />  
              </div>   
             </div> 
            </div>
            <div className="row">  
             <div className="col-md-6">
              <div className="form-group">
                 <TextField label="Phone Number" variant="outlined" className="w-100" size="small" name="phoneNumber" 
                 onChange={onChangeInput} />  
              </div>   
             </div> 
             <div className="col-md-6">
              <div className="form-group">
                 <TextField label="Email Address" variant="outlined" className="w-100" size="small" name="email" 
                 onChange={onChangeInput} />  
              </div>   
             </div> 
            </div> 
         </div>  
         <div className="col-md-4">
           <div className="card orderInfo">
            <div className="mb-3"><h4>Your Order</h4></div>
            <div className="responsive">
              <table className="table table-responsive tableborderless">
               <thead>
               <tr>
                 <th>Product</th>   
                 <th>Sub Total</th>   
               </tr> 
               </thead>
               <tbody>
                {
                cartData?.length !== 0 && cartData?.map((item, index)=>{
                  return(
                  <tr key={index}>
                   <td>{item?.productTitle.substr(0, 40)+'...'} <b>x {item?.quantity}</b></td>   
                    <td>&#8377; {item?.subTotal}</td>
                 </tr>
                  )}
                )
               } 
               <tr>
                 <td>SubTotal</td>   
                 <td>&#8377; 
                  {
                    cartData.length!== 0 &&
                    cartData.map(item => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                  }</td>
               </tr>  
                  
               </tbody>
              </table>   
            </div> 
            <Button type="submit" className="w100 btn-primary checkout-btn" variant="contained"><IoBagCheckOutline />&nbsp; Checkout </Button>
            </div>
         </div>  
        </div>
        </form>
    </div>

   </section>
  )
}

export default Checkout;