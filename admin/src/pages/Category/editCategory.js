import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import { FaRegImage } from "react-icons/fa";


const EditCategory= () =>{
  const history = useNavigate();
  const [isLoader, setIsLoader] = useState(false);
  const [imgFiles, setImgFiles] = useState();
  const [previews, setPreviews] = useState();
  const [productImgArr, setProductImgArr] = useState([]);

  const [catData, setCatData]= useState([]); 
  const [isSelectedImages, setIsSelectedImages] = useState(false);
 
  const {id} = useParams();

  const context = useContext(MyContext);
  const [formField, setFormField]= useState({
    name:'',
    subCat:'',
    images:[],
    color:''

  });
 
  const formdata = new FormData();

  const changeInput=(e)=>{
    setFormField(()=>(
        {
          ...formField,
          [e.target.name]:e.target.value
        }  
    ))
   // e.target.value=e.target.name
  }

   useEffect(()=>{
       context.setProgress(40);
       fetchDataFromApi(`/api/category/${id}`).then((res)=>{
          setCatData(res);
        //  console.log(res);
        setFormField({
          name:res.name,
          subCat:res.subCat,
          color:res.color,
          images: res.images
        })
        setProductImgArr(res.images);
        setPreviews(res.images);
        context.setProgress(100);
       })
     },[]);
 
  const onChangeFile = async (e) => {
  const files = e.target.files;
  const formData = new FormData();
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  // ✅ Validate file types
  for (let i = 0; i < files.length; i++) {
    if (!allowedTypes.includes(files[i].type)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Only JPG, JPEG and PNG images are allowed"
      });
      return; // stop upload
    }
    formData.append("images", files[i]);
  }
  setImgFiles(files);
  formData.append("categoryId", id);
  try {
    const res = await postData("/api/category/upload", formData);
    if (res.success) {     
      setFormField(prev => ({
        ...prev,
        images: res.images
      }));
      setProductImgArr(res.images);
    }
  } catch (error) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Image upload failed"
    });
  }
  };
  useEffect(() => {
  if (!imgFiles) return;
  const objectUrls = Array.from(imgFiles).map(file =>
    URL.createObjectURL(file)
  );
  setPreviews(objectUrls);
  return () => {
    objectUrls.forEach(url => URL.revokeObjectURL(url));
  };

}, [imgFiles]);

 /* useEffect(()=>{
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
  const addImgUrl=(e)=>{
    const arr= [];
    arr.push(e.target.value);
     setFormdata(()=>(
        {
          ...formData,
          [e.target.name]:arr
        }  
    ))
  }*/

 const editCategory = async (e) => {
  e.preventDefault();

  if (!formField.name || !formField.color) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please Fill all the details"
    });
    return;
  }
  try {
    setIsLoader(true);
    const res = await editData(`/api/category/${id}`, {
      name: formField.name,
      subCat: formField.subCat,
      color: formField.color,
      images: productImgArr   // ✅ filenames array
    });
    setIsLoader(false);
    history("/category");

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
       <h5>Edit Category</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Category</Link></li>
           <li><Link>Edit</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 flex-row p-3 pb-2 mt-5">
       <form onSubmit={editCategory}>   
       <h5 className="mb-3">Edit Category</h5>      
       <div className="row">
         <div className="col-12 mb-3">
          <label fohtmlFor="name">Category Name</label>
          <input type="text" name="name" className="form-control" value={formField.name} onChange={changeInput} /> 
         </div>
         <div className="col-12 mb-3">
          <label fohtmlFor="subCat">Sub Category</label>
          <input type="text" name="subCat" className="form-control" value={formField.subCat} onChange={changeInput} /> 
         </div>
         {/* <div className="col-12 mb-3">
          <label htmlFor="images">Category Image</label>
          <input type="text" name="images" className="form-control" onChange={addImgUrl} /> 
         </div>*/} 
         <div className="col-12 mb-3">
          <label htmlFor="color">Category Background</label>
          <input type="text" name="color" className="form-control" value={formField.color} onChange={changeInput} /> 
         </div>
          <div className='imageUploadSec'>
            <h5 className="mb-3">Media add Published </h5>       
                <div className='imgUploadBox d-flex'>
                  {
                    previews?.length > 0 && previews?.map((img, index)=>{
                      return(
                      <div className='imgUpload' key={index}> 
                         <img src={img.includes("blob") ? img : `${context.imageBaseUrl}/uploads/${img}`} />
                      </div>
                      )
                    })
                  }
                  <div className='imgUpload'>
                    <input type='file' multiple onChange={onChangeFile} name="images" />
                    <div className='fileInfo'>
                      <FaRegImage />
                    <p>Upload Images</p></div>
                  </div>          
             </div>
          </div>
         <div className="col-12 mt-3 mb-3">
          <button type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Update Category' }</button> 
         </div> 
       </div>
       </form>
     </div>
     
     </>   
    )
}

export default EditCategory;