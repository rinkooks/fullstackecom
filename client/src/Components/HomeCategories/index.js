import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const HomeCategories=(props)=>{
var catSlideOption = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
      },
    },
    ],
};
return(
  <>
  <section className="pt-5 pb-5 mt-2">
  <div className="container">
  <div className="homeHd mb-3"><h2>Featured Categories</h2></div>
  <Slider {...catSlideOption}>
    {
      props.catData?.length > 0 && props.catData?.map((cat, catIndex)=>{
        return(
          <div key={catIndex}>
            <Link to={`/products/category/${cat._id}`}>  
            <div className="catItem" style={{backgroundColor:cat.color}}>
              <div className="catImg"><img src={cat.images[0]} alt="" /></div>
              <h6>{cat.name}</h6>
              <p>7 Products</p> 
            </div>
            </Link> 
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