import React, { useContext, useRef } from "react";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MyContext } from "../../App";

const ProductZoom=(props)=>{
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
      var settings2 = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows:true
      };
    
      const zoomSliderBig= useRef();
      const zoomSlider = useRef();
    
      const goto = (index) => {   
          zoomSlider.current.slickGoTo(index);
          zoomSliderBig.current.slickGoTo(index);
      };
      const context = useContext(MyContext);
      
   return(
    <>
    <div className="ProductZoom">
        <Slider {...settings} className="zoomSliderBig" ref={zoomSliderBig}>
          {
          props?.images?.map((img, index)=>(
           <div key={index} className="imgWraper zoomBig">
              <InnerImageZoom zoomType="hover" zoomScale={1} src={`${context.imageBaseUrl}/uploads/${img}`} />                
              <div className="pro-budge">{props.discount}%</div>
            </div> 
            )
          )
         }                      
        </Slider>
        </div>
        {
          props?.images?.length > 1 && 
          <>
          <Slider {...settings2} className="zoomSliderSmall" ref={zoomSlider}>
            {
              props?.images?.map((img, index)=>(
              <div key={index} className="item thumbnail">
                  <img src={`${context.imageBaseUrl}/uploads/${img}`} className="" onClick={()=>goto(index)} alt="" />
                </div> 
                )
              )
            }         
        </Slider>
          </> 
        }
            
    </>
   ) 
}

export default ProductZoom;