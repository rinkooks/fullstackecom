import { Button, CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { GoSearch } from "react-icons/go";
import { fetchDataFromApi } from "../../../utils/api";
import { MyContext } from "../../../App";
import { useNavigate } from "react-router-dom";

const SearchBox =()=>{
const [searchFields, setSearchFields] = useState('');
const context = useContext(MyContext);
const history = useNavigate();

const [isLoading, setIsLoading] = useState(false);

const onChangeValue=(e)=>{
    setSearchFields(e.target.value)
}

const searchProducts=()=>{
    if(searchFields.trim() === ''){
        return;
    }
    setIsLoading(true);
    fetchDataFromApi(`/api/search?q=${searchFields}`).then((res)=>{
      context.setSearchData(res);
      setTimeout(()=>{
        setIsLoading(false);
      }, 2000)
      history('/search');
      
    })
}

return(
<div className='headerSearch'>
    <input type='search' placeholder='Enter Search Product' onChange={onChangeValue} onKeyDown={(e) => {if (e.key === 'Enter') {
      searchProducts(); } }} />
    <Button onClick={searchProducts}> 
        {
           isLoading === true ?  <CircularProgress /> : <GoSearch />
        }
     </Button>
    </div>
)
}

export default SearchBox;