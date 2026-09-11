import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { IoMdCloudUpload } from "react-icons/io";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { deleteData, deleteImages, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

import NoUserImg from '../../assets/images/user.png';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other} >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MyAccount=()=>{
const [isLogin, setIsLogin] = useState(false);
const history = useNavigate();

const [value, setValue] = React.useState(0);
const handleChange = (event, newValue) => {
    setValue(newValue);
 };
 
const [isLoader, setIsLoader] = useState(false);
const [userData, setUserData] = useState([]);
const [imgFiles, setImgFiles] = useState();
const [previews, setPreviews] = useState();
const [productImgArr, setProductImgArr] = useState([]);
const [uploading, setUploading] = useState(false); 
const formdata = new FormData();
const [formField, setFormField]= useState({
  name:'',
  email:'',
  phone:'',
  images:[],
}); 

const [field, setfield]= useState({
  oldPassword:'',
  password:'',
  confirmPassword:''  
});
const {id} = useParams();
const context = useContext(MyContext);

useEffect(()=>{
  window.scrollTo(0,0);
  const token = localStorage.getItem("token");
  if(token!=="" && token!== undefined && token!== null){
    setIsLogin(true);  
  }else{
    history("/signin")
  }

 const user = JSON.parse(localStorage.getItem("user"));

 fetchDataFromApi(`/api/user/${user?.userId}`).then((res)=>{
    setUserData(res);
    setFormField({
      name:res.name,
      email:res.email,
      phone:res.phone,
      images: res.images
    });   
   // setPreviews(res.images);
   setPreviews(Array.isArray(res.images) ? res.images : [res.images]);
   
 })

},[]);

 const changeInput=(e)=>{
    setFormField(()=>(
        {
          ...formField,
          [e.target.name]:e.target.value
        }  
    ))  
};
 const changeInput2=(e)=>{
    setfield(()=>(
        {
          ...field,
          [e.target.name]:e.target.value
        }  
    ))  
};

const onChangeFile = async (e) => {
   const files = e.target.files;
   const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }
  try {
    setUploading(true);
    const res = await postData("/api/user/upload", formData);
    if (res.success) {
      //setProductImgArr(res.images);
      setProductImgArr(Array.isArray(res.images) ? res.images : [res.images]);
      setPreviews(Array.isArray(res.images) ? res.images : [res.images]);
      //setPreviews(res.images);   
    }
    setUploading(false);  

    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Image upload failed"
      });
    }
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
      URL.revokeObjectURL(objectUrls[i])
    } 
  }
},[imgFiles]); 

 const removeImg = (index) => {
  const updatedPreviews = previews.filter((item, i) => i !== index);
  setPreviews(updatedPreviews);
  const updatedImages = productImgArr.filter((item, i) => i !== index);
  setProductImgArr(updatedImages);
 };

const editUser= async(e)=>{ 
   e.preventDefault();
 
   if (!formField.name || !formField.email || !formField.phone || previews.length === 0) {
     context.setAlertBox({
       open: true,
       error: true,
       msg: "Please Fill all the details"
     });
     return;
   }
   try {
     setIsLoader(true);
     const user = JSON.parse(localStorage.getItem("user"));

     const res = await editData(`/api/user/${user?.userId}`, {
       name: formField.name,
       email: formField.email,
       phone: formField.phone,
       images: productImgArr   // ✅ filenames array
     });
     setIsLoader(false);
    // deleteData("/api/imageUpload/deleteAllImages");
     history("/my-account");
 
   } catch (error) {
     setIsLoader(false);
     context.setAlertBox({
       open: true,
       error: true,
       msg: "User creation failed"
     });
   }
} 

const changePassword=(e)=>{
  e.preventDefault();

  formdata.append('password', field.password);

  if (field.oldPassword !== "" && field.password !== "" && field.confirmPassword !== ""){    
  if(field.password !== field.confirmPassword){
    context.setAlertBox({
       open: true,
       error: true,
       msg: "Password and Confirm Password not match"
     }); 
     return false;
  }else {  
  const user = JSON.parse(localStorage.getItem("user"));

  const data={
    name: user?.name,
    email: user?.email,   
    password: field.oldPassword,
    newPass: field.password,
    phone: field.phone,
    images: field.images
  }

 editData(`/api/user/changePassword/${user.userId}`, data)
  .then((res) => {

    if (res.error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: res.msg
      });
      return;
    }
    context.setAlertBox({
      open: true,
      error: false,
      msg: "Password Changed Successfully"
    });
    setfield({
      oldPassword: "",
      password: "",
      confirmPassword: ""
    });
  })
  .catch((error) => {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Something went wrong"
    });
  });
 }
  }else{
   context.setAlertBox({
       open: true,
       error: true,
       msg: "Please Fill all the password details"
     }); 
     return false;   
   }

}

return(
    <>
    <section className="pt-5 pb-4 accountPage">
    <div className="container">
    <div className="mb-4"><h2>My Account</h2></div>
        <Box sx={{ width: '100%' }} className="myAccBox card shadow p-3 border-0">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Edit Profile" {...a11yProps(0)} />
            <Tab label="Change Password" {...a11yProps(1)} />                
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <form onSubmit={editUser}>
           <div className="row">
             <div className="col-sm-4">
                <div className="userImage">
                  {
                   previews && previews.length > 0 ? (
                    previews.map((img, index) => (
                      <img key={index} src={img} alt="Profile" />
                    ))
                    ) : (
                      <img src={NoUserImg} alt="Profile" />
                    )
                  }
                  
                  <div className="overlay d-flex align-items-center justify-content-center">
                    <IoMdCloudUpload />                   
                    <input type='file' multiple onChange={(e)=>onChangeFile(e, '/api/user/upload')} name="images" />
                  </div> 
                </div>
             </div>
             <div className="col-sm-8">             
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group"><TextField label="Name" variant="outlined" name="name" onChange={changeInput}
                  value={formField.name} /></div>
                </div>
                <div className="col-md-6">
                 <div className="form-group"><TextField label="Email" variant="outlined" disabled name="email" 
                 onChange={changeInput} value={formField.email} /></div></div>
                <div className="col-md-6">
                 <div className="form-group"><TextField label="Phone" variant="outlined" name="phone" onChange={changeInput}
                 value={formField.phone} /></div></div> 
               </div>
               <Button type="submit" className="blue-btn">Save</Button>             
             </div>
           </div>
          </form> 
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <form onSubmit={changePassword}>          
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group"><TextField label="Old Password" variant="outlined" name="oldPassword"
                 value={field.oldPassword} onChange={changeInput2} /></div></div>
                <div className="col-md-4">
                 <div className="form-group"><TextField label="new Password" variant="outlined" name="password" 
                 value={field.password} onChange={changeInput2} /></div></div>
                <div className="col-md-4">
                 <div className="form-group"><TextField label="confirm Password" variant="outlined" name="confirmPassword" 
                 value={field.confirmPassword} onChange={changeInput2}/></div></div> 
              </div>
              <Button type="submit" className="blue-btn">Save</Button>             
          </form>
        </CustomTabPanel>           
        </Box>
    </div>
    </section>
    </>   
)
}

export default MyAccount;