import { Button, ListItem, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { MdMenuOpen, MdOutlineLightMode, MdOutlineMenu } from "react-icons/md";
import { MdModeNight } from "react-icons/md";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonAdd, IoShieldHalfSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";

const Header = () =>{
  const [anchorEI, setAnchorEI] = useState(null);
  const [isOpennotificationDrop, setIsOpennotificationDrop] = useState(false);
  const openMyAcc = Boolean(anchorEI);
  const openNotifications = Boolean(isOpennotificationDrop);

  const context = useContext(MyContext);
  const history = useNavigate();

  const handleOpenMyAccDrop = (event) =>{
    setAnchorEI(event.currentTarget);
  };
  const handleCloseMyAccDrop = () =>{
     setAnchorEI(null);
  }
  const handleOpennotificationDrop = () =>{
      setIsOpennotificationDrop(true);
  }
  const handleClosenotificationDrop = () =>{
    setIsOpennotificationDrop(false);
  }

 const logout = () => {
  localStorage.clear();
  context.setIsLogin(false);
  context.setUser({
    name: '',
    email: '',
    userId: ''
  });
  setAnchorEI(null);
  context.setAlertBox({
    open: true,
    error: false,
    msg: "Logout SuccessFully"
  });
  setTimeout(() => {
    history('/login');
  }, 2000);
};
return(
<>
<header>
  <div className="topHead">
  <div className="row">   
  <div className="col-sm-3 d-flex align-items-center">
      <Button className="rounded-circle mr-3" onClick={()=> context.setIsToogleSideBar(!context.isToogleSideBar)}>
        {
          context.isToogleSideBar === false ? <MdMenuOpen /> : <MdOutlineMenu />
        }
      </Button>     
      {/** <SearchBox /> */}  
    </div>
    <div className="col-sm-9">
      <div className="d-flex justify-content-between">
        <Button size="large" onClick={() => context.setThemeMode(!context.themeMode)}>
        {context.themeMode ? <MdModeNight /> : <MdOutlineLightMode />}
        </Button>
        <div className="myAccWrapper">
        <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
          <div className="userImg">
              <span className="rounded-circle">
                {context.user?.name?.charAt(0)}
              </span>
          </div>
          <div className="userInfo">
            <h4>{context.user?.name}</h4>
            <p className="mb-0">{context.user?.email}</p>
          </div>
        </Button>
        {context.isLogin ? (
        <Menu anchorEl={anchorEI} id="account-menu" className="accNav" open={openMyAcc} onClose={handleCloseMyAccDrop}
        onClick={handleCloseMyAccDrop} transformOrigin={{ horizontal:'left', vertical:'top' }} anchorOrigin={{ 
          horizontal:'top', vertical:'bottom' }}>
          <MenuItem onClick={handleCloseMyAccDrop}>
            <ListItemIcon><IoPersonAdd fontSize="small"></IoPersonAdd> My Account</ListItemIcon>
          </MenuItem>
          <MenuItem onClick={handleCloseMyAccDrop}>
            <ListItemIcon><IoShieldHalfSharp /> Reset Password</ListItemIcon>
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemIcon><IoMdLogOut fontSize="small"></IoMdLogOut> Logout</ListItemIcon>
          </MenuItem>  
        </Menu>
        ) : (
        <Link to='/signup'><Button size="large" variant="contained">SignUp</Button></Link>
        )}
        </div>              
      </div> 
    </div> 
  </div>        
  </div>
</header>
</>   
)}
export default Header;