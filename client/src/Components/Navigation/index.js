import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
// import { TfiAngleDown } from "react-icons/tfi";

const Navigation=(props)=>{
  const [isopenSidebarVal, setisopenSidebarVal] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);

  const context = useContext(MyContext);

  useEffect(()=>{
    setIsOpenNav(props.isOpenNav)
  },[props.isOpenNav])

   // CLOSE MENU
  const closeMenu = () => {
    setIsOpenNav(false);
    // Parent ki state bhi close karega
    if(props.closeNav) {
      props.closeNav();
  }};  
return(
    <>
    <button className="mobile-menu-btn" onClick={() => setIsOpenNav(true)}> ☰ </button>
    <div className={`res-nav-wrapper ${isOpenNav===true ? 'open' : 'close'}`}> 
    <div className='res-nav-overlay' onClick={closeMenu}></div>
    <nav>
    <button className="mobile-menu-close" onClick={closeMenu}> × </button>  
    <ul className='res-nav'>
    <li className='list-inline-item' onClick={closeMenu}><Link to='/'><Button>Home</Button></Link></li>
    {
      props.navData?.filter((item, idx) => idx < 6).map((item, index)=>{
        return(
          <li key={index} className='list-inline-item'>
            <Link to={`/products/category/${item?._id}`}><Button>{item.name}</Button></Link>
            {
             item?.Children?.length!== 0 && 
             <div className="submenu">
              {
               item?.Children?.map((subCat, key)=>{
                return(
                 <Link to={`/products/subCat/${subCat?._id}`} key={key} onClick={closeMenu}><Button>{subCat?.name}</Button></Link> 
                )
               })  
              }    
             </div> 
            }  
            
          </li>    
        )
      }) 
    }
  </ul>
</nav>
</div>
</>   
)}
export default Navigation;