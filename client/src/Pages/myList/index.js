import { Button, Rating, Table } from "@mui/material";
import { Link } from "react-router-dom";
import QuantiyDetails from "../../Components/QuantityDetails";
import emptyCart from './../../assets/images/list.png';
import { MdClose } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

const MyList=()=>{
 const [myListData, setMyListData] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 let [cartFields, setCartFields] = useState({});

 const context = useContext(MyContext); 
 
 useEffect(()=>{
   const user = JSON.parse(localStorage.getItem("user"));
   fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res)=>{
      setMyListData(res);
   })

  /* fetchDataFromApi('/api/my-list').then((res)=>{
      setMyListData(res);
   }) */
 },[]) 


const removeItem=(id)=>{
   deleteData(`/api/my-list/${id}`).then((res)=>{
      context.setAlertBox({
         open:true,
         error:false,
         msg:"Item removed from My List"
      });

      const user = JSON.parse(localStorage.getItem("user"));
      fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res)=>{
         setMyListData(res);
      })    
   })
}
    return(
     <>     
      <section className="pt-5 pb-4 cart-page"> 
        <div className="container">          
             <div className="mb-4"><h2>My WishList</h2>
             <p>There are <b className="text-red">{myListData?.length}</b> products in your List</p>
             </div>
             {
               myListData?.length !== 0 ?
             
             <div className="row">                                                                                  
               <div className="col-md-8 offset-md-2">
                 <Table className="table-responsive table-bordered cart-table">
                   <thead>
                    <tr>
                     <th width="6%">Image</th>
                     <th width="25%">Product Name</th>
                     <th width="10%">Price</th>                    
                     <th width="7%">Remove</th>
                     </tr> 
                    </thead>
                    <tbody>
                     {
                      myListData?.length !== 0 && myListData?.map((item, index)=>{
                        return(
                       <tr key={index}>
                        <td>
                        <div className="imgWraper"><img src={`${context.imageBaseUrl}/uploads/${item?.image}`} alt={item?.productTitle} />
                       </div>
                        </td>
                        <td><h6><Link to={`/details/${item?.productId}`}>{item?.productTitle}</Link></h6>
                           <Rating name="read-only" value={item.rating} readOnly size="small" />
                        </td>
                        <td><span className="newPrice">{item.price}</span></td>  
                        <td className="text-center"><div className="removeItem" onClick={()=>removeItem(item?._id)}><Button><MdClose /></Button></div></td>  
                       </tr>   
                       ) 
                       })
                     }                       
                    </tbody> 
                 </Table> 
               </div>              
             </div>
              :  
            <div className="empty d-flex align-items-center justify-content-center flex-column mb-4">
              <div className="mb-3"><img src={emptyCart} alt="" width="128" /> </div>
              <h3 className="mb-3">My List is currently empty </h3>
              <Link to="/"> 
                <Button className="blue-btn bg-red btn-lg btn-round"><FaHome />&nbsp; Continue Shopping</Button>
              </Link>
            </div>
            }   
          
        </div>
      </section>
      {
        isLoading === true && <div className="loading"></div> 
      }     
     </>   
    )
}
export default MyList;