import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { Button, Rating } from "@mui/material";
import Pagination from '@mui/material/Pagination';

const Home = () =>{
const [products, setProducts] = useState([]);
const context = useContext(MyContext);
const [categoryValue, setCatgoryValue] = useState('');

const [categoryCount, setCategoryCount] = useState(0);
const [productCount, setProductCount] = useState(0);
const [userCount, setUserCount] = useState(0);
const [newsletterCount,setNewsletterCount]=useState(0);

useEffect(()=>{
context.setIsHideSidebarandHeader(false);
window.scroll(0,0);

// Category Count
fetchDataFromApi("/api/category/get/count").then((res) => {
  setCategoryCount(res.categoryCount);
});
// Product Count
fetchDataFromApi("/api/products/get/count").then((res) => {
  setProductCount(res.productsCount);
});
// User Count
fetchDataFromApi("/api/user/get/count").then((res) => {
  setUserCount(res.userCount);
});
// Newsletter Count
fetchDataFromApi("/api/newsletter/count").then((res)=>{
  setNewsletterCount(res.total);
});
},[]);  

useEffect(()=>{
    context.setProgress(40);
    fetchDataFromApi('/api/products').then((res)=>{
      setProducts(res);
    //  console.log(res);
    context.setProgress(100);
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
  context.setProgress(40);
  fetchDataFromApi(`/api/products?page=${value}`).then((res)=>{
    setProducts(res);
    console.log(res);
    context.setProgress(100);
  })
}
const handleChangeCatgory = (event) => {
setCatgoryValue(event.target.value); 
}

return(
<>

 <div> 
 <h1>Welcome to admin Panel</h1>
 <p>Here's What's going on with your store today  </p>
 <div className="row mt-4">
  <div className="col-md-3">
   <div className="dashboardBox clrBox1 border p-4 shadow-sm rounded-3">
   <h5>Category</h5>
   <h2>{categoryCount}</h2>
   </div>
  </div>
  <div className="col-md-3">
   <div className="dashboardBox clrBox2 border p-4 shadow-sm rounded-3">
   <h5>Products</h5>
   <h2>{productCount}</h2>
   </div>
  </div>
  <div className="col-md-3">
   <div className="dashboardBox clrBox3 border p-4 shadow-sm rounded-3">
   <h5>User</h5>
   <h2>{userCount}</h2>
   </div>
  </div>
  <div className="col-md-3">
   <div className="dashboardBox clrBox4 border p-4 shadow-sm rounded-3">
   <h5>Newsletter Subscribers</h5>
   <h2>{newsletterCount}</h2>
   </div>
  </div>
</div>

    <div className="mt-4">
    <div className="d-inline-block col-3 me-3">
        <label htmlFor="name" className="mb-1">Show By</label>
      <select className='form-control'>
        <option value="">none</option>
        <option value=""></option>
      </select> 
    </div>
    <div className="d-inline-block col-3">
      <label htmlFor="name" className="mb-1">Category By</label>
      <select className='form-control' value={categoryValue} onChange={handleChangeCatgory}>
        <option value="">Select Category</option>
          {
          context.catData?.length > 0 && context.catData?.map((cat, index)=>{
            return(
              <option key={index} value={cat.id}>{cat.name}</option>       
            )
          })
        }
      </select> 
    </div>
    </div>
    <div className="table-responsive mt-4">
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
              ) : ( <img src={`${context.imageBaseUrl}/uploads/no-image.png}`} alt={item.name} /> )}                  
            </div></td>
            <td><div className="proName">{item.name}</div></td>   
            <td>{item.description}</td>                          
            <td>{item.category?.name || "No Category"}</td>
            <td>{item?.subCat?.subCat || "No Sub Cat"}</td>
            <td>{item.brand}</td>      
            <td>{item.countInStock}</td>
            <td>{item.price}</td>
            <td>{item.oldprice}</td>
            <td>{item.isFeatured ? "Yes" : "No"}</td>
            <td><Rating name="read-only" defaultValue={item.rating} precision={0.5} size="small" /></td>               
            <td>
            <div className="actions d-flex align-items-center">                   
                <Button className="success"><MdEdit /></Button>   
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
</div>
</>
)
}
export default Home;