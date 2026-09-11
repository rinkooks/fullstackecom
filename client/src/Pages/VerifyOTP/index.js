import { Button, CircularProgress } from "@mui/material";
import OtpBox from "../../Components/OtpBox";
import secure from './../../assets/images/secure.png';

import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";


const VerifyOTP = ()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const context = useContext(MyContext);
    const history = useNavigate();

    const handleOtpChange = (value) =>{
        setOtp(value);
    }

    useEffect(()=>{
       context.setshowHeaderFooter(false);
    },[]);

    const verify=(e)=>{
       e.preventDefault();
       const obj ={
        otp:otp,
        email: localStorage.getItem('userEmail'),
       };
     if(otp!==""){
      const actionType = localStorage.getItem("actionType");
      postData(`/api/user/verifyemail`, obj).then((res)=>{
       if(res?.success === true){
         context.setAlertBox({
            open: true,
            error: false,
            msg: res?.message,
         });
         setIsLoading(false);
         if(actionType !== "changePassword"){
          localStorage.removeItem("userEmail");
          history("/signin");
         }else{
           history("/changePassword"); 
         }         
       }else{
         context.setAlertBox({
            open: true,
            error: true,
            msg: res?.message,
         });
         setIsLoading(false);
       }
     });
     }else{
      context.setAlertBox({
         open: true,
         error: true,
         msg: "Please Enter OTP",
      });
     };
   };
 return(
   <section className="pt-5 pb-5">   
    <div className="container otpPage">
     <div className="signin p-4">
       <div className="text-center"><img src={secure} alt="" width="100" /></div>
       <form className="mt-3" onSubmit={verify}>
        <h2 className="mb-1 text-center">OTP Verification</h2>
        <p className="text-center text-light">
           OTP has been sent to <b>{localStorage.getItem('userEmail')}</b>  
        </p>

        <OtpBox length={6} onChange={handleOtpChange} />
        <div className="d-flex align-items-center mt-3 mb-3">
         <Button  type="submit" className="btn-blue col btn-lg btn-bi"> 
            {isLoading === true ? <CircularProgress /> : "Verify OTP"}
         </Button>
        </div>
        <p className="text-center"><a className="border-effect cursor txt">Resend OTP</a></p>
       </form>
     </div>  

    </div>
  </section>
 )    
}

export default VerifyOTP;