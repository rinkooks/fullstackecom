import React, { useContext, useEffect, useState } from "react";
import sibebarBanner1 from "../../assets/images/sidebar-banner.gif";
import { MyContext } from "../../App";
import { useParams, useLocation } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Rating from "@mui/material/Rating";

const Sidebar = (props) => {
  const context = useContext(MyContext);
  const { id } = useParams();
  const location = useLocation();

  const { pageId, isCategoryPage, priceRangeData } = props;

  const [filterSubCat, setFilterSubCat] = useState("");
  const [subcatId, setSubcatId] = useState("");

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 100,
  });

  const [value, setValue] = useState([0, 100]);
  const [isPriceChanged, setIsPriceChanged] = useState(false);

// find current category child  
/*const currentCategory = context.categoryData.find(
    item => item._id === pageId
);
const subCategories = currentCategory?.Children || []; */

const isSubCatPage = location.pathname.includes("subCat");
const currentCategory = isSubCatPage ? context.categoryData?.find(category =>
      category.Children?.some(child => child._id === pageId)
    )
  : context.categoryData?.find(category => category._id === pageId);
const subCategories = currentCategory?.Children || [];


  // route change par reset
  useEffect(() => {
    setSubcatId(id);
    if (isSubCatPage) {
      setFilterSubCat(id);
    } else {
       setFilterSubCat("");
    }    
  }, [id, isSubCatPage]);

  // search page data
  useEffect(() => {
  if (priceRangeData) {
    setPriceRange(priceRangeData);
    setValue([
      priceRangeData.min,
      priceRangeData.max
    ]);
  }
}, [priceRangeData]);

//  Auto Price Load
const loadPriceRange = (filterId, isSub = false) => {
  let url = "";
  if (isSub) {
    url = `/api/products/price-range?subcatId=${filterId}`;
  } else {
    url = `/api/products/price-range?categoryId=${filterId}`;
  }
  fetchDataFromApi(url).then((res) => {
    const min = res?.minPrice ?? 0;
    const max = res?.maxPrice ?? 0;
    setPriceRange({
      min,
      max,
    });
    setValue([min, max]);
    setIsPriceChanged(false);
  });
};

  // category page open hote hi auto price
  useEffect(() => {
    if (priceRangeData) return; /// search page
    if (pageId) {
      loadPriceRange(pageId, !isCategoryPage);
    }
  }, [pageId, isCategoryPage]);

  // --------------------------
  // Subcategory Click
  // --------------------------
  const handleChange = (event) => {
    const selectedId = event.target.value;

    setFilterSubCat(selectedId);
    setSubcatId(selectedId);

    props.filterData(selectedId);

    // auto subcat price range
    loadPriceRange(selectedId, true);
  };

  // --------------------------
  // Slider Change
  // --------------------------
  const handlePriceChange = (event, newValue) => {
    setValue(newValue);
    setIsPriceChanged(true);
  };

  useEffect(() => {
    if (!isPriceChanged) return;

    const delay = setTimeout(() => {
      const filterId = subcatId || pageId;

      props.filterByPrice(value, filterId);
    }, 500);

    return () => clearTimeout(delay);
  }, [value, id]);

  // --------------------------
  // Rating Filter
  // --------------------------
  const filterByRating = (rating) => {
    const filterId = subcatId || pageId;
    props.filterByRating(rating, filterId);
  };

return (
<>
<article>
  {/* Categories */}
  <div className="filterSec">
    <h3>Categories</h3>
    <div className="sidebar-scroll">
    <RadioGroup value={filterSubCat} onChange={handleChange}>
     {subCategories.map((item) => (
      <FormControlLabel  key={item._id} value={item._id} control={<Radio />} label={item.name} />
    ))}
  </RadioGroup>
    {/* <RadioGroup  value={filterSubCat} onChange={handleChange} >
      {context.subCategoryData?.length > 0 &&
        context.subCategoryData.map((item, index) => {
          return (
            <li key={index}>
              <FormControlLabel value={item?.id} control={<Radio />} label={item.subCat} />
            </li>
          );
        })}
    </RadioGroup> */}        
 </div> 
</div>
{/* Price */}
<div className="filterSec">
  <h3>Filter Price</h3>

  <div className="sidebar-scroll">
    <Box sx={{ width: 290 }}>
      <Slider
        value={value}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={priceRange.min}
        max={priceRange.max}
      />
    </Box>

    <div className="d-flex justify-content-between fw-bold">
      <div>{priceRange.min}</div>
      <div>{priceRange.max}</div>
    </div>
  </div>
</div>

{/* Rating */}
<div className="filterSec">
  <h3>Filter By Ratings</h3>

  <div className="sidebar-scroll">
    <ul>
      <li onClick={() => filterByRating(5)}>
        <Rating value={5} readOnly />
      </li>

      <li onClick={() => filterByRating(4)}>
        <Rating value={4} readOnly />
      </li>

      <li onClick={() => filterByRating(3)}>
        <Rating value={3} readOnly />
      </li>

      <li onClick={() => filterByRating(2)}>
        <Rating value={2} readOnly />
      </li>

      <li onClick={() => filterByRating(1)}>
        <Rating value={1} readOnly />
      </li>
    </ul>
  </div>
</div>

    {/* Banner */}
    <div className="filterSec">
      <img src={sibebarBanner1} alt="" className="w-100" />
    </div>
  </article>
</>
);
};
export default Sidebar;