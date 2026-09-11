
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeProducts from "../HomeProducts";

const RelatedProducts=(props)=>{
    var relatedProduct = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    };

    return(
     <>
      <div className="mb-4"><h3>{props.title}</h3></div>
      <Slider {...relatedProduct}>
        {
            props?.data?.length !== 0 && props?.data?.map((item, index)=>{
              return(
               <div key={index}><HomeProducts item={item} itemView={props.itemView} /></div>
              )  
            })
        }
      </Slider>
     </>   
    )
}

export default RelatedProducts;