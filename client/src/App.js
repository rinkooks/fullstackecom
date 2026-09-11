import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './Components/Footer';
import Listing from './Pages/Listing';
import Details from './Pages/Details';
import Cart from './Pages/Cart';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import ProductModel from './Components/ProductModel';
import { fetchDataFromApi, postData } from './utils/api';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MyList from './Pages/myList';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import SearchPage from './Pages/Search';
import MyAccount from './Pages/MyAccount';
import VerifyOTP from './Pages/VerifyOTP';
import ChangePassword from './Pages/ChangePassword';

const MyContext = createContext();

function App() {

  const [countryList, setCountryList]= useState([]);
  const [selectCountry, setselectCountry] = useState("");
  const [isOpenProductModal, setIsOpenProductModal] = useState({
    id:'',
    open:false    
  });
  const [showHeaderFooter, setshowHeaderFooter]=useState(true);
  const [isSignin, setisSignin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [productData, setProductData] = useState();
  const [categoryData, setCateoryData] = useState([]);
  const [subCategoryData, setSubCateoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');

  const [user, setUser] = useState({
    name:'',
    email:'',
    userId:''
  });
  
  
  const [addingInCart, setAddingInCart] = useState(false);
  const [cartData, setCartData] = useState([]); 
  const [searchData, setSearchData] = useState([]);

  /*const baseUrl = "http://localhost:5000/api";
  const imageBaseUrl = "http://localhost:5000";*/
  const baseUrl = "https://fullstack-ecommerce-server-nvrg.onrender.com/api";
  const imageBaseUrl = "https://fullstack-ecommerce-server-nvrg.onrender.com";
  
  useEffect(()=>{
    getCountry("https://countriesnow.space/api/v0.1/countries");

    fetchDataFromApi("/api/category").then((res)=>{
       setCateoryData(res.categoryList);
       setActiveCat(res.categoryList[0]?.name);
       console.log(res.categoryList);
    });
    //fetchDataFromApi("/api/subcat?page=1&perPage=7").then((res)=>{
    fetchDataFromApi("/api/subcat").then((res)=>{  
       setSubCateoryData(res.subCategoryList);      
    });

    fetchDataFromApi(`/api/cart`).then((res)=>{
       console.log("Cart API:", res);
       setCartData(res);
    })

    const location = localStorage.getItem("location");
    if(location !== null && location !== "" && location !== undefined){
      setselectCountry(location);
    }

  },[]);

  const getCartData=()=>{
    fetchDataFromApi(`/api/cart`).then((res)=>{
       setCartData(res);
    })
  }


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

  useEffect(()=>{
   if(isOpenProductModal.open === true){
     fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res)=>{
       setProductData(res);
     });
     console.log(productData)
    }
  }, [isOpenProductModal])

   const closeProductModel=()=>{
      // setisProModelOpen(false) 
      setIsOpenProductModal({
      id:'',
      open:false
      }) 
  }

  const getCountry =async(url)=>{
     const responsive = await axios.get(url).then((res)=>{
       setCountryList(res.data.data)
       console.log(res.data.data);    
     })
  }

  const [alertBox, setAlertBox] = useState({    
     msg:'',
     error:true,
     open:false
  });
  const [progress, setProgress] = useState(0);
  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setAlertBox({
        open:false,     
      });
    };
 const addToCart =(data)=>{
  setAddingInCart(true);
  postData('/api/cart/add', data)
    .then((res)=>{
      if(res.status !== false){
        setAlertBox({
          open:true,
          error:false,
          msg:"Item is Added in the Cart"
        })
        setTimeout(()=>{
          setAddingInCart(false);
        },1000); 
        getCartData();      
      } else {
        setAlertBox({
          open: true,
          error: true,
          msg: res.msg
        });
        setAddingInCart(false);
      }
    }).catch((err) => {
      const msg = err?.response?.data?.msg || "Server error";
      setAlertBox({
        open: true,
        error: true,
        msg: msg
      });
      setAddingInCart(false);
    }); 
}  

  const values ={
    countryList,
    setselectCountry,
    selectCountry,
    showHeaderFooter,
    setshowHeaderFooter,
    isLogin,
    setIsLogin,
    isOpenProductModal,
    setIsOpenProductModal,
    categoryData,
    setCateoryData,
    subCategoryData,
    setSubCateoryData,
    activeCat,
    setAlertBox,
    alertBox,
    addToCart,   
    addingInCart,
    setAddingInCart,
    cartData, 
    setCartData,
    getCartData,
    searchData, 
    setSearchData,
    imageBaseUrl    
  }

  return (
   <>
    <BrowserRouter>
    <MyContext.Provider value={values}>
    
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
      {
       showHeaderFooter === true && <Header />
      }    
     <Routes>
       <Route path='/' exact={true} element={<Home />} />
       <Route exact={true} path="/products/category/:id" element={<Listing />} /> 
       <Route exact={true} path='/products/subCat/:id' element={<Listing />} /> 
       {/* <Route path='/product/:id' element={<Details />} /> */}
       <Route exact={true} path='/details/:id' element={<Details />} /> 
       <Route exact={true} path='/cart' element={<Cart />} />
       <Route exact={true} path="/signin" element={<SignIn />} /> 
       <Route exact={true} path="/signup" element={<SignUp />} /> 
       <Route exact={true} path="/verifyOTP" element={<VerifyOTP />} /> 
       <Route exact={true} path="/changePassword" element={<ChangePassword />} /> 
       {/*<Route exact={true} path="/payment/complete/:id" element={<CompletePayment />} /> */}
       <Route exact={true} path="/my-list" element={<MyList />} />
       <Route exact={true} path="/checkout" element={<Checkout />} /> 
       <Route exact={true} path="/orders" element={<Orders />} /> 
       <Route exact={true} path="/search" element={<SearchPage />} />
       <Route exact={true} path="/my-account" element={<MyAccount />} />
     </Routes>
     {
       showHeaderFooter === true &&  <Footer />
      } 

      {
        isOpenProductModal.open === true && <ProductModel data={productData} />
      }

     </MyContext.Provider>
    </BrowserRouter>
   </>
  );
}

export default App;

export {MyContext};
