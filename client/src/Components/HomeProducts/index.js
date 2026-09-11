import React, { useState } from "react";
import { Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Link } from "react-router-dom";
import { SlSizeFullscreen } from "react-icons/sl";
import { LuHeart } from "react-icons/lu";
import ProductModel from "../ProductModel";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useRef } from "react";

import Slider from "react-slick";
import { fetchDataFromApi, postData } from "../../utils/api";
import { FaHeart } from "react-icons/fa6";

const HomeProducts=(props)=>{
  const [isHovered, setIsHovered] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);

  const [isAddedToMyList, setIsAddedToMyList] = useState(false);

   // const [isProModelOpen, setisProModelOpen]= useState(false);

  /* const viewProductDetails = (id)=>{
      context.openProductDetailsModel(id, true);
   }*/

    const openQuickView=(id)=>{
       // setisProModelOpen(true)
       context.setIsOpenProductModal({
        id:id,
        open:true
       }) 
    }
       
    const context = useContext(MyContext);

    const sliderRef = useRef();

    var settings = {
        dots : true,
        infinite: true,
        loop: true,
        speed:500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true,
        adaptiveHeight:true
    };

    const handleMouseEnter = (id) =>{
      if(isLoading === false){
       setIsHovered(true);
       setTimeout(()=>{
          if(sliderRef.current){
            sliderRef.current.slickPlay();
         }
       }, 20);
      }
    const user = JSON.parse(localStorage.getItem("user"));  
    fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
      if(res.length!==0){
          setIsAddedToMyList(true);
      }      
    });     
    }

    const handleMouseLeave= ()=>{
        setIsHovered(false);
        setTimeout(()=>{
          if(sliderRef.current){
            sliderRef.current.slickPause();
          }  
        }, 20) 
    }

  const addToMyList = (id) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if(user!== undefined && user!== null && user!== ""){
     const data = {
        productTitle: props?.item?.name,
        image: props.item?.images[0],
        rating: props?.item?.rating,
        price: props?.item?.price,
        productId: id,
        userId: user?.userId
      };
      postData(`/api/my-list/add`, data).then((res) => {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "The product added in my list"
          });
           fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
            if(res.length!==0){
                setIsAddedToMyList(true);
            }      
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
      <div className={`item productItem ${props.itemView}`} onMouseEnter={()=>handleMouseEnter(props?.item?.id)} onMouseLeave={handleMouseLeave}>
        <div>
        <div className="imgWraper">
            <Link to={`/details/${props?.itemView=== 'recentlyView' ? props.item?.prodId : props.item?.id}`}>
              {
                isHovered === true ?
               <Slider {...settings} ref={sliderRef}>
                {
                props.item?.images?.map((image, index) => {
                  return(
                  <div key={index}>
                    <img src={`${context.imageBaseUrl}/uploads/${image}`} alt="" />
                  </div>
                  )
                })
                }
                </Slider>
                :
               <img src={`${context.imageBaseUrl}/uploads/${props.item?.images[0]}`} alt="" />
              }
            
            </Link>
            <div className="pro-budge">{props?.item?.discount}%</div>
            <div className="prohvBtn">
            {/*<Button onClick={()=>viewProductDetails(props?.itemView === 'recentlyView' ? props?.item?.prodId : 
             props.item?.id)}><SlSizeFullscreen /></Button> */}
            <Button onClick={()=>openQuickView(props.item?.id)}><SlSizeFullscreen /></Button>
            <Button className={isAddedToMyList === true && 'active'} onClick={()=>addToMyList(props.item?.id)}>
             {
              isAddedToMyList === true ? <FaHeart style={{fontSize:'20px', color:'red'}} />
              :
              <LuHeart style={{fontSize:'20px'}} />
             } 
            </Button>
            </div>
        </div>
        <div className="proCont">
            <h3><Link to={`/details/${props?.item?.id}`}>{props?.item?.name.substr(0,30)+'...'}</Link></h3>
            <p className="stockAvbl mb-2">In Stock</p>
            <p className="review mb-1">                       
                <Rating name="half-rating" defaultValue={2.5} value={props?.item?.rating} precision={0.5} />                         
            </p>
            <div className="priceView">
            <span className="oldPrice">RS {props?.item?.oldprice}</span>
            <span className="newPrice">RS {props?.item?.price}</span>
            </div>
            <div className="proBtn mt-3"><Button>Add to Cart</Button></div> 
        </div>
        </div>
        </div>
       {
        /* isProModelOpen === true && <ProductModel closeProductModel={closeProductModel} /> */
        }
        
     </>
    )
}

export default HomeProducts;