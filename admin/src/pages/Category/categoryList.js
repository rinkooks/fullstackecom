import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { deleteData, fetchDataFromApi } from "../../utils/api";

import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";

const Category =()=>{
   const [catData, setCatData]= useState([]);  
 
  const context = useContext(MyContext);

   useEffect(()=>{
     context.setProgress(40);
     fetchDataFromApi('/api/category').then((res)=>{
        setCatData(res);
      //  console.log(res);
      context.setProgress(100);
     })
   },[]);

 
  const deleteCat=(id)=>{
     deleteData(`/api/category/${id}`).then((res)=>{
       fetchDataFromApi('/api/category').then((res)=>{
        setCatData(res);
     })
     })
  }
  const handleChange=(event, value)=>{
    context.setProgress(40);
    fetchDataFromApi(`/api/category?page=${value}`).then((res)=>{
      setCatData(res);
      console.log(res);
      context.setProgress(100);
    })
  }
  
  return(
     <>
     <div className="card shadow border-0 w-100 flex-row p-3 pb-3 align-items-center"> 
       <h5> Category List</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Category List</Link></li>
           <li><Link>Category</Link></li> 
         </ul>
       </div>
       <Link to="/category/add"><Button className="blue-btn mx-3" variant="contained">Add Category</Button></Link>
     </div>

     <div className="table-responsive mt-5">
       <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th style={{width:'80px'}}>UID</th>
            <th style={{width:'140px'}}>Image</th>
            <th>Category</th>        
            <th>Color</th>
            <th>Action</th>
          </tr>
         </thead>
         <tbody>
            {
             catData?.categoryList?.length > 0 && catData?.categoryList?.map((item, index)=>{
             return(
                <tr key={index}>
                <td>#{index+1}</td>
                <td><div className="proImg">{/*<img src={item.images[0]} alt="" />*/}
                   {item.images?.length > 0 ? (
                    <img src={`${item.images[0]}`} alt={item.name} />
                  ) : ( <span>No Image {item.images[0]}</span> )}  
                </div></td>
                <td><div className="proName">{item.name}</div></td>               
                <td><span className="dot" style={{backgroundColor:item.color}}></span></td> 
                <td>
                <div className="actions d-flex align-items-center">                   
                   <Link to={`/category/edit/${item._id}`}><Button className="success"><MdEdit /></Button></Link>   
                   <Button className="error" onClick={()=>deleteCat(item._id)}><MdOutlineDelete /></Button>   
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
       catData?.totalPages > 1 && 
       <div className="d-flex tableFooter justify-content-between align-items-center">       
        <Pagination count={catData?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} /> </div>
      }     
     </>
  )
}

export default Category;
