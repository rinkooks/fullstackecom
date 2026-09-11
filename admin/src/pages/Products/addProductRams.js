import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MdEdit, MdOutlineDelete } from "react-icons/md";


const AddProductRam = () =>{
  const [editId, setEditId] = useState('');
  const [isLoader, setIsLoader] = useState(false); 
  const [productRamData, setProductRamData] = useState([]);
  const [formField, setFormField] = useState({
    productRams:'',   
  });

  const context = useContext(MyContext);

  const formdata = new FormData();
  const history = useNavigate(); 

  useEffect(()=>{
     fetchDataFromApi('/api/productRams/').then((res)=>{
         setProductRamData(res);
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
  const addProductRam = (e) =>{
      e.preventDefault();

     if (formField.productRam === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Enter Add Product Ram"
      });
      return false      
      }     
       formdata.append('productRams', formField.productRams);

       setIsLoader(true); 
       if(editId === ""){    
       postData("/api/productRams/create", formField).then(res => {
        setIsLoader(false);
        setFormField({
            productRams:'', 
       });       
       fetchDataFromApi('/api/productRams/').then((res)=>{
         setProductRamData(res);
       }) 
      });
      }else{
        editData(`/api/productRams/${editId}`, formField).then((res)=>{
           fetchDataFromApi('/api/productRams/').then((res)=>{
           setProductRamData(res);
           setEditId("");
           setIsLoader(false); 
            setFormField({
            productRams:'', 
          }); 
         })         
        })

      }
  }

   const deleteItem = (id)=>{    
      deleteData(`/api/productRams/${id}`).then((res)=>{
        fetchDataFromApi('/api/productRams/').then((res)=>{
         setProductRamData(res);
       });
      })
   }
   
   const updateData =(id)=>{
      setEditId(id);
      fetchDataFromApi(`/api/productRams/${id}`).then((res)=>{
          setFormField({
             productRams: res.productRams
          });
      })
   }
    return(
      <>
       <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Add Product Rams</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Products</Link></li>
           <li><Link>Add Product Ram</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
       <form onSubmit={addProductRam}>   
       <h5 className="mb-3">Add Product Rams</h5>      
       <div className="row">      
         <div className="col-12 col-sm-6 mb-3">
          <label htmlFor="name">Product Rams</label>
          <input type="text" name="productRams" className="form-control" value={formField.productRams} onChange={changeInput} />          
         </div>
         </div>
         <div className="row">
         <div className="col-12 mt-4 mb-3">
          <button className='w-100' type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Product Ram' }</button> 
         </div> 
       </div>
       </form>
      </div>
      <div className="row">
         <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
           <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th>UID</th>
            <th>Product Ram</th>           
            <th>Action</th>            
          </tr>
         </thead>
         <tbody>
          {
            productRamData.length > 0 && productRamData.map((item, index)=>{
              return(
              <tr key={index}> 
              <td>#</td>
              <td>{item.productRams}</td>                            
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
      </>  
    )
}


export default AddProductRam;