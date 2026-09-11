import { CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { editData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";


const EditSubCat = ()=>{
  const [data, setData] = useState([]);
  const [categoryValue, setCatgoryValue] = useState(''); 
  const [isLoader, setIsLoader] = useState(false);
  const [formField, setFormField] = useState({
    category:'',
    subCat:''
  })

  const formdata = new FormData();
  const {id} = useParams();

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(()=>{
    fetchDataFromApi(`/api/subCat/${id}`).then((res)=>{
       setData(res);
       setCatgoryValue(res.category.id);
       setFormField(()=>({
       ...formField,
       category:res.category.id, 
       subCat:res.subCat,       
    })
    )

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
  const handleChangeCatgory = (event) => {
    setCatgoryValue(event.target.value);
    setFormField(()=>({
       ...formField,
       category:event.target.value     
    })
  )
}
const editSubCat = (e) =>{
     e.preventDefault();
     
    formdata.append('category', formField.category);
    formdata.append('subCat', formField.subCat);

    if (formField.category === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Select a Category"
      });
      return false      
      }
      if (formField.subCat === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Select a Sub Category"
      });
      return false      
      }
      editData(`/api/subCat/${id}`, formField).then(res => {
          setIsLoader(false);
          history('/subCategory')
              
      })    
  }

    return(
      <>
       <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Edit Sub Category</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Category</Link></li>
           <li><Link>Sub Category</Link></li>
           <li><Link>Add</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 flex-row p-3 pb-2 mt-5">
       <form onSubmit={editSubCat}>   
       <h5 className="mb-3">Edit Sub Category</h5>      
       <div className="row">
         <div className="col-12 mb-3">
          <label fohtmlFor="name"> Category</label>
          <select className='form-control' value={categoryValue} name="category" onChange={handleChangeCatgory}>
            <option value={null}>Select Category</option>
             {
              context.catData?.length > 0 && context.catData?.map((cat, index)=>{
                return(
                 <option key={index} value={cat.id}>{cat.name}</option>       
                )
              })
            }
          </select> 
         </div>
         <div className="col-12 mb-3">
          <label fohtmlFor="name">Sub Category</label>
          <input type="text" name="subCat" value={formField.subCat} className="form-control" onChange={changeInput} /> 
         </div>

         <div className="col-12 mt-4 mb-3">
          <button className='w-100' type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Update Category' }</button> 
         </div> 
       </div>
       </form>
     </div>
    </>  
    )
}


export default EditSubCat;