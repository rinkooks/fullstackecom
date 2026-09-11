import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, Links } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";

const Category =()=>{
   const [catData, setCatData]= useState([]);
   const [openPopup, setOpenPopup] = useState(false);   
   const [editId, setEditId] = useState(null);
   const [isLoader, setIsLoader] = useState(false);
   const [page, setPage] = useState(1);

    const [formData, setFormdata]= useState({
    name:'',
    images:[],
    color:''

  });
  const context = useContext(MyContext);

   useEffect(()=>{
     context.setProgress(40);
     fetchDataFromApi('/api/category').then((res)=>{
        setCatData(res);
      //  console.log(res);
      context.setProgress(100);
     })
   },[]);

   const handleClose = () => {
    setOpenPopup(false);
  };

 const changeInput=(e)=>{
    setFormdata(()=>(
        {
          ...formData,
          [e.target.name]:e.target.value
        }  
    ))
   // e.target.value=e.target.name
  }
  const addImgUrl=(e)=>{
    const arr= [];
    arr.push(e.target.value);
     setFormdata(()=>(
        {
          ...formData,
          [e.target.name]:arr
        }  
    ))
  }

  const editCat =(id) =>{
    setFormdata({
        name:'',
        images:'',
        color:''
      })
      setOpenPopup(true);
       setEditId(id);
      fetchDataFromApi(`/api/category/${id}`).then((res)=>{
      // setEditField(res);
      setFormdata({
        name:res.name,
        images:res.images,
        color:res.color
      })
       console.log(res);
      })
  }
  const categoryEditFun=(e)=>{    
    e.preventDefault();
    setIsLoader(true);
    context.setProgress(40);
    editData(`/api/category/${editId}`, formData).then((res)=>{
       fetchDataFromApi('/api/category').then((res)=>{
        setCatData(res);
         setOpenPopup(false);
          setIsLoader(false);
      //  console.log(res);
     })
     context.setAlertBox({
      open:true,
      error:false,
      msg:'The Category has been updated'
     })
     context.setProgress(100);
    })
  }

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
       <h5>Add Category</h5>            
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
                    <img src={`http://localhost:5000/uploads/${item.images[0]}`} alt={item.name} />
                  ) : ( <span>No Image {item.images[0]}</span> )}  
                </div></td>
                <td><div className="proName">{item.name}</div></td>   
                <td><span className="dot" style={{backgroundColor:item.color}}></span></td> 
                <td>
                <div className="actions d-flex align-items-center">                   
                   <Button className="success" onClick={()=>editCat(item.id)}><MdEdit /></Button>   
                   <Button className="error" onClick={()=>deleteCat(item.id)}><MdOutlineDelete /></Button>   
                   </div>    
                 </td>   
                </tr>  
                )
              })
            } 
         </tbody>
       </table>

     </div>
     <Dialog open={openPopup} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
         <form onSubmit={categoryEditFun} id="subscription-form">
        <DialogContent>        
          
            <TextField autoFocus margin="dense" id="name" name="name" type="text" fullWidth onChange={changeInput} value={formData.name} />
            <TextField autoFocus margin="dense" id="images" name="images" type="text" fullWidth onChange={addImgUrl} value={formData.images} />
            <TextField autoFocus margin="dense" id="color" name="color" type="text" fullWidth onChange={changeInput}  value={formData.color} />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Update' }</Button>          
        </DialogActions>
        </form>
      </Dialog>
      {
       catData?.totalPages > 1 && 
       <div className="d-flex tableFooter justify-content-between align-items-center">       
        <Pagination count={catData?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} /> </div>
      }     
     </>
  )
}

export default Category;
