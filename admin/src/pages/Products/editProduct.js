import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import Rating from '@mui/material/Rating';
import { Button, MenuItem, Select } from '@mui/material';
import { FaRegImage } from "react-icons/fa";
import axios from 'axios';
import LocationModel from '../../components/LocationModel';
import Select2 from 'react-select';

const EditProduct= () =>{  
  const [ratingValue, setRatingValue] = useState(2); 
  const[isFeaturedValue, setIsFeaturedValue]= useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [productImgArr, setProductImgArr] = useState([]);

  const [catData, setCatData] = useState([]);
 // const [subCatData, setSubCatData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryValue, setCatgoryValue] = useState('');
  const [subCategoryValue, setSubCatgoryValue] = useState('');

  const [productRams, setProductRams] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productWeight, setProductWeight] = useState([]);

  const [productRamsData, setProductRamsData] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);

  const {id} = useParams();

  const [imgFiles, setImgFiles] = useState();
  const [previews, setPreviews] = useState();
  const [isSelectedImages, setIsSelectedImages] = useState(false);

  const productImages = useRef();

  const [selectedLocation, setSelectedLocation] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const history = useNavigate();
  // for images
  //const formdata = new FormData();
  //const [files, setFiles] = useState([]);

  const context = useContext(MyContext);
  const [formField, setFormField]= useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: "",
    oldprice: "",
    catName:'',
    category: "",
    subcatId: "",
    subCat: "",
    countInStock: "",
    rating: 0,
    isFeatured: '',
    discount: 0,
    productRams: [],
    productSize: [],
    productWeight: [],
    location:[],
  });

  const inputChange = (e) =>{
    setFormField(()=>({
       ...formField,
      [e.target.name]:e.target.value   
    }))
  }
 
  const onChangeFile = async (e) => {
  const files = e.target.files;
  const formData = new FormData();
    setImgFiles(files);

  formData.append("productId", id);  

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }
  setIsSelectedImages(true);
  try {
    const res = await postData("/api/products/upload", formData);

    if (res.success) {
      setProductImgArr(res.images);
    }
    console.log("Uploaded:", res.images);
  } catch (error) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Image upload failed"
    });
  }
};

const handleChangeCatgory = (event) => {
  const selectedId = event.target.value;
  setCatgoryValue(selectedId);
  /** for this function get category Name **/ 
  const selectedCat = context.catData.find(
    (cat) => cat.id === selectedId
  );
  setFormField((prev) => ({
    ...prev,
    category: selectedId,
    catName: selectedCat?.name || ""
  }));
};
  
const handleChangeSubCatgory = (event) => {
  const selectedSubCatId = event.target.value;
  setSubCatgoryValue(selectedSubCatId);
  setFormField((prev) => ({
    ...prev,
    subCat: selectedSubCatId, 
    subcatId: selectedSubCatId
  }));
};

const handleChangeisFeaturedValue = (event) => {
  const value = event.target.value === "true";
  setFormField((prev) => ({
    ...prev,
    isFeatured: value
  }));
}; 

