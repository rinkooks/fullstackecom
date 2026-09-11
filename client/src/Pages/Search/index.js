import React,{useContext, useState} from "react";
import { Button } from "@mui/material";
import Sidebar from "../../Components/Sidebar";
import { IoMdMenu } from "react-icons/io";
import { BsGridFill } from "react-icons/bs";
import { BsGrid3X3GapFill } from "react-icons/bs";
import HomeProducts from "../../Components/HomeProducts";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaAngleDown } from "react-icons/fa6";
import Pagination from '@mui/material/Pagination';
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const SearchPage=()=>{
const [productView, setproductView]= useState('four');
const [anchorEl, setAnchorEl] = useState(null);
const openDropDown = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};  

const {id} = useParams();
const location = useLocation();
const [products, setProducts] = useState([]);
const [allProducts, setAllProducts] = useState([]);

const isCategoryPage = location.pathname.includes("category");
const isSubCatPage = location.pathname.includes("subCat");

const [isLoading, setisLoading] = useState(false);
const [productData, setProductData] = useState([]);

const [priceRange, setPriceRange] = useState({
  min: 0,
  max: 100,
});

const context = useContext(MyContext);

useEffect(() => {
  window.scrollTo(0, 0);
  let url="";
  if(isCategoryPage){
   url=`/api/products?categoryId=${id}`;
  }
  else if(isSubCatPage){
    url=`/api/products?subcatId=${id}`;
  } 
    setTimeout(()=>{
      setProducts(context.searchData || []);
      setAllProducts(context.searchData || []);
    }, 500);  
 
  },[context.searchData]);

  useEffect(() => {
  if (allProducts?.length > 0) {
    const prices = allProducts.map((item) => Number(item.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceRange({
      min,
      max,
    });
  }
}, [allProducts]);

  const filterData = (subcatId)=>{
    fetchDataFromApi(`/api/products?subcatId=${subcatId}`).then((res)=>{     
      setProducts(res.productList || []);   
     }) 
  }
 // ================= FILTER PRICE =================
  const filterByPrice = (price, filterId) => {
   // let filteredProducts = [...context.searchData];
   let filteredProducts = [...allProducts];
    filteredProducts = filteredProducts.filter((item) => {
      const itemPrice = Number(item.price);
      return (
        itemPrice >= Number(price[0]) &&
        itemPrice <= Number(price[1])
      );
    });
    setProducts(filteredProducts);
  };
 // ================= FILTER RATING =================
 const filterByRating = (rating, filterId) => {
   // let filteredProducts = [...context.searchData];
   let filteredProducts = [...allProducts];
    filteredProducts = filteredProducts.filter((item) => {
      return Number(item.rating) >= Number(rating);
    });
    setProducts(filteredProducts);
};
return(
  <>
  <section className="mt-5">
  <div className="container">
    <div className="row">
      <div className="col-md-3">
        <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} pageId={id}
isCategoryPage={isCategoryPage} priceRangeData={priceRange} />  
      </div>    
    <div className="col-md-9">
      <div className="shortBy d-flex align-items-center">
        <div className="showByBtn">
          <Button onClick={()=>setproductView('one')} className={productView==='one' && 'active'}><IoMdMenu /></Button>
          <Button onClick={()=>setproductView('three')} className={productView==='three' && 'active'}><BsGridFill /></Button>
          <Button onClick={()=>setproductView('four')} className={productView==='four' && 'active'}><BsGrid3X3GapFill /></Button>
        </div>
        <div className="showList ms-auto">
          <div><Button onClick={handleClick}><span className="me-3">Show</span>  9 <FaAngleDown /></Button>
          <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openDropDown}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>9</MenuItem>
          <MenuItem onClick={handleClose}>13</MenuItem>
          <MenuItem onClick={handleClose}>17</MenuItem>
        </Menu>
          
          </div> 
        </div> 
      </div> 
      <div className="listing mt-4">
      <div className="productRow">
        <div className="row">
          {
            products?.length > 0 && products.map((item,index)=>{
              return(
                <HomeProducts key={index} itemView={productView} item={item} />
              )
            })
          }
        </div>                 

        </div>
        <div className="mt-5"><Pagination count={10} color="primary" /></div>
      </div>  
    </div>    
    </div>
  </div>
  </section>     
  </>   
)
}
export default SearchPage;