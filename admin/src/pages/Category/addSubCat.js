import { CircularProgress, MenuItem, Select } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";


const AddSubCat = () =>{
  const [isLoader, setIsLoader] = useState(false); 
  const [categoryValue, setCatgoryValue] = useState(''); 

  const [formField, setFormField] = useState({
    name:'',
    slug:'',
    parentId:''
  });

  const context = useContext(MyContext);

  const formdata = new FormData();
  const history = useNavigate(); 

  useEffect(()=>{
     // context.fetchCategory();
      /* context.setProgress(40);
       fetchDataFromApi('/api/category/all').then((res)=>{
          setCatData(res);
        //  console.log(res);
        context.setProgress(100);
       })*/       
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
     setFormField(prev => ({
    ...prev,
    parentId: event.target.value
  })
  )
  } 

  const selectCat= (cat, id)=>{
     formField.parentId = id;
  }

  const addSubCat = (e) =>{
      e.preventDefault();          
      const data = {
        ...formField,
        slug: formField.name
      };

     if(formField.name !== "" && formField.parentId !==""){
       postData(`/api/category/create`, data).then(res => {
           setIsLoader(false);
           history('/subCategory')
              
       })
      }else{
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please Fill all the details"
      });
      return;
      } 
    
  }
    return(
      <>
       <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Add Sub Category</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Sub Category</Link></li>
           <li><Link>Add</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
       <form onSubmit={addSubCat}>   
       <h5 className="mb-3">Add Category</h5>      
       <div className="row">
        <div className="col-12 col-sm-6 mb-3">
          <label htmlFor="name">Category</label>
          <Select className='form-control' value={categoryValue} name="category" onChange={handleChangeCatgory}>
            <MenuItem value=""><em value={null}>Select Category</em></MenuItem>
             {
              context.catData?.categoryList?.length > 0 && context.catData?.categoryList?.map((cat, index)=>{
                return(
                 <MenuItem key={index} value={cat._id} onClick={()=> selectCat(cat.name, cat._id)}>{cat.name}</MenuItem>       
                )
              })
            }
          </Select> 
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label htmlFor="name">Sub Category</label>
          <input type="text" name="name" value={formField.name} className="form-control" onChange={changeInput} /> 
          {/* 
          <select className='form-control' value={subCategoryValue} onChange={handleChangeSubCatgory} >
            <option value="">Select Sub Category</option>
           {Array.isArray(selectedCategory?.subCat) &&
           selectedCategory.subCat.map((sub, index) => (
             <option key={index} value={typeof sub === "string" ? sub : sub.name}>
                {typeof sub === "string" ? sub : sub.name}
              </option>             
            ))}
          </select> 
          */}
         </div>
         </div>
         <div className="row">
         <div className="col-12 mt-4 mb-3">
          <button className='w-100' type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Sub Category' }</button> 
         </div> 
       </div>
       </form>
      </div> 
      </>  
    )
}


export default AddSubCat;