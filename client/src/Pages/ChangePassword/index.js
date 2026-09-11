import { useContext, useEffect, useState } from 'react';
import logo from './../../assets/images/bacola-logo.webp';
import { MyContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { postData } from '../../utils/api';

const ChangePassword=()=>{
  const [isLoader, setIsLoader] = useState(false);
  const context = useContext(MyContext);

useEffect(()=>{
    context.setshowHeaderFooter(false);
},[])

const [formfields, setFormfields] = useState({ 
  email: localStorage.getItem('userEmail'), 
  newPass:"",   
  confirmPass:""
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

const changePass=(e)=>{
  e.preventDefault();
  if(formfields.newPass===""){
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please Enter New Password",
    });
    return false
  }
  if(formfields.confirmPass===""){
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please Enter Confirm Password",
    });
    return false
  }
   if(formfields.newPass !== formfields.confirmPass){
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Password and confirm password do not match",
    });
    return false
  }
 postData(`/api/user/forgotPassword/changePassword`,formfields).then((res)=>{
    if(res.status==="SUCCESS"){
      context.setAlertBox({
      open: true,
      error: false,
      msg: res.message,
    });
    history("/signIn")
    }
 }) 

}

return(
 <>
   <section className="pt-5 pb-5">
    <div className="container">
      <div className="signin p-4">
        <div className="mb-5 text-center"><img src={logo} alt="" width="200" /></div>
        <div className="mb-3"><h2>Change Password</h2></div>
        <form onSubmit={changePass}>
          <div className='mb-4'>            
            <TextField label="new Password" name='newPass' onChange={onchangeInput} type="text" variant="standard" />
          </div>
          <div className='mb-4'>
           <TextField label="Confirm Password" name='confirmPass' onChange={onchangeInput} type="text" variant="standard" />
          </div>          
          <div className='mb-3 row'>
             <div className='col-6'><Button type='submit' className='blue-btn col'>
              { isLoader === true ? <CircularProgress color="inherit" className="loader" /> : 'Change Password' }</Button></div>            
          </div>
        
        </form>
      </div>  
    </div>
   </section>
 </>   
 )
}

export default ChangePassword;