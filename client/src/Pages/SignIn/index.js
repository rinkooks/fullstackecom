import { useContext, useEffect, useState } from 'react';
import logo from './../../assets/images/bacola-logo.webp';
import google from './../../assets/images/google.png';
import { MyContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { postData } from '../../utils/api';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignIn=()=>{
  const [isLoader, setIsLoader] = useState(false);
  const context = useContext(MyContext);

useEffect(()=>{
    context.setshowHeaderFooter(false);
},[])

const [formfields, setFormfields] = useState({   
  email:"",   
  password:"",  
  isAdmin:false,
})  

const history = useNavigate();
useEffect(()=>{
     context.setshowHeaderFooter(false);
    window.scroll(0,0);
},[]);

const onchangeInput=(e)=>{
  setFormfields(()=>({
    ...formfields,
    [e.target.name]:e.target.value
}));
}

const login = (e) =>{
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
       isAdmin: false
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

const forgotPassword =(e)=>{
  if(formfields.email === ""){
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please Enter Your Email",
    });
  }else{
    localStorage.setItem("userEmail", formfields.email);
    localStorage.setItem("actionType", "changePassword");
    postData(`/api/user/forgotPassword`, {email: formfields.email}).then((res)=>{
      if(res.status==="SUCCESS"){
         history('/verifyOTP');
      }
    })    
  }
}

return(
 <>
   <section className="pt-5 pb-5">
    <div className="container">
      <div className="signin p-4">
        <div className="mb-5 text-center"><img src={logo} alt="" width="200" /></div>
        <div className="mb-3"><h2>Sign In</h2></div>
        <form onSubmit={login}>
          <div className='mb-4'>            
            <TextField label="UserName" name='email' onChange={onchangeInput} variant="standard" />
          </div>
          <div className='mb-4'>
           <TextField label="Password" name='password' onChange={onchangeInput} type="password" variant="standard" />
          </div>
          <div className='mb-3 fw-bolder'> <Link onClick={forgotPassword}>Forget Password</Link> </div>
          <div className='mb-3 row'>
             <div className='col-6'><Button type='submit' className='blue-btn col'>
              { isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Sign In' }</Button></div>
             <div className='col-6'><Link to="/"><Button className='me-1 col bdr-btn' 
             onClick={()=>context.setshowHeaderFooter(true)}>Cancel</Button></Link></div>
          </div>
          <div className='mb-4 '>Don't have a account <Link to="/signup">Signup</Link> </div>
          <div className='mt-4 fs-5 text-center'>Or Continue with social account</div>
          <div className='mt-4 fs-5 text-center'>
            <Button className='g-login' onClick={signInWithGoogle}><img src={google} alt="" width="45" /> Sign in with Google</Button></div>
        </form>
      </div>  
    </div>
   </section>
 </>   
 )
}

export default SignIn;