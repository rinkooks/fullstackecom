import { TfiAngleDown } from "react-icons/tfi";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { GoSearch } from "react-icons/go";
import { RiCloseLargeFill } from "react-icons/ri";
import React, { useContext, useEffect, useState } from "react";
import Slide from '@mui/material/Slide';
import { MyContext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const LocationModel=()=>{
  const context = useContext(MyContext);

  const [isModelOpen, setIsModelOpen]= useState(false);
  const [selectedTab, setSelectedTab] = useState(null);
  const [countryList, setCountryList] = useState([]);

  const selectCountry=(index, country)=>{
    setSelectedTab(index);   
    setIsModelOpen(false);
    context.setselectCountry(country);
    localStorage.setItem("location", country);
    window.location.href = window.location.href;    
  }

  useEffect(()=>{
    setCountryList(context.countryList);
  },[])

  const filterList=(e)=>{
    const keyword = e.target.value.toLowerCase();

    if(keyword !==""){
      const list = countryList.filter((item)=>{
        return item.country.toLowerCase().includes(keyword);
      })
      setCountryList(list); 
    }else{
      setCountryList(context.countryList);
    }    
  }

  return(
    <>
    <div className="locationView mr-2" onClick={()=>setIsModelOpen(true)}>
       <div><span>Your Location</span>
       <strong>
        {context.selectCountry!=="" ? context.selectCountry.length > 10 ? context.selectCountry.substr(0, 10) + "..." : context.selectCountry
    : "All"}
        </strong>
       </div>
        <TfiAngleDown />
     </div>
     <Dialog open={isModelOpen} onClose={()=>setIsModelOpen(false)} TransitionComponent={Transition}>
      <h3>Choose your Delivery Location</h3> 
      <p>Enter your address and we will specify the offer for your area.</p>
      <Button className="closeModel" onClick={()=>setIsModelOpen(false)}><RiCloseLargeFill /></Button> 
      <div className='headerSearch mt-2'>
         <input type='search' placeholder='Enter Search Product' onChange={filterList} />
         <Button><GoSearch /></Button>
      </div>
      <div className="locList mt-4">
        <ul> 
        <li><Button onClick={()=>selectCountry(0, "All")}>All</Button></li>  
        {countryList?.length!== 0  &&
              countryList.map((item, index) => (
                <li key={index}>
                  <Button className={`${selectedTab===index ? 'active' : ''}`} onClick={()=>selectCountry(index, item.country)}>{item.country}</Button>
                </li>
              ))
            }          
        </ul>
      </div>
     </Dialog>
    </>
  ) 
}
export default LocationModel;