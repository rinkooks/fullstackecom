import { GiClothes } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { BiSolidOffer } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";
import { Link } from "react-router-dom";
import { ImFacebook } from "react-icons/im";
import { TfiTwitterAlt } from "react-icons/tfi";
import { SiInstagram } from "react-icons/si";
import { useContext } from "react";
import { MyContext } from "../../App";

const Footer=()=>{
  const context = useContext(MyContext);
    return(
     <>
      <footer>
       <div className="lightFoot"> 
       <div className="container">
         <div className="row pt-5 border-bottom pb-4">
         <div className="col-xl-3 col-md-4 col-sm-6">
             <div className="iconBox"><span className="me-2"><GiClothes /></span><span>Everyday fresh products</span></div> 
           </div>
           <div className="col-xl-3 col-md-4 col-sm-6">
             <div className="iconBox"><span className="me-2"><TbTruckDelivery /></span><span>Free delivery for order over $70</span></div> 
           </div>
           <div className="col-xl-3 col-md-4 col-sm-6">
             <div className="iconBox"><span className="me-2"><BiSolidOffer /></span><span>Daily Mega Discounts</span></div> 
           </div>
           <div className="col-xl-3 col-md-4 col-sm-6">
             <div className="iconBox"><span className="me-2"><CiBadgeDollar /></span><span>Best price on the market</span></div> 
           </div> 
         </div> 
         <div className="row mt-5 pt-4 pb-4 row-cols-1 row-cols-lg-5 row-cols-md-4 row-cols-sm-2">
         <div className="col">
            <div className="footLinks">
              <h3>All Categories</h3>  
              <ul>
               {
                context.categoryData?.length > 0 && context.categoryData?.map((cat)=>(
                 <li key={cat._id}><Link to={`/products/category/${cat._id}`}>{cat.name}</Link></li>    
                ))
               }
             </ul>
            </div> 
           </div>
           <div className="col">
            <div className="footLinks">
            <h3>{context.categoryData[0]?.name}</h3>   
             <ul>
              {context.categoryData[0]?.Children?.slice(0, 5).map((child) => (
               <li key={child._id}>
                  <Link to={`/products/subCat/${child._id}`}>
                    {child.name}
                  </Link>
                </li>
              ))}
             </ul>
            </div> 
           </div>
           <div className="col">
            <div className="footLinks">
              <h3>{context.categoryData[1]?.name}</h3>             
              <ul>
                {context.categoryData[1]?.Children?.slice(0, 5).map((child) => (
                <li key={child._id}>
                    <Link to={`/products/subCat/${child._id}`}>
                      {child.name}
                    </Link>
                  </li>
                ))}              
              </ul>
            </div> 
           </div>
           <div className="col">
            <div className="footLinks">
            <h3>Quick Links</h3>
             <ul>
               <li><Link to="/signin">Login</Link></li>
               <li><Link to="/my-account">My Account</Link></li>
               <li><Link to="/cart">Shooping Cart</Link></li>
               <li><Link to="/my-list">WishList</Link></li>               
             </ul>
            </div> 
           </div>
           <div className="col">
            <div className="footLinks">
            <h3>Information</h3>
             <ul>
               <li><Link>About Us</Link></li>
               <li><Link>Shipping & Returns</Link></li>               
               <li><Link>Blogs</Link></li>
               <li><Link>Help</Link></li>
             </ul>
            </div> 
           </div>
         </div> 
       </div>
      </div>
      <div className="btmFoot">
       <div className="container">
         <div className="row align-items-center">
           <div className="col-6">
            <div className="copyright">Copyright 2024 © Global Technologic Theme. All rights reserved</div>
            </div>  
           <div className="col-6 d-flex justify-content-end">
             <div className="socialLinks">
                <ul>
                  <li><Link><ImFacebook /></Link></li>
                  <li><Link><TfiTwitterAlt /></Link></li>
                  <li><Link><SiInstagram /></Link></li>
                </ul>
              </div> 
            </div>  
         </div>
       </div>
      </div> 
      </footer>
     
     </>   
    )
}

export default Footer;