/*** Start Multi Select Input ***/
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
/*** End Multi Select Input ***/
const handleChangeProductRams = (event) => {
  const {
    target: { value },
  } = event;
  const newValue =
    typeof value === "string" ? value.split(",") : value;
  setProductRams(newValue);
  setFormField((prev) => ({
    ...prev,
    productRams: newValue
  }));
};
  const handleChangeProductSize = (event) => {   
    const {
      target: { value },
    } = event;
    setProductSize(     
      typeof value === 'string' ? value.split(',') : value,
    );   
    formField.productSize = value
  } 
  const handleChangeProductWeight = (event) => {    
   const {
      target: { value },
    } = event;
    setProductWeight(     
      typeof value === 'string' ? value.split(',') : value,
    );
    setFormField((prev) => ({
      ...prev,
      productWeight: typeof value === 'string' ? value.split(',') : value
    }));  
  }  

  useEffect(()=>{
       context.setProgress(40);
       fetchDataFromApi(`/api/products/${id}`).then((res)=>{
          setCatData(res);
          console.log(res);
          setFormField({
            name: res.name,
            description:res.description,
            images: [],
            brand:res.brand,
            price: res.price,
            oldprice: res.oldprice,
            catName: res.catName,
            category: res.category,
            subcatId: res.subcatId,
            subCat: res.subCat,
            countInStock: res.countInStock,
            rating: res.rating,            
           // isFeatured: res.isFeatured,
           discount:res.discount,
           location:res.location
          });
        context.setselectCountry(res.location);
        setSelectedLocation(res.location);

        setRatingValue(res.rating);
        setCatgoryValue(res.category);
        setSubCatgoryValue(res.subCat); 
        setIsFeaturedValue(res.isFeatured); 
        setProductRams(res.productRams); 
        setProductSize(res.productSize);
        setProductWeight(res.productWeight);  
        setProductImgArr(res.images);
        setPreviews(res.images);
        context.setProgress(100);
       })
  },[]);

  useEffect(() => {
   context.setselectCountry("");  

  fetchDataFromApi("/api/category").then(res => {
    setCategories(res.categoryList);   
  });

  fetchDataFromApi('/api/productRams/').then((res)=>{
      setProductRamsData(res);       
    }); 
    fetchDataFromApi('/api/productSize/').then((res)=>{
      setProductSizeData(res);       
    });     
    fetchDataFromApi('/api/productWeight/').then((res)=>{
      setProductWeightData(res);       
    });     
  }, []);

  useEffect(()=>{
    formField.location = context.selectCountry;
  },[context.selectCountry]);

  useEffect(()=>{
    const newData ={
      value:'All',
      label:'All'
    };
    const updatedArray = [...context?.countryList]; // clone the array to avoid direct mutation
    updatedArray.unshift(newData); // prepend data
    setCountryList(updatedArray);
  }, [context?.countryList]);

  const handleChangeLocation = (selectedOptions)=>{
    setSelectedLocation(selectedOptions);
    setFormField(prev => ({
    ...prev,
    location: selectedOptions
  }));
    console.log(selectedOptions);
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
          objectUrls.forEach(url => URL.revokeObjectURL(url));
        } 
     }
  },[imgFiles]);

  const addProductImg= ()=>{
    if (productImages.current.value !== "") {
      setProductImgArr([...productImgArr, productImages.current.value]);
      productImages.current.value = "";
    }
    // setProductImgArr(prevArray => [...prevArray, productImages.current.value]);
    // productImages.current.value="";
  }

  const editProduct =(e)=>{
    e.preventDefault();

    formField.images = productImgArr;
    console.log(formField);


  if (formField.name === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product Name",
    error: true
  });
  return false;
}

if (formField.description === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product description",
    error: true
  });
  return false;
}

if (formField.brand === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product brand",
    error: true
  });
  return false;
}

if (formField.countInStock === null || formField.countInStock === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Count In Stock",
    error: true
  });
  return false;
}
if (formField.price === null || formField.price === "" || formField.price <= 0) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product price",
    error: true
  });
  return false;
}
if (formField.oldprice === null || formField.oldprice === "" || formField.oldprice <= 0) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product oldprice",
    error: true
  });
  return false;
}

if (formField.category === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Select Product Category",
    error: true
  });
  return false;
}

if (formField.rating === null) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Rating",
    error: true
  });
  return false;
}

if (formField.isFeatured === null) {
  context.setAlertBox({
    open: true,
    msg: "Please Select Products isFeatured",
    error: true
  });
  return false;
}

