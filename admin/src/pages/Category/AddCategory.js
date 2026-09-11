import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { IoCloseSharp } from "react-icons/io5";

import { MyContext } from '../../App';
import { FaRegImage } from "react-icons/fa";


const AddCategory= () =>{
  const history = useNavigate();
  const [isLoader, setIsLoader] = useState(false);
  const [imgFiles, setImgFiles] = useState();
  const [previews, setPreviews] = useState();
  const [productImgArr, setProductImgArr] = useState([]);

  const context = useContext(MyContext);
  const [formField, setFormField]= useState({
    name:'',
    images:[],
    color:'',
    slug:'',
    parentId:''
  });
 
 //for image loader
 const [uploading, setUploading] = useState(false); 

  const changeInput=(e)=>{
    setFormField(()=>(
        {
          ...formField,
          [e.target.name]:e.target.value
        }  
    ))
   // e.target.value=e.target.name
  }

 // let img_arr = [];
 // let uniqueArray = [];
 
 const onChangeFile = async (e) => {
   const files = e.target.files;
   const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  try {
    setUploading(true);

    const res = await postData("/api/category/upload", formData);

    if (res.success) {
      setProductImgArr(res.images);
      setPreviews(res.images);
    }

    setUploading(false);
    

     /**  const res = await postData("/api/category/upload", formData);
      if (res.success) {
       // setProductImgArr(prev => [...prev, ...res.images]);
       setProductImgArr(res.images);

        setFormField(prev => ({
          ...prev,
          images: res.images
        }));
      }**/
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Image upload failed"
      });
    }
  };
  useEffect(()=>{
       if(!imgFiles) return;
       let tmp = [];
       for(var i=0; i<imgFiles.length; i++){
        tmp.push(URL.createObjectURL(imgFiles[i]));
       }  
       
       const objectUrls = tmp;
       setPreviews(objectUrls);
       
       for(let i=0; i<objectUrls.length; i++){
          return()=>{
            URL.revokeObjectURL(objectUrls[i])
          } 
       }
    },[imgFiles]);

 /* const addImgUrl=(e)=>{
    const arr= [];
    arr.push(e.target.value);
     setFormdata(()=>(
        {
          ...formData,
          [e.target.name]:arr
        }  
    ))
  }*/

 const removeImg = (index) => {
  const updatedPreviews = previews.filter((item, i) => i !== index);
  setPreviews(updatedPreviews);
  const updatedImages = productImgArr.filter((item, i) => i !== index);
  setProductImgArr(updatedImages);
 };

   const addCategory = async (e) => {
    e.preventDefault();

   // const appendedArray = [...previews, ...uniqueArray];

  //  img_arr = [];

   // formField.images = appendedArray;

  if (!formField.name || !formField.color) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please Fill all the details"
    });
    return;
  }
  if (productImgArr.length === 0) {
  context.setAlertBox({
    open: true,
    error: true,
    msg: "Image upload failed. Please try again."
  });
  return;
 }
  try {
   const payload = {
      ...formField,
      slug: formField.name,
      images: productImgArr
    };
    setIsLoader(true);
    postData(`/api/category/create`, payload).then((res)=>{
    setIsLoader(false);

    context.fetchCategory();
   // context.fetchSubCategory();
    history("/category");
  });
  } catch (error) {
    setIsLoader(false);
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Category creation failed"
    });
  }
};

    return(
     <>
     <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Add Category</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Category</Link></li>
           <li><Link>Add</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 flex-row p-3 pb-2 mt-5">
       <form onSubmit={addCategory}>   
       <h5 className="mb-3">Add Category</h5>      
       <div className="row">
         <div className="col-12 mb-3">
          <label htmlFor="name">Category Name</label>
          <input type="text" name="name" className="form-control" onChange={changeInput} /> 
         </div>
         {/* <div className="col-12 mb-3">
          <label htmlFor="images">Category Image</label>
          <input type="text" name="images" className="form-control" onChange={addImgUrl} /> 
         </div>*/} 
         <div className="col-12 mb-3">
          <label htmlFor="color">Category Background</label>
          <input type="text" name="color" className="form-control" onChange={changeInput} /> 
         </div>
          <div className='imageUploadSec'>
            <h5 className="mb-3">Media add Published </h5>       
                <div className='imgUploadBox d-flex'>
                  {
                    previews?.length !== 0 && previews?.map((img, index)=>{
                      return(
                      <div className='imgUpload' key={index}>
                        <span className='remove' onClick={()=> removeImg(index, img)}><IoCloseSharp /></span>
                        <div className='box'><img src={img} alt='' /></div>
                      </div>
                      )
                    })
                  }
                  <div className='imgUpload'>
                    {
                      uploading === true ? 
                      <div className='pregressBar text-center d-flex align-item-center justify-content-center flex-column'>
                        <CircularProgress /> <span>Uploading... </span>
                      </div>
                      :
                     <> 
                     <input type='file' multiple onChange={onChangeFile} name="images" />
                     <div className='fileInfo'>
                       <FaRegImage />
                     <p>Upload Images</p></div>
                    </> 
                    }                    
                  </div>          
             </div>
          </div>
         <div className="col-12 mt-4 mb-3">
          <button className='w-100' type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Category' }</button> 
         </div> 
       </div>
       </form>
     </div>
     
     </>   
    )
}

export default AddCategory;