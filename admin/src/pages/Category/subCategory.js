import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { deleteData, fetchDataFromApi } from "../../utils/api";

import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { IoClose, IoCloseCircleSharp, IoCloseSharp } from "react-icons/io5";

const SubCategory =()=>{
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

  const deleteSubCat=(id)=>{
    context.setProgress(30);
     deleteData(`/api/category/${id}`).then((res)=>{
       context.setProgress(100);
       fetchDataFromApi('/api/category').then((res)=>{
        setCatData(res);
        context.setProgress(100);
        context.setProgress({
           open:true,
           error: false,
           msg: 'Cateory Deleted' 
        })
     })
     })
  }
 /* const deleteCat=(id)=>{
     deleteData(`/api/subCat/${id}`).then((res)=>{
       fetchDataFromApi('/api/subCat').then((res)=>{
        setCatData(res);
     })
     })
  }*/
  const handleChange=(event, value)=>{
    context.setProgress(40);
    fetchDataFromApi(`/api/subCat?page=${value}`).then((res)=>{
      setCatData(res);
      console.log(res);
      context.setProgress(100);
    })
  }
  
  return(
     <>
     <div className="card shadow border-0 w-100 flex-row p-3 pb-3 align-items-center"> 
       <h5>Add Sub Category</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Category</Link></li>
           <li><Link>Sub Category</Link></li>            
         </ul>
       </div>
       <Link to="/subCategory/add"><Button className="blue-btn mx-3" variant="contained">Add Sub Category</Button></Link>
     </div>
     <div className="table-responsive mt-5">
       <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th style={{width:'80px'}}>UID</th>
            <th style={{width:'140px'}}>Image</th>
            <th>Category</th>        
            <th>Sub Category</th>            
          </tr>
         </thead>
         <tbody>
            {
             catData?.categoryList?.length > 0 && catData?.categoryList?.map((item, index)=>{
              if(item?.children?.length!==0){
             return(
                <tr key={index}>
                <td>#{index+1}</td>
                <td><div className="proImg" style={{width:'150px'}}>                 
                  <img alt="" effect="blur" src={item.images[0]} />
               
                  {/*item.category?.images && item.category.images.length > 0 ? (
                    <img src={`${context.imageBaseUrl}/uploads/${item.category.images[0]}`} alt={item.category.name} />
                  ) : ( <span>No Image</span> )*/}
                </div></td>
                <td><div className="proName">{item.name}</div></td>               
                <td>
                  {
                   item?.Children?.length!==0 && item?.Children?.map((subCat, index)=>{
                    return(
                      <span key={subCat._id} className="badge badge-primary mx-1">{subCat?.name} 
                      <IoCloseCircleSharp onClick={()=> deleteSubCat(subCat._id)} /></span>
                    )
                   }) 
                  }
                 </td>                   
                </tr>  
                )}
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

export default SubCategory;