if (!formField.images || formField.images.length === 0) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Products Images",
    error: true
  });
  return false;
}
 const finalData = {
      ...formField,
      images: productImgArr,
      rating: ratingValue,
      isFeatured: isFeaturedValue,
      price: Number(formField.price),
      oldprice: Number(formField.oldprice),
      countInStock: Number(formField.countInStock),
      discount: Number(formField.discount),
      subcatId: formField.subcatId,
      productRams,
      productSize,
      productWeight,
      location: selectedLocation.length ? selectedLocation : [{ value: "All", label: "All" }]
     // location: formField.location
    };   

 try {   
   setIsLoader(true);

  editData(`/api/products/${id}`, finalData)
  .then((res)=>{
    setIsLoader(false);
    context.setAlertBox({
      open:true,
      msg:'This Product is Created!',
      error:false
    })
    // reset form    
    setFormField({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: 0,
    oldprice: 0,
    catName: "",
    category: "",
    subcatId: "",
    subCat: "",
    countInStock: 0,
    rating: 0,
    isFeatured: false,
    discount: 0,
    productRams: [],
    productSize: [],
    productWeight: []
   });
   setProductImgArr([]);
   
   history('/products');

  })
}catch (error) {
    setIsLoader(false);
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Something went wrong"
    });
  }

  /** if (formField.name !== "" && formField.images.length !== 0 && formField.color !== "") {
      setIsLoader(true);
     postData('/api/category/create', formField).then((res)=>{
      setIsLoader(false);
      history('/category')
     })
   }
   else{
     context.setAlertBox({
       open:true,
       error:true,
       msg:'Please Fill all the details'   
     });
     return false
   }  **/
   }
    return(
     <>
     <div className="card shadow border-0 w-100 flex-row p-3 pb-2"> 
       <h5>Edit Product</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
           <li><Link>Edit Product</Link></li> 
         </ul>
       </div>
     </div>
     <div className='row'>
     <div className='col-md-12'>
      <form onSubmit={editProduct}>  
      <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">       
       <h5 className="mb-3">Add Product</h5>      
       <div className="row">
         <div className="col-12 mb-3">
          <label htmlFor="name">Product Name</label>
          <input type="text" name="name" value={formField.name} className="form-control" onChange={inputChange} placeholder='Product Name' /> 
         </div>
         <div className="col-12 mb-3">
          <label htmlFor="name">Description</label>
          <textarea name="description" value={formField.description} className="form-control" onChange={inputChange} placeholder='description' />           
         </div>
         <div className="col-12 col-sm-4 mb-3">
          <label htmlFor="name">Category</label>
          <select className='form-control' name="category" value={categoryValue} onChange={handleChangeCatgory} >
          <option value={null}>Select Category</option>
          {
           context.catData?.length > 0 && context.catData?.map((cat, index)=>{
             return(
              <option key={cat.id} value={cat.id}> {cat.name} </option>
               )
              })
            }     
          </select>
         </div>
         <div className="col-12 col-sm-4 mb-3">
          <label htmlFor="name">Sub Category</label>
          <select className='form-control' value={subCategoryValue} onChange={handleChangeSubCatgory}>
             <option value={null}>Select Sub Category</option>
             {
              context.subCatData?.subCategoryList?.length > 0 && context.subCatData?.subCategoryList?.map((subCat, index)=>{
                return(
                 <option key={index} value={subCat.id}>{subCat.subCat}</option>       
                )
              })
            }
          </select> 
         </div>
         <div className="col-12 col-sm-4 mb-3">
          <label htmlFor="name">Product Brand</label>
          <input type="text" name="brand" value={formField.brand} className="form-control" onChange={inputChange} placeholder='Brand' /> 
         </div>
         <div className="col-12 col-sm-4 mb-3">
          <label htmlFor="name">countInStock</label>
          <input type="text" name="countInStock" value={formField.countInStock} className="form-control" onChange={inputChange} placeholder='stock' /> 
         </div>
         <div className="col-12 col-sm-4 mb-3">
          <label htmlFor="name">Price</label>
          <input type="text" name="price" value={formField.price} className="form-control" onChange={inputChange} placeholder='price' /> 
         </div>
         <div className="col-12 col-sm-4 mb-3">
          <label htmlFor="name">Old Price</label>
          <input type="text" name="oldprice" value={formField.oldprice} className="form-control" onChange={inputChange} placeholder='Old Price' /> 
         </div>
         <div className="col-12 col-md-4 col-sm-6 mb-3">
          <label htmlFor="name">IsFeatured</label>
          <select value={isFeaturedValue}  onChange={handleChangeisFeaturedValue} className='form-control'>
            <option value="">None</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
         </div>
         <div className="col-1 col-md-4 col-sm-6 mb-3">
          <label htmlFor="name">Rating</label><br/>
          <Rating value={ratingValue} 
               onChange={(event, newValue) => {
               setRatingValue(newValue);
              // setFormField({
              //   ...formField,
              //   rating: newValue
              // });
            }}
          />
         </div>
          <div className="col-12 col-md-4 col-sm-6 mb-3">
          <label htmlFor="name">Discount</label>
          <input type="text" name="discount" value={formField.discount} className="form-control" onChange={inputChange} placeholder='discount' /> 
         </div>
         <div className="col-12 col-md-4 col-sm-6 mb-3">
          <label htmlFor="name">productRAMS</label>
          <Select multiple value={productRams} onChange={handleChangeProductRams} className="form-control" MenuProps={MenuProps} >            
             {
              productRamsData.length > 0 && productRamsData.map((item, index)=>(
                  <MenuItem key={index} value={item.productRams}>{item.productRams}</MenuItem>
              ))              
            }
          </Select>
         </div>
         <div className="col-12 col-md-4 col-sm-6 mb-3">
          <label htmlFor="name">productSIZE</label>
          <Select multiple value={productSize} onChange={handleChangeProductSize} className="form-control" MenuProps={MenuProps}>            
            {
              productSizeData.length > 0 && productSizeData.map((item, index)=>(
                  <MenuItem key={index} value={item.productSize}>{item.productSize}</MenuItem>
              ))              
            }            
          </Select>
         </div>
         <div className="col-12 col-md-4 col-sm-6 mb-3">
          <label htmlFor="name">Product WEIGHT</label>
          <Select multiple value={productWeight} onChange={handleChangeProductWeight} className="form-control"  MenuProps={MenuProps}>            
             {
              productWeightData.length > 0 && productWeightData.map((item, index)=>(
                  <MenuItem key={index} value={item.productWeight}>{item.productWeight}</MenuItem>
              ))              
            }
          </Select>
         </div>
         {
          selectedLocation?.length !== 0 &&
           <div className="col-12 mb-3">
            <label htmlFor="name">Location</label>
             <Select2 isMulti defaultValue={selectedLocation} name="location" options={countryList} className='basic-multi-select' 
           classNamePrefix="select" onChange={handleChangeLocation} />
          </div>
         }
         <div className="col-12 mb-3">
          <label htmlFor="images">Category Image</label>
          <div className='imgRow'>
            <input type="text" name="images" className="form-control" ref={productImages} /> 
            <Button variant="contained" onClick={addProductImg}>Add</Button>
          </div>
         </div>
         <div className="col-12 mb-3">
          <button type="submit">{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Product' }</button> 
         </div> 
       </div>       
     </div>
     <div className="card shadow border-0 w-100 p-3 pb-2 mt-5">
        <div className='imageUploadSec'>
           <h5 className="mb-3">Media add Published </h5>       
              <div className='imgUploadBox d-flex'>
                {
                  previews?.length !== 0 && previews?.map((img, index)=>{
                    return(
                     <div className='imgUpload' key={index}>
                       {
                        isSelectedImages === true ?
                        <img src={`${img}`} className='w-100' alt='' />
                        :
                        <img src={`${context.imageBaseUrl}/uploads/${img}`} className='w-100' alt='' />
                       }
                    </div>
                    )
                  })
                }
                 <div className='imgUpload'>
                   <input type='file' multiple onChange={(e)=> onChangeFile(e, '/api/products/upload')} name="images" />
                   <div className='fileInfo'>
                    <FaRegImage />
                   <p>Upload Images</p></div>
                 </div>
                                 
              </div>

           <div className="mt-4 mb-3">
             <button type="submit" className='d-block w-100'>{ isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Add Product' }</button> 
            </div> 
         </div>
        </div> 
       </form>   
     </div>    
    <div className='col-md-3'>
      <div className='stickyBox mt-5'>
        {
          productImgArr?.length !== 0 && 
          <div className='mb-3'><h5>Product Images</h5></div>    
        }
      <div className='imgGrid d-flex'>
         {
          productImgArr?.map((image,index) =>{
            return(
              <div className='img' key={index}>
               <img src={`${context.imageBaseUrl}/uploads/${image}`} alt='image' className='w-100' />  
              </div>
            )
          })
         } 
      </div>
     </div> 
    </div>
    </div>
   </>   
   )
}

export default EditProduct;