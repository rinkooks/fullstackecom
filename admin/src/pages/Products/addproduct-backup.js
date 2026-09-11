import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';

const AddProduct= () =>{  
  const [ratingValue, setRatingValue] = useState(2); 
  const[isFeaturedValue, setIsFeaturedValue]= useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [productImgArr, setProductImgArr] = useState([]);

  const [catData, setCatData] = useState([]);
  const [categoryValue, setCatgoryValue] = useState('')

  const productImages = useRef();

  const context = useContext(MyContext);
  const [formData, setFormdata]= useState({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: null,
    oldprice: null,
    category: "",
    countInStock: null,
    rating: 0,
    isFeatured: null,
  });

  const inputChange = (e) =>{
    setFormdata(()=>({
       ...formData,
      [e.target.name]:e.target.value   
    }))
  }

  const handleChangeCatgory = (event) => {
    setCatgoryValue(event.target.value);
     setFormdata(()=>({
       ...formData,
       category:event.target.value     
    }))
  } 

  const handleChangeisFeaturedValue = (event) => {
    setIsFeaturedValue(event.target.value);
     setFormdata(()=>({
       ...formData,
       isFeatured: event.target.value === "true" ? true : false,    
    }))
  } 

  useEffect(()=>{
       context.setProgress(40);
       fetchDataFromApi('/api/category').then((res)=>{
          setCatData(res);
        //  console.log(res);
        context.setProgress(100);
       })
  },[]);

  const addProductImg= ()=>{
    if (productImages.current.value !== "") {
      setProductImgArr([...productImgArr, productImages.current.value]);
      productImages.current.value = "";
    }
    // setProductImgArr(prevArray => [...prevArray, productImages.current.value]);
    // productImages.current.value="";
  }

   const addProduct =(e)=>{
    e.preventDefault();

    formData.images = productImgArr;
    console.log(formData);

    if (formData.name === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product Name",
    error: true
  });
  return false;
}

if (formData.description === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product description",
    error: true
  });
  return false;
}

if (formData.brand === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product brand",
    error: true
  });
  return false;
}

if (formData.countInStock === null || formData.countInStock === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Add Count In Stock",
    error: true
  });
  return false;
}
if (formData.price === null || formData.price === "" || formData.price <= 0) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product price",
    error: true
  });
  return false;
}
if (formData.oldprice === null || formData.oldprice === "" || formData.oldprice <= 0) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Product oldprice",
    error: true
  });
  return false;
}

if (formData.category === "") {
  context.setAlertBox({
    open: true,
    msg: "Please Select Product Category",
    error: true
  });
  return false;
}

if (formData.rating === "" || formData.rating === null) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Rating",
    error: true
  });
  return false;
}

if (formData.isFeatured === null) {
  context.setAlertBox({
    open: true,
    msg: "Please Select Products isFeatured",
    error: true
  });
  return false;
}

if (!formData.images || formData.images.length === 0) {
  context.setAlertBox({
    open: true,
    msg: "Please Add Products Images",
    error: true
  });
  return false;
}



    const finalData = {
      ...formData,
      images: productImgArr,
      rating: ratingValue,
    };
   setIsLoader(true);
   postData('/api/products/create', finalData)
  .then((res)=>{
    setIsLoader(false);
    context.setAlertBox({
      open:true,
      msg:'This Product is Created!',
      error:false
    })    
    setFormdata({
    name: "",
    description: "",
    images: [],
    brand: "",
    price: 0,
    oldprice: 0,
    category: "",
    countInStock: 0,
    rating: 0,
    isFeatured: false,
   });
  })
   .catch((err) => {
     setIsLoader(false);
      context.setAlertBox({
        open: true,
        msg: "Something went wrong!",
        error: true,
     });
  });

  /** if (formData.name !== "" && formData.images.length !== 0 && formData.color !== "") {
      setIsLoader(true);
     postData('/api/category/create', formData).then((res)=>{
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
       <h5>Add Product</h5>            
       <div className="breadcrumbs">
         <ul>
           <li><Link>Home</Link></li>
           <li><Link>Product</Link></li>
           <li><Link>Add</Link></li> 
         </ul>
       </div>
     </div>
     <div className='row'>
     <div className='col-md-9'>
      <div className="card shadow border-0 w-100 flex-row p-3 pb-2 mt-5">
       <form onSubmit={addProduct}>   
       <h5 className="mb-3">Add Product</h5>      
       <div className="row">
         <div className="col-12 mb-3">
          <label fohtmlFor="name">Product Name</label>
          <input type="text" name="name" value={formData.name} className="form-control" onChange={inputChange} placeholder='Product Name' /> 
         </div>
         <div className="col-12 mb-3">
          <label fohtmlFor="name">Description</label>
          <textarea name="description" value={formData.description} className="form-control" onChange={inputChange} placeholder='description' />           
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">Category</label>
          <select className='form-control' value={categoryValue} onChange={handleChangeCatgory}>
            <option>none</option>
             {
              catData?.categoryList?.length > 0 && catData?.categoryList?.map((catData, index)=>{
                return(
                 <option key={index} value={catData.id}>{catData.name}</option>       
                )
              })
            }
          </select> 
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">Product Brand</label>
          <input type="text" name="brand" value={formData.brand} className="form-control" onChange={inputChange} placeholder='Brand' /> 
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">countInStock</label>
          <input type="text" name="countInStock" value={formData.countInStock} className="form-control" onChange={inputChange} placeholder='stock' /> 
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">Price</label>
          <input type="text" name="price" value={formData.price} className="form-control" onChange={inputChange} placeholder='price' /> 
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">Old Price</label>
          <input type="text" name="oldprice" value={formData.oldprice} className="form-control" onChange={inputChange} placeholder='Old Price' /> 
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">IsFeatured</label>
          <select value={isFeaturedValue}  onChange={handleChangeisFeaturedValue} displayEmpty input={{'aria-label': 'without label'}} 
          className='form-control'>
            <option>None</option>
            <option value={true}>true</option>
            <option value={false}>false</option>
          </select>
         </div>
         <div className="col-12 col-sm-6 mb-3">
          <label fohtmlFor="name">Rating</label>
          <Rating value={ratingValue} 
               onChange={(event, newValue) => {
               setRatingValue(newValue);
              // setFormdata({
              //   ...formData,
              //   rating: newValue
              // });
            }}
          />
         </div>
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
       </form>
     </div>
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
               <img src={image} alt='image' className='w-100' />  
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

export default AddProduct;