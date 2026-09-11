import './App.css';
import React, { createContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SideBarNav from './components/SideBar';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from "react-top-loading-bar";
import axios from 'axios';

import SignUp from './pages/SignUp';
import Category from './pages/Category/categoryList';
import AddCategory from './pages/Category/AddCategory';
import EditCategory from './pages/Category/editCategory';
import Products from './pages/Products';
import AddProduct from './pages/Products/addProduct';
import EditProduct from './pages/Products/editProduct';
import { fetchDataFromApi } from './utils/api';
import SubCategory from './pages/Category/subCategory';
import AddSubCat from './pages/Category/addSubCat';
import EditSubCat from './pages/Category/editSubCat';
import AddProductRams from './pages/Products/addProductRams';
import AddProductWeight from './pages/Products/addProductWeight';
import AddProductSize from './pages/Products/addProductSize';
import Orders from './pages/Orders';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import AddHomeSlide from './pages/HomeBanner/AddHomeSlide';
import HomeSlidesList from './pages/HomeBanner/homeSlideList';
import EditHomeSlide from './pages/HomeBanner/editHomeSlide';
import Newsletter from "./pages/Newsletter";

export const MyContext = createContext();

/*const baseUrl = "http://localhost:5000/api";
const imageBaseUrl = "http://localhost:5000";*/
const baseUrl = "https://fullstack-ecommerce-server-nvrg.onrender.com/api";
const imageBaseUrl = "https://fullstack-ecommerce-server-nvrg.onrender.com";

function App() {
  const [selectedLocation, setSelectedLocation]= useState("");
  const [countryList, setCountryList]= useState([]);
  const [selectCountry, setselectCountry] = useState("");

  const [isToogleSideBar, setIsToogleSideBar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarandHeader, setIsHideSidebarandHeader] =  useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [catData, setCatData] = useState([]);
 
  const [user, setUser] = useState({
    name:'',
    email:'',
    userId:''
  });


 useEffect(()=>{
  const theme_Mode = localStorage.getItem('themeMode');

  if(themeMode===true){
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('themeMode','light'); 
  }else{
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('themeMode','dark');
  }
 },[themeMode]);

 useEffect(()=>{
   const token = localStorage.getItem("token");

   if(token!=="" && token!== undefined && token!==null){
    setIsLogin(true);
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData); 

   }else{
    setIsLogin(false);
   }
 },[isLogin]);

 const countryListArr = []

 const getCountry =async(url)=>{
    /* const responsive = await axios.get(url).then((res)=>{
       setCountryList(res.data.data)      
     })*/
    const responsive = await axios.get(url).then((res)=>{
      if(res !== null){
        res.data.data.map((item, index) =>{
          countryListArr.push({
            value:item?.iso2,
            label:item?.country
          })
        })
       setCountryList(countryListArr)  
      }
    })
 }

 useEffect(()=>{
  getCountry("https://countriesnow.space/api/v0.1/countries");
 },[]);

 const fetchCategory =()=>{
    setProgress(40);
    fetchDataFromApi('/api/category').then((res)=>{
      setCatData(res);
     // console.log(res);
    setProgress(100);
    }) 
 } 
  useEffect(()=>{
       setProgress(20);
       fetchCategory();           
   },[]);

  const [alertBox, setAlertBox] = useState({    
    msg:'',
    error:true,
    open:false
 })
const [progress, setProgress] = useState(0);
const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({
      open:false,     
    });
  };
  const values = {
    countryList,
    setselectCountry,
    selectCountry,
    alertBox,
    setAlertBox,
    setProgress,
    themeMode,
    setThemeMode,
    baseUrl,
    imageBaseUrl,
    catData,
    setCatData,
    fetchCategory,   
    setIsHideSidebarandHeader,
    setUser,
    user,
    isToogleSideBar,
    setIsToogleSideBar,
    isLogin,
    setIsLogin
  }

  return (
   <>
   <div className="flex-page">
    <BrowserRouter>
     <MyContext.Provider value={values}>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className='loaderProg'
      />
      <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertBox.error=== false ? "success" : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertBox.msg}
        </Alert>
      </Snackbar>
     
     <div className="body-sec">
      {
        isHideSidebarandHeader !== true &&
        <div className={`left-sidebar ${isToogleSideBar === true ? 'toggle' : ''}`}>
         <SideBarNav />
       </div>
      }
       
       <div className={`right-page ${isHideSidebarandHeader === true && 'full'} ${isHideSidebarandHeader === false && ''}`}>
        {
          isHideSidebarandHeader !== true && <Header />
        }
        <div className="main-container"> 
         <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path='/login' element={<Login />} /> 
          <Route path='/signup' element={<SignUp />} />
          <Route path='/category' element={<Category />} />
          <Route path='/category/add' element={<AddCategory />} />
          <Route path='/category/edit/:id' element={<EditCategory />} />
          <Route path='/subCategory' element={<SubCategory />} />  
          <Route path='/subCategory/add' element={<AddSubCat />} /> 
          <Route path='/subCategory/edit/:id' element={<EditSubCat />} />          
          <Route path='/products' element={<Products />} />
          <Route path='/product/add' element={<AddProduct />} />
          <Route path='/product/edit/:id' element={<EditProduct />} />
          <Route path='/productRams/add' element={<AddProductRams />} />
          <Route path='/productWeight/add' element={<AddProductWeight />} />
          <Route path='/productSize/add' element={<AddProductSize />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/product/details/:id' element={<ProductDetails />} />
          <Route path='/homeBannerSlide/add' element={<AddHomeSlide />} />
          <Route path='/homeBannerSlide/list' element={<HomeSlidesList />} />
          <Route path='/homeBannerSlide/edit/:id' element={<EditHomeSlide />} />
          <Route path="/newsletter" element={<Newsletter />} />
         </Routes>
       </div>
      </div> 
     </div>
     {
      isHideSidebarandHeader !== true && <Footer />
     }      
     </MyContext.Provider>  
    </BrowserRouter>
    </div> 
   </>
  );
}

export default App;
