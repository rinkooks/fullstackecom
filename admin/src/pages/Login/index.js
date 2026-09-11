import { useState } from 'react';
import googleIcon  from '../../assets/images/google-icon.svg';

import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import { MdOutlineMailOutline} from "react-icons/md";
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { MyContext } from '../../App';
import { postData } from '../../utils/api';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase';
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();


const Login=()=>{
  const [isLoader, setIsLoader] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
 
  const [formfields, setFormfields] = useState({   
    email:"",   
    password:"",  
    isAdmin:true,
  })

  const history = useNavigate();
 
  const context = useContext(MyContext);

  useEffect(()=>{
    context.setIsHideSidebarandHeader(true);
    window.scroll(0,0);
  },[]);

  const focusInput = (index) =>{
    setInputIndex(index);
  }

  const onchangeInput=(e)=>{
    setFormfields(()=>({
      ...formfields,
      [e.target.name]:e.target.value
    }));
  }
  const signin = (e) =>{
    e.preventDefault();
   
     if(formfields.email === ""){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"Please Enter Your Email"
      })
     return false  
    }
    if(formfields.password === ""){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"Please Enter Your password"
      })
     return false  
    }

  const { email, password } = formfields;
  setIsLoader(true);

  postData('/api/user/signin', { email, password })
    .then((res) => {
      localStorage.setItem("token", res.token);

      const user = {
        name: res.user?.name,
        email: res.user?.email,
        userId: res.user?._id
      };

      localStorage.setItem("user", JSON.stringify(user));

      context.setAlertBox({
        open:true,
        error:false,
        msg:"User Login Successfully"
      });

      setTimeout(()=>{
        setIsLoader(false);
        window.location.href = '/'
      }, 2000);
    })
    .catch((err) => {           
      context.setAlertBox({
        open: true,
        error: true,
        msg: err?.response?.data?.msg || "Invalid credentials"
      });
      setIsLoader(false);
    });
  }

  const signInWithGoogle =()=>{
     signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      
      const fields={
         name: user.displayName,
         email: user.email,       
         images: user.photoURL,
         phone: user.phoneNumber,
         password: "",
         isAdmin: true
      }
  
     postData("/api/user/authWithGoogle", fields).then((res)=>{
       console.log("Google Login Response:", res);
         try{
          if(res.error !== true){
            localStorage.setItem("token", res.token);
  
           const user = {
              name: res.user.name,
              email: res.user.email,
              userId: res.user._id,
              images: res.user.images
            };
  
           localStorage.setItem("user", JSON.stringify(user));
  
            context.setAlertBox({
              open: true,
              error: false,
              msg: res.msg,
            });
            setTimeout(()=>{
              setIsLoader(false);
              window.location.href = "/";
            }, 2000);
          }else{
            context.setAlertBox({
              open: true,
              error: true,
              msg: res.msg,
            });
            setIsLoader(false);
          }
         }catch(error){
          console.log(error);
          setIsLoader(false);
         }
      })   
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: errorMessage,
      });
    });
  }

  return(
    <>
    <div className='loginPatern'></div>
    <section className='loginSection signupsection position-relative '>
      
          <div className='loginBox login'>
            <div className='logo text-center'>
              {/* <img src={Logo} width="60px" /> */}
               <h5 className='font-weight-bold'>Login</h5>    
            </div>    
           <div className='wrapper mt-3'>
             <form onSubmit={signin}>
             

               <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                <span className='icon'><MdOutlineMailOutline /></span>
                <input type='text' className='form-control' placeholder='enter your email' 
                onFocus={() => focusInput(1)} onBlur={()=> setInputIndex(null)} autoFocus name="email"
                onChange={onchangeInput} />
              </div> 

             
              <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                <span className='icon'><IoShieldCheckmarkSharp /></span>
                <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' 
                placeholder='enter your password' 
                onFocus={() => focusInput(3)} onBlur={()=> setInputIndex(null)} autoFocus name="password"
                onChange={onchangeInput} />
                <span className='toggleShowPassword' onClick={()=> setIsShowPassword(!isShowPassword)}>  
                  {
                    isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                  }
                </span>
              </div> 
             
              <div className='form-group'>
                 <Button varient="contained" type='submit' className="btn-blue btn-lg w-100 btn-big">
                  { isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Login' }</Button>
              </div>
              <div className='mt-2 text-center text-decoration-none'>
                 <Link className='text-decoration-none'>Forget Password</Link> 
              </div>
              <div className='form-group text-center mb-0'>
                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                  <span className='line'></span>  
                  <span className='txt'>or</span>  
                  <span className='line'></span>  
                </div> 
               </div>
               <Button varient="outlined" className='w-100 btn-lg btn-big loginWithGoogle' onClick={signInWithGoogle}>
                 <img src={googleIcon} width="40" height="40" /> &nbsp;&nbsp; Login with Google
               </Button>   
            </form>
           </div>
           <div className='wrapper mt-3 text-center text-decoration-none fs-6'>
               Don't have an account? <Link to='/signup' className='text-decoration-none'>Register</Link>
           </div>
          </div>
    </section>
    </>
  )
}

export default Login;