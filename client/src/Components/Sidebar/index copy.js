import React, { useContext, useEffect, useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import sibebarBanner1 from '../../assets/images/sidebar-banner.gif';
//import Box from '@mui/material/Box';
//import Slider from '@mui/material/Slider';
import { MyContext } from '../../App';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import Rating from '@mui/material/Rating';


const Sidebar=(props)=>{
  const [value, setValue] = useState([0, 100]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const context = useContext(MyContext);
  
   const [filterSubCat, setFilterSubCar] = React.useState('');

   const {id} = useParams();
   const [subcatId, setSubcatId] = useState('');

   const [isPriceChanged, setIsPriceChanged] = useState(false);

  useEffect(()=>{  
      setSubcatId(id);
  }, [id])

  const handleChange = (event) => {
    setFilterSubCar(event.target.value);
    props.filterData(event.target.value);
    setSubcatId(event.target.value);
  };

  useEffect(() => {
  if(subcatId){
    fetchDataFromApi(`/api/products/price-range?subcatId=${subcatId}`)
      .then((res) => {
        setPriceRange({
          min: res.minPrice,
          max: res.maxPrice
        });
        setValue([res.minPrice, res.maxPrice]);
      });
  }
}, [subcatId]);

const handlePriceChange = (event, newValue) => {
     setValue(newValue);
     setIsPriceChanged(true);
};

 useEffect(()=>{
  const delay = setTimeout(()=>{
   // if(subcatId !== ''){
    if ( subcatId && Array.isArray(value) && value[0] !== undefined && value[1] !== undefined &&
      priceRange.min !== undefined &&
      priceRange.max !== undefined
    ) {  
      props.filterByPrice(value, subcatId);
    }
  }, 500);
  return () => clearTimeout(delay);
  }, [value, subcatId]);

  const filterByRating=(rating)=>{
    props.filterByRating(rating, subcatId);
  }

   return(
    <>
     <article> 
      <div className="filterSec">
        <h3>Categories</h3>
        <div className="sidebar-scroll">
         <ul>
           <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={filterSubCat}
        onChange={handleChange}
      >
          {
            context.subCategoryData?.length > 0 && context.subCategoryData?.map((item, index)=>{
              return(
              <li key={index}><FormControlLabel value={item?.id} control={<Radio />} label={item.subCat} /></li> 
              )
            })
          }
           </RadioGroup>
         </ul>    
        </div>  
      </div>     
       <div className="filterSec">
        <h3>Filter Price</h3>
        <div className="sidebar-scroll">
        <Box sx={{ width: 290 }}>
          <Slider value={value} onChange={handlePriceChange} valueLabelDisplay="auto" min={priceRange.min} max={priceRange.max} />
        </Box>
        <div className='d-flex justify-content-between fw-bold'>
           <div>{priceRange.min}</div>
           <div>{priceRange.max}</div>  
        </div>    
        </div>  
      </div>
      <div className="filterSec">
        <h3>Filter By Ratings</h3>
        <div className="sidebar-scroll">
         <ul>
          <li onClick={()=>filterByRating(5)}><Rating name="read-only" value={5} readOnly /></li>
          <li onClick={()=>filterByRating(4)}><Rating name="read-only" value={4} readOnly /></li>
          <li onClick={()=>filterByRating(3)}><Rating name="read-only" value={3} readOnly /></li>
          <li onClick={()=>filterByRating(2)}><Rating name="read-only" value={2} readOnly /></li>
          <li onClick={()=>filterByRating(1)}><Rating name="read-only" value={1} readOnly /></li>         
         </ul>    
        </div>  
      </div>  
      {/**  <div className="filterSec">
        <h3>Brands</h3>
        <div className="sidebar-scroll">
         <ul>
          <li><FormGroup><FormControlLabel control={<Checkbox />} label="Frito Lay" /></FormGroup></li>
          <li><FormGroup><FormControlLabel control={<Checkbox />} label="Nespresso" /></FormGroup></li>
          <li><FormGroup><FormControlLabel control={<Checkbox />} label="Oreo" /></FormGroup></li>
          <li><FormGroup><FormControlLabel control={<Checkbox />} label="Quaker" /></FormGroup></li>
          <li><FormGroup><FormControlLabel control={<Checkbox />} label="Welch's" /></FormGroup></li>         
         </ul>    
        </div>  
      </div> **/} 
      <div className="filterSec">
       <img src={sibebarBanner1} alt='' className='w-100' />   
      </div>  
     </article>
    
    </>
   )
}

export default Sidebar;