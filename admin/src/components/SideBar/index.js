import { Link, useNavigate } from "react-router-dom";
import React from 'react';

import Button from '@mui/material/Button';
import { TfiAngleDown } from "react-icons/tfi";
import { MdDashboard } from "react-icons/md";
import { FaClipboardCheck, FaProductHunt, FaRegEnvelopeOpen } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useState } from "react";
import { useEffect } from "react";

const SideBarNav = () =>{

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubMenu, setIsToggleSubMenu] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const isOpenSubmenu = (index)=>{
      setActiveTab(index);
      setIsToggleSubMenu(!isToggleSubMenu)
    }

    const history = useNavigate();

    useEffect(()=>{
      const token = localStorage.getItem("token");
      if(token!=="" && token!==undefined && token!==null){
        setIsLogin(true);
      }
      else{
        history("/login");
      }
    },[])

    return(
     <>     
      <div className='comp-logo'><Link to='/'><img src="/logo-new.png" alt="Logo" /></Link></div>
      <nav className="menu">
       <ul>
        <li><Link to='/' className="active">
        <Button className={`w100 ${activeTab === 0 && isToggleSubMenu === true ? 'active' : ''}`} 
        onClick={()=>isOpenSubmenu(0)}><span><MdDashboard /> Dashboard</span> </Button></Link></li>
        <li><Link><Button className={`w100 ${activeTab === 1 && isToggleSubMenu === true ? 'active' : ''}`} 
        onClick={()=>isOpenSubmenu(1)}><span><MdCategory /> Category</span> <TfiAngleDown /></Button></Link>
           <ul className={`submenu ${activeTab === 1 && isToggleSubMenu === true ? 'colapse': 'colapsed'}`}>
             <li><Link to="/category/add"><Button className="w100">Add Category</Button></Link></li>
             <li><Link to="/category"><Button className="w100">Category List</Button></Link></li>
             <li><Link to="/subCategory"><Button className="w100">Sub Category</Button></Link></li>
             <li><Link to="/subCategory/add"><Button className="w100">Add Sub Category</Button></Link></li>
           </ul>
        </li>
        <li><Link><Button className={`w100 ${activeTab === 2 && isToggleSubMenu === true ? 'active' : ''}`} 
        onClick={()=>isOpenSubmenu(2)}><span><FaProductHunt />Products</span> <TfiAngleDown /></Button></Link>
           <ul className={`submenu ${activeTab === 2 && isToggleSubMenu === true ? 'colapse': 'colapsed'}`}>
             <li><Link to="/product/add"><Button className="w100">Add Product</Button></Link></li>
             <li><Link to="/products"><Button className="w100">Product List</Button></Link></li>
             <li><Link to="/productRams/add"><Button className="w100">Add Product Rams</Button></Link></li>             
             <li><Link to="/productSize/add"><Button className="w100">Add Product Size</Button></Link></li>            
             <li><Link to="/productWeight/add"><Button className="w100">Add Product Weight</Button></Link></li>            
           </ul>
        </li>
        <li><Link to="/orders"><Button className={`w100 ${activeTab === 4 && isToggleSubMenu === true ? 'active' : ''}`} 
        onClick={()=>isOpenSubmenu(4)}><span><FaClipboardCheck /> Orders</span> </Button></Link></li>
        <li><Link><Button className={`w100 ${activeTab === 5 && isToggleSubMenu === true ? 'active' : ''}`} 
        onClick={()=>isOpenSubmenu(4)}><span><MdCategory /> Home Banner</span> <TfiAngleDown /></Button></Link>
           <ul className={`submenu ${activeTab === 4 && isToggleSubMenu === true ? 'colapse': 'colapsed'}`}>
             <li><Link to="/homeBannerSlide/add"><Button className="w100">Add Home Banner Slides</Button></Link></li>
             <li><Link to="/homeBannerSlide/list"><Button className="w100">Home Slides List</Button></Link></li>
           </ul>
        </li>
        <li><Link to='/newsletter'>
        <Button className={`w100 ${activeTab === 6 && isToggleSubMenu === true ? 'active' : ''}`} 
        onClick={()=>isOpenSubmenu(0)}><span><FaRegEnvelopeOpen /> Newsletter</span> </Button></Link></li>        
        </ul> 
      </nav>
     
     </>   
    )
}

export default SideBarNav;