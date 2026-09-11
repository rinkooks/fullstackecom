import { SlMenu } from "react-icons/sl";
import Button from '@mui/material/Button';
import { TfiAngleDown } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { useState } from "react";


const AllCategories=(props)=>{

const [isOpenList, setIsOpenList] = useState(false)

    return(
      <>
      <div className='allCatView'> 
        <div className='allCat'>
            <Button className='allcat' onClick={()=>setIsOpenList(!isOpenList)}><SlMenu className='me-2' /> <span>All Categories</span> 
            <TfiAngleDown className='ms-2 dwnArw' /></Button></div>
            {
            isOpenList && 
             <div className='catList'>
            <ul>
            {  
            props.navData?.filter((item, idx) => idx < 6).map((item, index)=>{
              return(
                <li key={index} className='list-inline-item' onClick={props.closeNav}>
                  <Link to={`/products/category/${item?._id}`}><Button>{item.name}</Button></Link>
                  {
                    item?.Children?.length!== 0 && 
                    <div className="catSubNav">
                    {
                      item?.Children?.map((subCat, key)=>{
                      return(
                        <Link to={`/products/subCat/${subCat?._id}`} key={key}><Button>{subCat?.name}</Button></Link> 
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
            </div>
          }
            {/*
             isOpenList &&  
             <div className='catList'>
            <ul>
            <li><Link><Button>Men</Button></Link>
            <div className='catSubNav'>
              <ul>
                  <li><Link><Button>Clothing</Button></Link></li>                    
                  <li><Link><Button>Footwear</Button></Link></li>  
                  <li><Link><Button>Watches</Button></Link></li>  
                  <li><Link><Button>Accessories</Button></Link></li>  
                  <li><Link><Button>Jewellery</Button></Link></li>  
                  <li><Link><Button>Grooming for Men </Button></Link></li> 
              </ul>
             </div>
            </li>  
            <li><Link><Button>Women</Button></Link>
            <div className='catSubNav'>
              <ul>
                  <li><Link><Button>Indianwear</Button></Link></li>                    
                  <li><Link><Button>Lingerie & Nightwear</Button></Link></li>  
                  <li><Link><Button>Lingerie & Nightwear</Button></Link></li>  
                  <li><Link><Button>Lingerie & Nightwear</Button></Link></li>  
                  <li><Link><Button>Sunglasses & Frames</Button></Link></li>  
                  <li><Link><Button>Sunglasses & Frames</Button></Link></li> 
              </ul>
             </div>
            </li>  
            <li><Link><Button>Kids</Button></Link>
            <div className='catSubNav'>
              <ul>
                  <li><Link><Button>Boys</Button></Link></li>  
                  <li><Link><Button>Girls</Button></Link></li>  
                  <li><Link><Button>Infants</Button></Link></li>  
                  <li><Link><Button>Footwear</Button></Link></li>  
                  <li><Link><Button>Watches</Button></Link></li>  
                  <li><Link><Button>Accessories</Button></Link></li>  
              </ul>
              </div>
            </li>  
            <li><Link><Button>Beauty</Button></Link></li>  
            <li><Link><Button>Watches</Button></Link></li>  
            <li><Link><Button>Gifts</Button></Link></li>  
            <li><Link><Button>Contact</Button></Link></li>  
            </ul>
            </div>
             */ 
            }
            
       </div>
      </>  
    )
}


export default AllCategories;