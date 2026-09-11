import React,{useState} from "react";
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

const Listing=()=>{
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

  const isCategoryPage = location.pathname.includes("category");
  const isSubCatPage = location.pathname.includes("subCat");

  const [isLoading, setisLoading] = useState(false);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
  window.scrollTo(0, 0);

  let url="";

  if(isCategoryPage){
   url=`/api/products?categoryId=${id}`;
  }
  else if(isSubCatPage){
    url=`/api/products?subcatId=${id}`;
  }

  fetchDataFromApi(url).then((res)=>{
    setProducts(res.productList || []);
  })
  },[id,location.pathname]);

  const filterData = (subcatId)=>{
    fetchDataFromApi(`/api/products?subcatId=${subcatId}`).then((res)=>{     
      setProducts(res.productList || []);   
     }) 
  }

 
const filterByPrice=(price,filterId)=>{
  let url="";
  if(isCategoryPage){
  url=`/api/products?categoryId=${filterId}&minPrice=${price[0]}&maxPrice=${price[1]}`;
  }
  else{
  url=`/api/products?subcatId=${filterId}&minPrice=${price[0]}&maxPrice=${price[1]}`;
  }
  fetchDataFromApi(url).then((res)=>{
    setProducts(res.productList || []);
  })
}

const filterByRating=(rating,filterId)=>{
  let url="";
  if(isCategoryPage){
  url=`/api/products?categoryId=${filterId}&rating=${rating}`;
  }
  else{
  url=`/api/products?subcatId=${filterId}&rating=${rating}`;
  }
  fetchDataFromApi(url).then((res)=>{
    setProducts(res.productList || []);
  })
}

    return(
     <>
     <section className="mt-5">
      <div className="container">
        <div className="row">
         <div className="col-md-3">
           <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} pageId={id}
isCategoryPage={isCategoryPage} />  
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

export default Listing;