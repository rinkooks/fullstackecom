import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { RiCloseLargeFill } from "react-icons/ri";
import Rating from '@mui/material/Rating';
import QuantiyDetails from "../QuantityDetails";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { MdOutlineCompareArrows } from "react-icons/md";
import ProductZoom from '../ProductZoom';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';
import { LuHeart } from 'react-icons/lu';

const ProductModel=(props)=>{
  const [productQuantity, setProductQuantity] = useState(1);
  const [tabError, setTabError] = useState(false);
  const [activeSize, setactiveSize] = useState(null);
  const [activeTab, setactiveTab]= useState(1);

  const [isAddedToMyList, setIsAddedToMyList] = useState(false);

  const context = useContext(MyContext);

useEffect(()=>{
 /* if(props?.data?.productRam.length === 0 && props?.data?.productWeight.length === 0 && 
    props?.data?.productSize.length === 0){
      setactiveSize(1);
    }*/

    const user = JSON.parse(localStorage.getItem("user"));  
      fetchDataFromApi(`/api/my-list?productId=${props?.data?.id}&userId=${user?.userId}`).then((res)=>{
        if(res.length!==0){
            setIsAddedToMyList(true);
        }      
      });    
},[]);
  
  const isActive=(index)=>{
      setactiveSize(index)
      setTabError(false);
   }
   const quantity=(val)=>{
    setProductQuantity(val);
  } 
  const addtoCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please login first"
    });
    return;
  }
  if (!productQuantity || productQuantity <= 0) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please select quantity"
    });
    return;
  }

  if(activeSize !==null){
   const newCartItem = {
      productTitle: props?.data?.name,
      image: props?.data?.images?.[0],
      rating: props?.data?.rating,
      price: props?.data?.price,
      quantity: productQuantity,
      subTotal: parseInt(props?.data?.price * productQuantity),
      productId: props?.data?.id,
      userId: user?.userId
    };    
    context.addToCart(newCartItem);
  }else{
    setTabError(true);
  }  
};

const addToMyList = (id) => {
const user = JSON.parse(localStorage.getItem("user"));

if(user!== undefined && user!== null && user!== ""){
  const data = {
    productTitle: props?.data?.name,
    image: props?.data?.images[0],
    rating: props?.data?.rating,
    price: props?.data?.price,
    productId: id,
    userId: user?.userId
  };
  postData(`/api/my-list/add`, data).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "The product added in my list"
      });
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Product already added in My List"
        });
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Something went wrong"
        });
      }
      console.log(error);
    });
  }else{
  context.setAlertBox({
    open: true,
    error: true,
    msg: "Please Login to Continue"
  });
}
}; 

    return(
      <>
       <Dialog open={context.isOpenProductModal.open} onClose={()=>context.setIsOpenProductModal({id: '', open:false})}>
         <div className='mb-2'><h3>{props?.data?.name}</h3></div> 
         <Button className="closeModel" onClick={()=>context.setIsOpenProductModal(false)}><RiCloseLargeFill /></Button> 
         <div className='d-flex align-items-center border-bottom pb-4 mb-4'>
           <div className='proBrand me-4'><span className='me-2'>Brands</span><span>{props?.data?.brand}</span></div>
           <div className='proRating me-4 d-flex align-items-center'>
            <span className='me-2'><Rating name="size-small" value={parseInt(props?.data?.rating)} defaultValue={4} size="small" readOnly  /></span><span>1 review</span></div>
           <div className='proSku'><span className='me-1'>SKU:</span><span>Welch's</span></div>
         </div>
         <div className='modelProDetails'>          
             <div className='row'>
               <div className='col-sm-6'>
                 <ProductZoom images={props?.data?.images} discount={props?.data?.discount} />
               </div>
               <div className='col-sm-6'>
               <div className="priceView mb-3">
                  <span className="oldPrice">$ {props?.data?.oldprice}</span>
                   <span className="newPrice">$ {props?.data?.price}</span>
                </div>
                <p className="stockAvbl mb-4"><span>In Stock</span></p>
                <p>{props?.data?.description}</p>
                <div className="d-flex align-items-center mt-4">
                  <QuantiyDetails quantity={quantity} />
                  <Button className="addtocart blue-btn">Add To Cart</Button>
                </div>
                <div className="d-flex align-items-center mt-4">
                  <Button variant="text" className={`me-3 bdr-btn btn-round ${isAddedToMyList === true && 'active'}`} onClick={()=>addToMyList(props?.data?.id)}>
                    {
                      isAddedToMyList === true ? <FaHeart style={{fontSize:'20px', color:'red'}} />
                      :
                      <LuHeart style={{fontSize:'20px'}} />
                    }   
                    </Button>
                  <Button variant="text" className="bdr-btn btn-round"><MdOutlineCompareArrows /> Compare</Button>
                </div>
                </div> 
              </div>  
                        
         </div>
       </Dialog> 
      </>  
    )
}

export default ProductModel;