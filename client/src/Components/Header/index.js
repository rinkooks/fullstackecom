import React, { useState } from 'react';
import logo from './../../assets/images/bacola-logo.webp';
import Button from '@mui/material/Button';
import { GoSearch } from "react-icons/go";
import { LuUserRound } from "react-icons/lu";
import { IoBagOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

import AllCategories from '../AllCategories';
import Navigation from '../Navigation';
import LocationModel from '../LocationModel';
import { useContext } from 'react';
import { MyContext } from '../../App';

/** dropdown ***/
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaClipboardCheck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import SearchBox from './SearchBox';
import { useEffect } from 'react';

const Header=()=>{
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
  }, []);

  const logout = ()=>{
    setAnchorEl(null);
    localStorage.clear();
    context.setIsLogin(false);
  }
  
    return(
     <>
      <div className="top-strip">
        <div className="container">Due to the COVID 19 epidemic, orders may be processed with a slight delay</div>
      </div>
      <div className="comp-head">
        <div className="container">
           <div className="row align-items-center justify-content-center">
             <div className="col-md-2">
               <div className='comp-logo'><Link to='/'><img src={logo} alt={logo} /></Link></div>
             </div>
             <div className="col-md-10">
              <div className='d-flex align-items-center justify-content-center headLocSrch'>
              {context.countryList.length!==0  && <LocationModel />  }
              <div><SearchBox /></div>
              <div className='rghtNavCart ms-auto d-flex align-items-center justify-content-center'>
                {
                  context.isLogin!== true ? <Link to="/signin"><Button className='blue-btn btn-lg btn-round'>
                   SignIn</Button></Link> :
                  <>
                  <div className='userList'>
                  <Button className='userView circle' onClick={handleClick}>
                   { user?.images?.length > 0 ? ( <img src={user.images[0]} alt="profile" className="profileImg" />
                    ) : ( <LuUserRound /> ) } 
                    </Button>
                   <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose} 
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                    <Link to="/my-account"><MenuItem onClick={handleClose}><MdAccountCircle /> My Account </MenuItem></Link>
                    <Link to="/orders"><MenuItem onClick={handleClose}><FaClipboardCheck /> My Orders </MenuItem></Link>
                    <Link to="/my-list"><MenuItem onClick={handleClose}><FaHeart /> My List </MenuItem></Link>
                    <MenuItem onClick={logout}><IoMdLogOut /> Logout </MenuItem>
                  </Menu>
                 </div> 
                 </>
                }
                 <div className='cartWrap ms-4 d-flex'>
                     <div className='cartPrice'><span className='price'>Rs. &nbsp;
                      {
                      //  context.cartData?.length!== 0 ?
                      Array.isArray(context.cartData) && context.cartData.length > 0 ?
                        context.cartData?.map(item => parseInt(item.price) * item.quantity)
                        .reduce((total, value) => total + value, 0) : 0
                      }</span></div>
                     <Button className='p-0'>
                     <div className='cartHead cursor-pointer' onClick={()=>navigate('/cart')}><IoBagOutline />
                       <div className='cartCount'>{context.cartData?.length}</div>
                     </div></Button>
                   </div>
              </div>
             </div></div>
            </div> 
        </div>
      </div>
      <div className='navigation'>
        <div className='container'>
            <div className='row align-items-center justify-content-center'>
              <div className='col-md-3'>
                <AllCategories navData={context.categoryData} />
               </div>
              <div className='col-md-9'>
              {
                context.categoryData?.length !== 0  && <Navigation navData={context.categoryData} /> 
              }
             </div> 
            </div>
        </div>
      </div>
      
     </>   
    )
}


export default Header;