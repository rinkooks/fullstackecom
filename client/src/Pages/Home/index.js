import { Link } from "react-router-dom";
import HomeSlider from "../../Components/HomeSlider";
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeProducts from "../../Components/HomeProducts";
import addbanner1 from './../../assets/images/add-banner1.jpg';
import addbanner2 from './../../assets/images/add-banner2.jpg';
import HomeCategories from "../../Components/HomeCategories";
import HomeNewsletter from "../../Components/HomeNewsletter";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRef } from "react";

const Home=()=>{
const sliderRef = useRef(null);
const productSlideOption = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

 const [featuredProducts, setFeaturedProducts] = useState([]);
 const [productsData, setProductsData] = useState([]);
 const [electronicsData, setElectronicsData] = useState([]);
 const [selectedCat, setSelectedCat] = useState('Fashion');
 const [filterData, setFilterData] = useState([]);

 const [homeBannerData, setHomeBannerData] = useState([]);

 const [electronicsCategory, setElectronicsCategory] = useState(null);
 const [electronicsProducts, setElectronicsProducts] = useState([]);
 
 const context = useContext(MyContext);

  const [value, setValue] = React.useState(0);
 
  const handleChange = (event, newValue) => {
  setValue(newValue);
  setSelectedCat(context.categoryData[newValue]?.name);
};

  const selectCat = (cat)=>{
     setSelectedCat(cat)
  }

 useEffect(()=>{
  
  // setSelectedCat(context.categoryData[0]?.name);  

  /* fetchDataFromApi("/api/products?perPage=8").then((res)=>{      
      setProductsData(res);
 });*/
 const location = localStorage.getItem("location");
 let url = `/api/products?perPage=8`;

 if (location && location !== "All") {
  url += `&location=${location}`;
 }
fetchDataFromApi(url).then((res) => {
  setProductsData(res);
});

/* fetchDataFromApi("/api/products/featured").then((res)=>{      
      setFeaturedProducts(res);
   }); */ 

let featuredUrl = `/api/products/featured`;
if (location && location !== "All") {
  featuredUrl += `?location=${location}`;
}
fetchDataFromApi(featuredUrl).then((res) => {
  setFeaturedProducts(res);
});

fetchDataFromApi(`/api/homeBanner`).then((res)=>{
    setHomeBannerData(res);
})
  
 }, []);

useEffect(()=>{
  if(context.categoryData?.length > 0){
    setSelectedCat(context.categoryData[0].name);
  }
}, [context.categoryData]);

useEffect(()=>{
  if(selectedCat){
    const location = localStorage.getItem("location");

   /* fetchDataFromApi(`/api/products?catName=${selectedCat}&location=${location}`).then((res)=>{      
      setFilterData(res?.productList || []);
      console.log(res);
    });*/
   let url = `/api/products?catName=${selectedCat}`;

    if (location && location !== "All") {
      url += `&location=${location}`;
    }

    fetchDataFromApi(url).then((res) => {
      setFilterData(res?.productList || []);
    }); 
  }
},[selectedCat])

useEffect(() => {
  if (!context.categoryData?.length) return;

  const electronics = context.categoryData.find(
    (cat) => cat.name?.toLowerCase() === "electronics"
  );

  if (!electronics) {
    setElectronicsCategory(null);
    setElectronicsProducts([]);
    return;
  }

  setElectronicsCategory(electronics);

  const location = localStorage.getItem("location");

  let url = `/api/products?categoryId=${electronics._id}&perPage=20`;

  if (location && location !== "All") {
    url += `&location=${location}`;
  }
  fetchDataFromApi(url).then((res) => {
    setElectronicsProducts(res?.productList || []);
  });
}, [context.categoryData]);


useEffect(() => {
  setTimeout(() => {
    sliderRef.current?.slickGoTo(0);
    sliderRef.current?.innerSlider?.onWindowResized();
  }, 100);
}, [selectedCat, filterData]);
return(
<>
{
homeBannerData?.length > 0 && <section><HomeSlider slideData={homeBannerData} /></section> 
}
  
{
context.categoryData?.length > 0 && <HomeCategories catData={context.categoryData}  />
}
<section className="pt-4 pb-4 mt-3">
<div className="container">
  <div className="row">
    <div className="col-lg-3">
      <div className="add-banner">
        <div className="leftBnr"><img src={addbanner1} alt="" /></div> 
        <div className="leftBnr mt-5"><img src={addbanner2} alt="" /></div> 
      </div>
    </div>
    <div className="col-lg-9">
      <article>
      <div className="d-flex justify-content-between align-items-center tabSec">
        <div className="homeHd"><h2>Popular Products</h2>
          <p>Dont miss this opportunity at a special discount just for this week.</p>
        </div>
        <div className="me-auto" style={{maxWidth: '560px'}}>
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {
          context.categoryData?.map((item, index)=>{
            return(
              <Tab key={index} label={item.name} />
            )
          })
        }
        </Tabs>               
      </div></div>
      <div className="product_row">                
          <Slider ref={sliderRef} {...productSlideOption}>
          {filterData?.map((item, index) => (
            <div key={item.id || index}>
              <HomeProducts item={item} />
            </div>
          ))}
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
            <div className="col-xl-3 col-md-4 col-sm-6 col-xs-6" key={index}>                    
              <HomeProducts item={item} />                    
            </div>  
            )                       
          })
          }                              
        </div> 
    </div>         
    </article>
    <article className="mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <div className="homeHd"><h2>Electronics Products</h2>
          <p>Dont miss this opportunity at a special discount just for this week.</p>
        </div>
        <div className="vwBtn">
          <Button><Link to={electronicsCategory ? `/products/category/${electronicsCategory._id}` : "#" }>View All 
          <IoIosArrowRoundForward /></Link></Button></div>
      </div>
      <div className="product_row">                
       {electronicsProducts.length > 0 ? (
       <Slider {...productSlideOption}> 
        {electronicsProducts.map((item, index) => (
          <div key={item._id || index}>
            <HomeProducts item={item} />
          </div>
        ))}
      </Slider>
      ) : (
      <p className="text-center py-4">
        No Electronics Products Found
      </p>
      )}              
      </div>
      </article> 
    </div> 
  </div>
  </div>
  </section> 
  <HomeNewsletter />       
</>  
)}
export default Home;