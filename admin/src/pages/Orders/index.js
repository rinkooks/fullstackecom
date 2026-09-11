import React, { useContext, useEffect, useState } from "react";
import { editData, fetchDataFromApi } from "../../utils/api";
import { Button, Dialog, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { RiCloseLargeFill } from "react-icons/ri";

const Orders =()=>{
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [singleOrder, setSingleOrder] = useState();

 const context = useContext(MyContext);
 const [isOpenModal, setIsOpenModal] = useState(false);

useEffect(()=>{
window.scrollTo(0,0);
fetchDataFromApi('/api/orders?page=1&perPage=8').then((res)=>{
    setOrders(res);
})
},[]);

const handleChange=(event, value)=>{
  setPage(value);
  context.setProgress(40);
  fetchDataFromApi(`/api/orders?page=${value}&perPage=8`).then((res)=>{
    setOrders(res);
    window.scrollTo({
        top:200,
        behavior:'smooth'
    })        
    context.setProgress(100);
  })
}
const showProducts=(id)=>{   
  fetchDataFromApi(`/api/orders/${id}`).then((res)=>{ 
    setIsOpenModal(true);   
    setProducts(res.products);
  })
}

const orderStatus=(status, id)=>{
  fetchDataFromApi(`/api/orders/${id}`).then((res)=>{
    const order = {
      name:res.name,
      phoneNumber:res.phoneNumber,
      address: res.address,
      pincode: res.pincode,
      amount: parseInt(res.amount),
      paymentId: res.paymentId,
      email:res.email,
      userId:res.userId,
      products:res.products,
      status:status   
    }    
    editData(`/api/orders/${id}`, order).then((res)=>{
      fetchDataFromApi(`/api/orders?page=${1}&perPage=8`).then((res)=>{
      setOrders(res);
      window.scrollTo({
          top:200,
          behavior:'smooth'
      })
    })

    })
    setSingleOrder(res.products);
  })
}

return(
  <>
  <div className="card shadow border-0 w-100 flex-row p-3 pb-3 align-items-center"> 
    <h5>Orders</h5>            
    <div className="breadcrumbs">
      <ul>
        <li><Link>Home</Link></li>
        <li><Link>Admin</Link></li>
        <li><Link>orders</Link></li> 
      </ul>
    </div>
  </div>

  <div className="table-responsive mt-5">
    <table className="table table-bordered table-striped v-align">
      <thead className="thead-dark">
      <tr>
       <th>Payment Id</th>
      <th>Products</th>
      <th>Name</th>
      <th>Phone Number</th>
      <th>Address</th>
      <th>Pincode</th>
      <th>Total Amount</th>
      <th>Email</th>
      <th>User Id</th>
      <th>Order Status</th>
      <th>Date</th>
      </tr>
      </thead>
      <tbody>
        {
         orders?.orderList?.length !== 0 && orders?.orderList?.map((order,index)=>{
          return(
            <tr key={index}>
            <td><span className="text-blue font-weight-bold">{order?.paymentId}</span></td> 
            <td><span className="text-blue font-weight-bold cursor" onClick={()=>showProducts(order?._id)}>
            Click here to view</span></td> 
            <td>{order?.name}</td> 
            <td>{order?.phoneNumber}</td> 
            <td>{order?.address}</td> 
            <td>{order?.pincode}</td> 
            <td>{order?.amount}</td> 
            <td>{order?.email}</td> 
            <td>{order?.userId}</td>
            <td>{
            order?.status === "pending" ? <span className="badge badge-danger cursor" 
            onClick={()=>orderStatus("confirm", order?._id)}>{order?.status}</span>
            : <span className="badge badge-success cursor" onClick={()=>orderStatus("pending", order?._id)}>{order?.status}</span>
            }</td> 
            <td>{order?.date}</td>                   
           </tr>  
            )
          })
        } 
      </tbody>
    </table>
  </div>
  {
      orders?.orderList?.totalPages > 1 && 
      <div className="d-flex tableFooter justify-content-between align-items-center">       
            <Pagination count={orders?.orderList?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} /> </div>
    }  


  <Dialog open={isOpenModal} className="productModal">
    <div className='mb-2'><h3>Products</h3></div> 
    <Button className="closeModel" onClick={()=>setIsOpenModal(false)}><RiCloseLargeFill /></Button>
    <table className="table table-striped orderTable table-bordered">
      <thead className="thead-light ">
      <tr>
      <th>Product Id</th>
      <th>Product Title</th>
      <th>Image</th>
      <th>Quanitity</th>
      <th>Price</th>
      <th>Sub Total</th>
      </tr>
      </thead>
    <tbody>
      {
        products?.length !== 0 && products?.map((item, index)=>{
          return(
          <tr key={index}>
            <td>{item?.id}</td>
            <td>{item?.productName?.substr(0,30)+'...'}</td>
            <td><div className="img"> 
              <img src={`${context.imageBaseUrl}/uploads/${item?.image}`} alt="" />  
              </div></td>
            <td>{item?.quantity}</td>
            <td>{item?.price}</td>
            <td>{item?.total}</td>
          </tr>  
          )
        })
      }
    </tbody>
   </table>    
</Dialog>   
  
  </>     
)
}

export default Orders;
