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
  const [products, setProducts] = useState([])

  const [isLoading, setisLoading] = useState(false);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
  window.scrollTo(0, 0);

  let apiEndPoint = "";

  if (window.location.pathname.includes('subCat')) {
    apiEndPoint = `/api/products?subcatId=${id}`;
  } else if (window.location.pathname.includes('category')) {
    apiEndPoint = `/api/products?categoryId=${id}`;
  } else {
    return;
  }

  console.log("API URL:", apiEndPoint);

  setisLoading(true);

  fetchDataFromApi(apiEndPoint).then((res) => {
    setProducts(res.productList || []);
    setisLoading(false);
  });

  //   fetchDataFromApi(`/api/products?subcatId=${id}`).then((res)=>{     
  //    setProducts(res.productList);
  //   })
  },[id]);

  const filterData = (subcatId)=>{
    fetchDataFromApi(`/api/products?subcatId=${subcatId}`).then((res)=>{     
      setProducts(res.productList);   
     }) 
  }

  /* const filterByPrice=(price, subcatId)=>{
     fetchDataFromApi(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subcatId=${subcatId}`).then((res)=>{
      setProducts(res.productList);
     })
  }*/

/*const filterByPrice = (price, subcatId) => {
  if (!price || !Array.isArray(price) || price.length < 2) return;

  const min = Number(price[0]);
  const max = Number(price[1]);

  if (!min && min !== 0) return;
  if (!max && max !== 0) return;

  fetchDataFromApi(`/api/products?minPrice=${min}&maxPrice=${max}&subcatId=${subcatId}`)
    .then((res) => {
      setProducts(res.productList);
    });   
};*/
const filterByPrice = (price, id) => {
  const min = price[0];
  const max = price[1];

  let url = '';

  if (window.location.pathname.includes('subCat')) {
    url = `/api/products?minPrice=${min}&maxPrice=${max}&subcatId=${id}`;
  } else {
    url = `/api/products?minPrice=${min}&maxPrice=${max}&categoryId=${id}`;
  }

  fetchDataFromApi(url).then((res) => {
    setProducts(res.productList);
  });
};

  const filterByRating=(rating, subcatId)=>{
     alert(rating);
     console.log("Rating:", rating, "SubCat:", subcatId);
      fetchDataFromApi(`/api/products?rating=${rating}&subcatId=${subcatId}`).then((res)=>{
      setProducts(res.productList);
     })
  }

    return(
     <>
     <section className="mt-5">
      <div className="container">
        <div className="row">
         <div className="col-md-3">
           <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} />  
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
                Array.isArray(products) && products.map((item, index)=>{
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