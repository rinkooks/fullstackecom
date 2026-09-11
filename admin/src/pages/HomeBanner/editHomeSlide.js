import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import { FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";


const EditHomeSlide= () =>{
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
    images:[],  
  });
 
  const formdata = new FormData();

   useEffect(()=>{
       context.setProgress(40);
       fetchDataFromApi(`/api/homeBanner/${id}`).then((res)=>{
          setCatData(res);
        //  console.log(res);
        setFormField({       
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
    const res = await postData("/api/homeBanner/upload", formData);
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

const removeImg = (index) => {
const updatedPreviews = previews.filter((item, i) => i !== index);
setPreviews(updatedPreviews);
const updatedImages = productImgArr.filter((item, i) => i !== index);
setProductImgArr(updatedImages);
};

const editHomeSlide = async (e) => {
  e.preventDefault();

  try {
    setIsLoader(true);
    const res = await editData(`/api/homeBanner/${id}`, {    
      images: productImgArr   
    });
    setIsLoader(false);
    history("/homeBannerSlide/list");

  } catch (error) {
    setIsLoader(false);
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Home Banner Slide creation failed"
    });
  }
};

    return(
     <>
     <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Edit Home Slide</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Home Slide</Link></li>
           <li><Link>Edit</Link></li> 
         </ul>
       </div>
     </div>
      <div className="card shadow border-0 w-100 flex-row p-3 pb-2 mt-5">
       <form onSubmit={editHomeSlide}>           
       <div className="row">
          <div className='imageUploadSec'>
            <h5 className="mb-3">Media add Published </h5>       
                <div className='imgUploadBox d-flex'>
                  {
                    previews?.length > 0 && previews?.map((img, index)=>{
                      return(
                      <div className='imgUpload' key={index}> 
                       <span className='remove' onClick={()=> removeImg(index, img)}><IoCloseSharp /></span>
                        {/**<img src={img.includes("blob") ? img : `${context.imageBaseUrl}/uploads/${img}`} /> **/} 
                        <img src={img} alt="" />
                      </div>
                      )
                    })
                  }
                  <div className='imgUpload'>
                    <input type='file' multiple onChange={(e)=> onChangeFile(e, '/api/homeBanner/upload')} name="images" />
                    <div className='fileInfo'>
                      <FaRegImage />
                    <p>Upload Images</p></div>
                  </div>          
             </div>
          </div>
         <div className="col-12 mt-3 mb-3">
          <button type="submit">{ isLoader === true ? 
            <CircularProgress color="inherit" className="loader" /> : 'Update Home Slide' }</button> 
         </div> 
       </div>
       </form>
     </div>
     
     </>   
    )
}

export default EditHomeSlide;