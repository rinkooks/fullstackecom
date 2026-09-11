import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from '@mui/material/Rating';
import ProductZoom from "../../components/ProductZoom";

const ProductDetails = ()=>{
 const zoomSliderBig= useRef();
 const zoomSlider = useRef();   
 const [productData, setProductData] = useState([]);
 const {id} = useParams();

 const [reviewsData, setReviewsData] = useState([]);
 const [tabError, setTabError] = useState(false);

 useEffect(()=>{
    window.scrollTo(0,0);
    fetchDataFromApi(`/api/products/${id}`).then((res)=>{
      setProductData(res);
    });
    fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res)=>{
      if(Array.isArray(res)){
          setReviewsData(res);
      }else{
          setReviewsData([]);
      }
    })
 },[]);

const [rating, setRating] = useState(1);
const [reviews, setReviews] = useState({
    productId:'',
    customerName:'',
    customerId:'',
    review:'',
    customerRating:1
});

  return(
    <>
    <div className="details lightBg pb-3">
    <div className="card shadow border-0 w-100 flex-row p-3 pb-3 align-items-center"> 
    <h5>Products Details</h5>            
    <div className="breadcrumbs">
      <ul>
        <li><Link>Home</Link></li>
        <li><Link>Admin</Link></li>
        <li><Link>orders</Link></li> 
      </ul>
     </div>
    </div>
    <div className="content-bg mt-5">
          <div className="row">
            <div className="col-md-5 text-center">
            <div className="proZoombox">   
             <ProductZoom images={productData?.images} discount={productData?.discount} /> 
             </div>
            </div>
            <div className="col-md-7">
            <div className='mb-3'><h3>{productData?.name}</h3></div>
            <div className="row proBrand mb-2">
                 <div className="col-sm-3"><span>Brands</span></div> 
                 <div className="col-sm-9"><span>{productData?.brand}</span></div> 
             </div>
            <div className="row mb-2">
                 <div className="col-sm-3"><span>Cateory</span></div> 
                 <div className="col-sm-9"><span>{productData?.catName}</span></div> 
             </div>
            {
             productData?.productRams?.length !== 0 && 
             <div className="row mb-2">
                 <div className="col-sm-3"><span>Product Ram</span></div> 
                 <div className="col-sm-9">
                    <ul className="list list-inline tag sml mb-0">
                      {
                        productData?.productRams?.map((item,index)=>{
                          return(
                            <li className="list-inline-item"><span>{item}</span></li>
                          )
                        })
                      }
                    </ul> 
                 </div> 
             </div> 
            }  
            {
             productData?.productSize?.length !== 0 && 
             <div className="row mb-2">
                 <div className="col-sm-3"><span>Product Ram</span></div> 
                 <div className="col-sm-9">
                    <ul className="list list-inline tag sml mb-0">
                      {
                        productData?.productSize?.map((item,index)=>{
                          return(
                            <li className="list-inline-item"><span>{item}</span></li>
                          )
                        })
                      }
                    </ul> 
                 </div> 
             </div> 
            }  
            {
             productData?.productWeight?.length !== 0 && 
             <div className="row mb-2">
                 <div className="col-sm-3"><span>Product Ram</span></div> 
                 <div className="col-sm-9">
                    <ul className="list list-inline tag sml mb-0">
                      {
                        productData?.productWeight?.map((item,index)=>{
                          return(
                            <li className="list-inline-item"><span>{item}</span></li>
                          )
                        })
                      }
                    </ul> 
                 </div> 
             </div> 
            }  
           
            <div className="row mb-2">
                 <div className="col-sm-3"><span>Review</span></div> 
                 <div className="col-sm-9"> <span>({reviewsData?.length}) Review</span></div> 
             </div>
            <div className="row mb-3">
                 <div className="col-sm-3"><span>Published</span></div> 
                 <div className="col-sm-9"> <span>{productData?.dateCreated}</span></div> 
             </div>
            </div>   
          </div>
        <div className="mt-5">
           <h5>Product Description</h5> 
          <p>{productData?.description}</p>
        </div>
        {
          reviewsData?.length!== 0 &&
          <>
        <div className="mt-5 reviewsSection">
           <h5>Product Reviews</h5> 
          {
            reviewsData?.length!== 0 && reviewsData?.map((review, index)=>{
              return(
                <div className="card p-4 reviewCard flex-row shadow mb-4" key={index}>                    
                  <div className="info">
                   <div className="d-flex align-items-center justify-content-between w-100">
                    <h5>{review?.customerName}</h5>                    
                    <div className="ml-auto">
                     <Rating name="half-rating-read" value={review?.customerRating} readOnly size="small" />
                    </div> 
                   </div> 
                  <h6>{review?.dateCreated}</h6>  
                   <p>{review?.review}</p>
                  </div>
              </div>
              )
            })
          }
        </div>
        </>
        }    
       </div>
    </div>    
    </>  
 )
}
export default ProductDetails;