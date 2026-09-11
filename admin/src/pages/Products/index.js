import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { Button, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import { FaEye } from "react-icons/fa";


const Products= () =>{

const [products, setProducts] = useState([]);
const [page, setPage] = useState(1);
const context = useContext(MyContext);

const [totalProducts, setTotalProducts] = useState(0);
const [totalCategory, setTotalCategory] = useState(0);
const [totalSubCategory, setTotalSubCategory] = useState(0);

const [productList, setProductList] = useState([]);

 useEffect(()=>{
     context.setProgress(40);
     fetchDataFromApi('/api/products').then((res)=>{
        setProducts(res);
      //  console.log(res);
      context.setProgress(100);
     })

    fetchDataFromApi("/api/products?page=1&perPage=8").then((res)=>{
       setProductList(res);
       context.setProgress(100);
    });
    fetchDataFromApi("/api/products/get/count").then((res)=>{
      setTotalProducts(res.productsCount);
    });
    fetchDataFromApi("/api/category/get/count").then((res)=>{
      setTotalCategory(res.categoryCount);
    });
    fetchDataFromApi("/api/category/subCat/get/count").then((res)=>{
      setTotalSubCategory(res.categoryCount);
    })


   },[]);
   
  const deleteProduct = (id)=>{
     context.setProgress(40);
     deleteData(`/api/products/${id}`).then((res)=>{
        context.setProgress(100);
        context.setAlertBox({
           open:true,
           error:true,
           msg:'Product Deleted'
        })        
        fetchDataFromApi('/api/products').then((res)=>{
        setProducts(res);     
      }) 
     }) 
  } 
  const handleChange=(event, value)=>{
      setPage(1);
      context.setProgress(40);
      fetchDataFromApi(`/api/products?page=${value}&perPage=8`).then((res)=>{
        setProducts(res);
         window.scrollTo({
            top:200,
            behavior:'smooth'
        }) 
        context.setProgress(100);
      })
    }

return(
  <>
  <div className="card shadow border-0 w-100 flex-row p-3 pb-3 align-items-center"> 
       <h5>Products Listing</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link to="/">Home</Link></li>
           <li><Link to="/products">Products</Link></li> 
         </ul>
       </div>
       <Link to="/product/add"><Button className="blue-btn mx-3" variant="contained">Add Product</Button></Link>
     </div>

     <div className="table-responsive-lg mt-5">
       <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th style={{width:'80px'}}>UID</th>
            <th style={{width:'140px'}}>Image</th>
            <th>Product Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Sub Cat</th>
            <th>Brands</th>           
            <th>countInStock</th>
            <th>Price</th>
            <th>Old Price</th>
            <th>IsFeatured</th>
            <th>Rating</th>
            <th>Discount</th>
            <th>Product Rams</th>
            <th>Product Size</th>
            <th>Product Weight</th>
            <th>Action</th>           
          </tr>
         </thead>
         <tbody>
            {            
             products?.productList?.length > 0 && products?.productList?.map((item, index)=>{
             return(
                <tr key={index}>
                <td>#{index+1}</td>
                <td><div className="proImg">{/*<img src={item.images[0]} alt="" />*/}
                  {item.images?.length > 0 ? (
                    <img src={`${context.imageBaseUrl}/uploads/${item.images[0]}`} alt={item.name} />
                  ) : ( <img src={`${context.imageBaseUrl}/uploads/no-image.png`} alt={item.name} /> )}                  
                </div></td>
                <td><div className="proName">{item.name}</div></td>   
                <td>{item?.description}</td>                          
                <td>{item?.category?.name || "No Category"}</td>
                <td>{item?.subCat?.subCat || "No Sub Cat"}</td>
                <td>{item?.brand}</td>      
                <td>{item?.countInStock}</td>
                <td>{item?.price}</td>
                <td>{item.oldprice}</td>
                <td>{String(item.isFeatured)}</td>
                <td><Rating name="read-only" defaultValue={item.rating} precision={0.5} size="small" /></td>
                <td>{item?.discount}</td>
                <td>{item?.productRams?.map((ram, index)=>{
                    return(
                      <span key={index} className="badge text-bg-primary me-1">{ram}</span>
                    ) })}</td>
                <td>{item?.productSize?.map((size, index)=>{
                    return(
                      <span key={index} className="badge text-bg-primary me-1">{size}</span>
                   ) })}</td>
                <td>{item?.productWeight?.map((weight, index)=>{
                    return(
                      <span key={index} className="badge text-bg-primary me-1">{weight}</span>
                    ) })}</td>
                <td>
                <div className="actions d-flex align-items-center">
                   <Link to={`/product/details/${item.id}`}><Button className="success"><FaEye /></Button></Link>                   
                   <Link to={`/product/edit/${item.id}`}><Button className="success"><MdEdit /></Button></Link>   
                   <Button className="error" onClick={()=>deleteProduct(item.id)}><MdOutlineDelete /></Button>   
                   </div>    
                 </td>   
                </tr>  
                )
              })
            } 
         </tbody>
       </table>
     </div>
    {
      products?.totalPages > 1 && 
      <div className="d-flex tableFooter justify-content-between align-items-center">       
            <Pagination count={products?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} /> </div>
    }
  
  </>  
)   

}

export default Products;