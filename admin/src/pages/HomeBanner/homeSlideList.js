import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { deleteData, fetchDataFromApi } from "../../utils/api";

import { MyContext } from "../../App";

const HomeSlidesList =()=>{
   const [slideList, setSlideList]= useState([]);  
 
  const context = useContext(MyContext);

   useEffect(()=>{
     context.setProgress(40);
     fetchDataFromApi('/api/homeBanner').then((res)=>{
        setSlideList(res);
      //  console.log(res);
      context.setProgress(100);
     })
   },[]);

 
  const deleteSlide=(id)=>{
    context.setProgress(40);
     deleteData(`/api/homeBanner/${id}`).then((res)=>{
       fetchDataFromApi('/api/homeBanner').then((res)=>{
        setSlideList(res);
        context.setProgress(100);
        context.setAlertBox({
          open:true,
          error: false,
          msg: "slide Deleted!"
        })
     })
     })
  }

  return(
     <>
     <div className="card shadow border-0 w-100 flex-row p-3 pb-3 align-items-center"> 
       <h5>Home Banner Slide List</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Home Banner</Link></li>
           <li><Link>List</Link></li> 
         </ul>
       </div>
       <Link to="/homeBannerSlide/add"><Button className="blue-btn mx-3" variant="contained">Add Home Slide</Button></Link>
     </div>

     <div className="table-responsive mt-5 slideList">
       <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th style={{width:'80px'}}>UID</th>
            <th style={{width:'300px'}}>Image</th>       
            <th>Action</th>
          </tr>
         </thead>
         <tbody>
            {
             slideList?.length > 0 && slideList?.map((item, index)=>{
             return(
                <tr key={index}>
                <td>#{index+1}</td>
                <td><div className="proImg">{/*<img src={item.images[0]} alt="" />*/}
                   {item.images?.length > 0 ? (
                    <img src={`${item.images[0]}`} alt={item.name} />
                  ) : ( <span>No Image {item.images[0]}</span> )}  
                </div></td>            
                <td>
                <div className="actions d-flex align-items-center">                   
                   <Link to={`/homeBannerSlide/edit/${item.id}`}><Button className="success"><MdEdit /></Button></Link>   
                   <Button className="error" onClick={()=>deleteSlide(item.id)}><MdOutlineDelete /></Button>   
                   </div>    
                 </td>   
                </tr>  
                )
              })
            } 
         </tbody>
       </table>
     </div> 
     </>
  )
}

export default HomeSlidesList;
