import { useState } from 'react';
import googleIcon  from '../../assets/images/google-icon.svg';

import {IoMdEye, IoMdEyeOff, IoMdHome} from "react-icons/io";
import { MdOutlineMailOutline, MdOutlinePhoneAndroid } from "react-icons/md";

import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import { FaUserCircle } from 'react-icons/fa';

import CircularProgress from '@mui/material/CircularProgress';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase';
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp=()=>{
  const [isLoader, setIsLoader] = useState(false);
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword]= useState(false);


  const [formfields, setFormfields] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
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
  const signUp = (e) =>{
    e.preventDefault();    
   
     if(formfields.name === ""){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"Please Enter Your Name"
      })
     return false  
    }
    if(formfields.email === ""){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"Please Enter Your Email"
      })
     return false  
    }
    if(formfields.phone === ""){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"Please Enter Your phone"
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
     if(formfields.confirmPassword === ""){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"Please confirm Password"
      })
     return false  
    }
     if(formfields.password !== formfields.confirmPassword){
      context.setAlertBox({
         open:true,
         error:true,
         msg:"password not match"
      })
     return false  
    }
    setIsLoader(true); 
    postData('/api/user/signup', formfields).then((res)=>{

      if(res.status === true){
        context.setAlertBox({
         open:true,
         error:false,
         msg:"Register Succesfully"
      });

     setTimeout(()=>{
      setIsLoader(false);
       history('/login');
     }, 2000);
    }else{      
       context.setAlertBox({
         open:true,
         error:true,
         msg:res.msg
      });
      setIsLoader(false);      
    }
    }).catch((err) => {
     
    context.setAlertBox({
      open: true,
      error: true,
      msg: err?.response?.data?.msg || "Server error"
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
       <div className='row'>
         <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
          <div>
           <h1>BEST UI/UX Fashion <span className='text-sky'>Ecommerce Dashboard </span> & Admin Panel</h1>   
           <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p> 

           <div className='w-100 mt-4'>
             <Link to={'/'}><Button className="btn-blue btn-lg btn-big"><IoMdHome/> Go To Home</Button></Link> 
           </div>
          </div>  
         </div>
        <div className='col-md-4 pr-0 part2'>
          <div className='loginBox'>
            <div className='logo text-center'>
              {/* <img src={Logo} width="60px" /> */}
               <h5 className='font-weight-bold'>Register a new account</h5>    
            </div>    
           <div className='wrapper mt-3'>
             <form onSubmit={signUp}>
              <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                <span className='icon'><FaUserCircle /></span>
                <input type='text' className='form-control' placeholder='enter your name' 
                onFocus={() => focusInput(0)} onBlur={()=> setInputIndex(null)} autoFocus name="name"
                onChange={onchangeInput} />
              </div> 

               <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                <span className='icon'><MdOutlineMailOutline /></span>
                <input type='text' className='form-control' placeholder='enter your email' 
                onFocus={() => focusInput(1)} onBlur={()=> setInputIndex(null)} autoFocus name="email"
                onChange={onchangeInput} />
              </div> 

              <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                <span className='icon'><MdOutlinePhoneAndroid /></span>
                <input type='text' className='form-control' placeholder='enter your phone' 
                onFocus={() => focusInput(2)} onBlur={()=> setInputIndex(null)} autoFocus name="phone"
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
              <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                <span className='icon'><IoShieldCheckmarkSharp /></span>
                <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className='form-control' 
                placeholder='enter your confirm password' onFocus={() => focusInput(4)}
                onBlur={()=> setInputIndex(null)} name="confirmPassword"
                onChange={onchangeInput} />
                <span className='toggleShowPassword' onClick={()=> setisShowConfirmPassword(!isShowConfirmPassword)}>  
                  {
                    isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                  }
                </span>
              </div> 
              <div className='form-group'>
              <FormControlLabel control={<Checkbox />} label="I agree to the all Terms & Conditions"></FormControlLabel></div>
              <div className='form-group'>
                 <Button varient="contained" type='submit' className="btn-blue btn-lg w-100 btn-big">
                  { isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Sign Up' }</Button>
              </div>
              <div className='form-group text-center mb-0'>
                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                  <span className='line'></span>  
                  <span className='txt'>or</span>  
                  <span className='line'></span>  
                </div> 
               </div>
               <Button varient="outlined" className='w-100 btn-lg btn-big loginWithGoogle' onClick={signInWithGoogle}>
                 <img src={googleIcon} width="40" height="40" /> &nbsp;&nbsp; SignUp with Google
               </Button>   
            </form>
           </div>
           <div className='wrapper mt-3 text-center text-decoration-none fs-6'>
             You have an account? <Link to='/signup' className='text-decoration-none'>Login here </Link>
           </div>
          </div>
        </div>
       </div>
    </section>
    </>
  )
}

export default SignUp;