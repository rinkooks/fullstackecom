import { Link } from "react-router-dom";
import HomeSlider from "../../Components/HomeSlider";
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeProducts from "../../Components/HomeProducts";
import addbanner1 from './../../assets/images/add-banner1.jpg';
import addbanner2 from './../../assets/images/add-banner2.jpg';
import HomeCategories from "../../Components/HomeCategories";
import HomeNewsletter from "../../Components/HomeNewsletter";
import { fetchDataFromApi } from "../../utils/api";

const Honme=()=>{
  var productSlideOption = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

 const [catData, setCatData] = useState([]);
 const [featuredProducts, setFeaturedProducts] = useState([]);
 const [productsData, setProductsData] = useState([])
 
 useEffect(()=>{
   fetchDataFromApi("/api/category").then((res)=>{
      setCatData(res);
   })

   fetchDataFromApi("/api/products/featured").then((res)=>{      
      setFeaturedProducts(res);
   }); 
   fetchDataFromApi("/api/products").then((res)=>{      
      setProductsData(res);
   });   
 }, [])

    return(
      <>
      <section><HomeSlider /></section>
     {
      catData?.length !==0 &&  <HomeCategories catData={catData}  /> 
     }
      <section className="pt-4 pb-4 mt-3">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
             <div className="add-banner">
               <div className="leftBnr"><img src={addbanner1} alt="" /></div> 
               <div className="leftBnr mt-5"><img src={addbanner2} alt="" /></div> 
             </div>
            </div>
            <div className="col-md-9">
              <article>
              <div className="d-flex justify-content-between align-items-center">
                <div className="homeHd"><h2>Featured Products</h2>
                  <p>Dont miss this opportunity at a special discount just for this week.</p>
                </div>
                <div className="vwBtn"><Button><Link to="/">View All <IoIosArrowRoundForward /></Link></Button></div>
              </div>
              <div className="product_row">                
                <Slider {...productSlideOption}>
                  {
                    featuredProducts?.length !== 0 && featuredProducts?.map((item, index)=>{
                     return(
                      <div key={index}>
                        <HomeProducts item={item} />
                     </div>
                      )                       
                    })
                  }
                </Slider>                
              </div>
              </article>
              <article className="mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="homeHd"><h2>New Products</h2>
                  <p>New products with updated stocks.</p>
                </div>
                <div className="vwBtn"><Button><Link to="/">View All <IoIosArrowRoundForward /></Link></Button></div>
              </div>
              <div className="product_row">
               <div className="row">               
                  {
                  productsData?.productList?.length !== 0 && productsData?.productList?.map((item, index)=>{
                    return( 
                    <div className="col-md-3 col-sm-4 col-xs-6" key={index}>                    
                      <HomeProducts item={item} />                    
                    </div>  
                    )                       
                  })
                  }                              
               </div> 
            </div>         
            </article> 
            </div> 
          </div>
         </div>
         </section> 
         <HomeNewsletter />       
      </>  
    )
}

export default Honme;