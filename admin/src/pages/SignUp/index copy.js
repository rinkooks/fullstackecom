import { useState } from 'react';
import googleIcon  from '../../assets/images/google-signin.jpg';
import {IoMdEyeOff, IoMdHome} from "react-icons/io";

import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useEffect } from 'react';


const SignUp=()=>{
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword]= useState(false)
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);

  const [formfields, setFormfields] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
    isAdmin:true,
  })

  const history = useNavigate();
 
  //const context = useContext(MyContext);

  useEffect(()=>{
    context.setIsHideSidebarAndHeader(true);
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
  }

  return(
    <>
    {/* <img src={patern} className='loginPatern' /> */}
    <section className='loginSection signupsection'>
       <div className='row'>
         <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
           <h1>BEST UI/UX Fashion <span className='text-sky'>Ecommerce Dashboard </span> & Admin Panel</h1>   
           <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p> 

           <div className='w-100 mt-4'>
             <Link to={'/'}><Button className="btn-blue btn-lg btn-big"><IoMdHome /> Go To Home</Button></Link> 
           </div> 
         </div>
        <div className='col-md-4 pr-0'>
          <div className='loginBox'>
            <div className='logo text-center'>
               <img src={Logo} width="60px" />
               <h5 className='font-weight-bold'>Register a new account</h5>    
            </div>    
           <div className='wrapper mt-3 card border'>
             <form onSubmit={signUp}>
              <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                <span className='icon'><faUserCircle /></span>
                <input type='text' className='form-control' placeholder='enter your name' 
                onFocus={() => focusInput(0)} onBlur={()=> setInputIndex(null)} autoFocus name="name"
                onChange={onchangeInput} />
              </div> 

               <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                <span className='icon'><MdEmail /></span>
                <input type='text' className='form-control' placeholder='enter your email' 
                onFocus={() => focusInput(1)} onBlur={()=> setInputIndex(null)} autoFocus name="email"
                onChange={onchangeInput} />
              </div> 

              <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                <span className='icon'><faUserCircle /></span>
                <input type='text' className='form-control' placeholder='enter your phone' 
                onFocus={() => focusInput(2)} onBlur={()=> setInputIndex(null)} autoFocus name="phone"
                onChange={onchangeInput} />
              </div>

              <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                <span className='icon'><faUserCircle /></span>
                <input type={`${isShowPassword === true ? 'text' : password}`} className='form-control' 
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
                <input type={`${isShowConfirnPassword === true ? 'text' : password}`} className='form-control' 
                placeholder='enter your confirm password' 
                onBlur={()=> setInputIndex(null)} name="confirm your password"
                onChange={onchangeInput} />

                <span className='toggleShowPassword' onClick={()=> setisShowConfirmPassword(!isShowConfirmPassword)}>  
                  {
                    isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                  }
                </span>
              </div> 
              <FormControlLabel control={<Checkbox />} label="I agree to the all Terms & Conditions"></FormControlLabel> 
              <div className='form-group'>
                 <Button type='submit' className="btn-blue btn-lg w-100 btn-big">Sign Up</Button>
              </div>
              <div className='form-group text-center mb-0'>
                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                  <span className='line'></span>  
                  <span className='txt'>or</span>  
                  <span className='line'></span>  
                </div> 
               </div>
               <Button varient="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                 <img src={googleIcon} width="25px" /> Sign In with Google
               </Button>   
            </form>
           </div>
          </div>
        </div>
       </div>
    </section>
    
    </>
  )
}

export default SignUp;