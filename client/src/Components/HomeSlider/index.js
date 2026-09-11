import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import banner1 from './../../assets/images/banner1.jpg';
//import banner2 from './../../assets/images/banner2.jpg';


const HomeSlider=(props)=>{
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
   return(
    <>
    <div className="homeSlider">
    <Slider {...settings}>
      {
        props?.slideData?.length !== 0 && props?.slideData?.map((item, index)=>{
          return(
           <div key={index}><img src={item?.images[0]} alt="banner1" /></div>
          )
        })
      }   
    </Slider>
    </div>
    </>
   ) 
}

export default HomeSlider;