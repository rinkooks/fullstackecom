import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MdEdit, MdOutlineDelete } from "react-icons/md";


const AddProductWeight = () =>{
  const [editId, setEditId] = useState('');
  const [isLoader, setIsLoader] = useState(false); 
  const [productWeightData, setProductWeightData] = useState([]);
  const [formField, setFormField] = useState({
    productWeight:'',   
  });

  const context = useContext(MyContext);

  const formdata = new FormData();
  const history = useNavigate(); 

  useEffect(()=>{
     fetchDataFromApi('/api/productWeight/').then((res)=>{
         setProductWeightData(res);
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
  const addProductWeight = (e) =>{
      e.preventDefault();

     if (formField.productWeight === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Enter Add Product Weight"
      });
      return false      
      }     
       formdata.append('productWeight', formField.productWeight);

       setIsLoader(true); 
       if(editId === ""){    
       postData("/api/productWeight/create", formField).then(res => {
        setIsLoader(false);
        setFormField({
            productWeight:'', 
       });       
       fetchDataFromApi('/api/productWeight/').then((res)=>{
         setProductWeightData(res);
       }) 
      });
      }else{
        editData(`/api/productWeight/${editId}`, formField).then((res)=>{
           fetchDataFromApi('/api/productWeight/').then((res)=>{
           setProductWeightData(res);
           setEditId("");
           setIsLoader(false); 
            setFormField({
            productWeight:'', 
          }); 
         })         
        })

      }
  }

   const deleteItem = (id)=>{    
      deleteData(`/api/productWeight/${id}`).then((res)=>{
        fetchDataFromApi('/api/productWeight/').then((res)=>{
         setProductWeightData(res);
       });
      })
   }
   
   const updateData =(id)=>{
      setEditId(id);
      fetchDataFromApi(`/api/productWeight/${id}`).then((res)=>{
          setFormField({
             productWeight: res.productWeight
          });
      })
   }
    return(
      <>
       <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Add Product Weight</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Products</Link></li>
           <li><Link>Add Product Weight</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
       <form onSubmit={addProductWeight}>   
       <h5 className="mb-3">Add Product Weight</h5>      
       <div className="row">      
         <div className="col-12 col-sm-6 mb-3">
          <label htmlFor="name">Product Weight</label>
          <input type="text" name="productWeight" className="form-control" value={formField.productWeight} onChange={changeInput} />          
         </div>
         </div>
         <div className="row">
         <div className="col-12 mt-4 mb-3">
          <button className='w-100' type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Product Weight' }</button> 
         </div> 
       </div>
       </form>
      </div>
      {
        productWeightData.length > 0 &&       
        <div className="row">
         <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
           <table className="table table-bordered table-striped v-align">
         <thead className="thead-dark">
          <tr>
            <th>UID</th>
            <th>Product Weight</th>           
            <th>Action</th>            
          </tr>
         </thead>
         <tbody>
          {
            productWeightData.length > 0 && productWeightData.map((item, index)=>{
              return(
              <tr key={index}> 
              <td>#{index+1}</td>
              <td>{item.productWeight}</td>                            
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


export default AddProductWeight;