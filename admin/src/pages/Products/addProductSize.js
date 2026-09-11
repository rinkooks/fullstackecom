import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MdEdit, MdOutlineDelete } from "react-icons/md";


const AddProductSize = () =>{
  const [editId, setEditId] = useState('');
  const [isLoader, setIsLoader] = useState(false); 
  const [productSizeData, setProductSizeData] = useState([]);
  const [formField, setFormField] = useState({
    productSize:'',   
  });

  const context = useContext(MyContext);

  const formdata = new FormData();
  const history = useNavigate(); 

  useEffect(()=>{
     fetchDataFromApi('/api/productSize/').then((res)=>{
         setProductSizeData(res);
       })      
  },[]);

  const changeInput=(e)=>{
    setFormField(()=>(
        {
          ...formField,
          [e.target.name]:e.target.value
        }  
    ))
  }
  const addProductSize = (e) =>{
      e.preventDefault();

     if (formField.productSize === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Enter Add Product Size"
      });
      return false      
      }     
       formdata.append('productSize', formField.productSize);

       setIsLoader(true); 
       if(editId === ""){    
       postData("/api/productSize/create", formField).then(res => {
        setIsLoader(false);
        setFormField({
            productSize:'', 
       });       
       fetchDataFromApi('/api/productSize/').then((res)=>{
         setProductSizeData(res);
       }) 
      });
      }else{
        editData(`/api/productSize/${editId}`, formField).then((res)=>{
           fetchDataFromApi('/api/productSize/').then((res)=>{
           setProductSizeData(res);
           setEditId("");
           setIsLoader(false); 
            setFormField({
            productSize:'', 
          }); 
         })         
        })

      }
  }

   const deleteItem = (id)=>{    
      deleteData(`/api/productSize/${id}`).then((res)=>{
        fetchDataFromApi('/api/productSize/').then((res)=>{
         setProductSizeData(res);
       });
      })
   }
   
   const updateData =(id)=>{
      setEditId(id);
      fetchDataFromApi(`/api/productSize/${id}`).then((res)=>{
          setFormField({
             productSize: res.productSize
          });
      })
   }
    return(
      <>
       <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Add Product Size</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Products</Link></li>
           <li><Link>Add Product Size</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
       <form onSubmit={addProductSize}>   
       <h5 className="mb-3">Add Product Size</h5>      
       <div className="row">      
         <div className="col-12 col-sm-6 mb-3">
          <label htmlFor="name">Product Size</label>
          <input type="text" name="productSize" className="form-control" value={formField.productSize} onChange={changeInput} />          
         </div>
         </div>
         <div className="row">
         <div className="col-12 mt-4 mb-3">
          <button className='w-100' type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Product Size' }</button> 
         </div> 
       </div>
       </form>
      </div>
      {
        productSizeData.length > 0 &&       
        <div className="row">
         <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
           <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th>UID</th>
            <th>Product Size</th>           
            <th>Action</th>            
          </tr>
         </thead>
         <tbody>
          {
            productSizeData.length > 0 && productSizeData.map((item, index)=>{
              return(
              <tr key={index}> 
              <td>#{index+1}</td>
              <td>{item.productSize}</td>                            
              <td>
              <div className="actions d-flex align-items-center">                   
                  <Button className="success" onClick={()=>updateData(item.id)}><MdEdit /></Button>   
                  <Button className="error" onClick={()=>deleteItem(item.id)}> <MdOutlineDelete /></Button>   
                  </div>    
                </td>   
              </tr> 
              )
            })
          }             
         </tbody>
        </table>
       </div>  
      </div> 
      }
      </>  
    )
}


export default AddProductSize;