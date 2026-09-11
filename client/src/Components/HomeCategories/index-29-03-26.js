import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cat13 from './../../assets/images/cat-13.png';

const HomeCategories=(props)=>{
    var catSlideOption = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1
      };
    return(
      <>
      <section className="pt-5 pb-5 mt-2">
      <div className="container">
      <div className="homeHd mb-3"><h2>Featured Categories</h2></div>
      <Slider {...catSlideOption}>
        {
          props.catData?.categoryList?.length > 0 && props.catData?.categoryList?.map((cat, catIndex)=>{
            return(
                <div key={catIndex}>
                <div className="catItem" style={{backgroundColor:cat.color}}>
                 <div className="catImg"><img src={cat.images[0]} alt="" /></div>
                  <h6>{cat.name}</h6>
                  <p>7 Products</p> 
                </div>
               </div> 
            )
         })  
        }
        
      </Slider>
      </div>
      </section>
      </>  
    )
}

export default HomeCategories;