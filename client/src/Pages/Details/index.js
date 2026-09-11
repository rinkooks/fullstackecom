import { Link, useParams } from "react-router-dom";
import Rating from '@mui/material/Rating';
import ProductZoom from "../../Components/ProductZoom";
import QuantiyDetails from "../../Components/QuantityDetails";
import { MdOutlineCompareArrows } from "react-icons/md";
import Button from '@mui/material/Button';
import SocialIcons from "../../Components/SocialIcons";
import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import RelatedProducts from "../../Components/RelatedProducts";
import { useEffect } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useContext } from "react";
import { MyContext } from "../../App";
import { BsCartFill } from "react-icons/bs";
import { CircularProgress } from "@mui/material";
import { FaHeart } from "react-icons/fa6";
import { LuHeart } from "react-icons/lu";

const Details=()=>{
   const [activeSize, setactiveSize] = useState(null);
   const [activeTab, setactiveTab]= useState(1);

   const [productData, setProductData] = useState([]);
   const [ralatedProductData, setRalatedProductData] = useState([]); 
   const [recentlyViewdProducts, setRecentlyViewdProducts] = useState([]);

   let [cartFields, setCartFields] = useState({});
   const [productQuantity, setProductQuantity] = useState(1);
   const [tabError, setTabError] = useState(false);
   const [isLoading, setIsLoading] = useState(false);   

   const [reviewsData, setReviewsData] = useState([]);
  const [isAddedToMyList, setIsAddedToMyList] = useState(false);

   const {id} = useParams();

   const context = useContext(MyContext);

   useEffect(()=>{
      window.scrollTo(0,0);
      setactiveSize(null);
      fetchDataFromApi(`/api/products/${id}`).then((res)=>{
       setProductData(res);
      
       fetchDataFromApi(`/api/products?subcatId=${res?.subcatId}`)
       .then((res)=>{
        const filterData = res?.productList?.filter(item => item.id !== id);
        setRalatedProductData(filterData)       
       });       
        fetchDataFromApi(`/api/products/recentlyViewd`).then((response)=>{
          setRecentlyViewdProducts(response);
        });       
       // postData(`/api/products/recentlyViewd`, res);  
       postData(`/api/products/recentlyViewd`, {prodId: res.id, ...res }); 
       
     }); 
     
     if(productData?.productRam=== undefined && productData?.productSize=== undefined && 
      productData?.productWeight=== undefined){
       setactiveSize(1);
      };
     fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res)=>{
      if(Array.isArray(res)){
          setReviewsData(res);
      }else{
          setReviewsData([]);
      }
    })

     const user = JSON.parse(localStorage.getItem("user"));  
      fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
        if(res.length!==0){
            setIsAddedToMyList(true);
        }      
      }); 

   },[id]);
   
   const isActive=(index)=>{
      setactiveSize(index)
      setTabError(false);
   }
  const quantity=(val)=>{
    setProductQuantity(val);
  } 

  const addtoCart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please login first"
    });
    return;
  }
  if (!productQuantity || productQuantity <= 0) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please select quantity"
    });
    return;
  }

  if(activeSize !==null){
   const newCartItem = {
      productTitle: productData?.name,
      image: productData?.images?.[0],
      rating: productData?.rating,
      price: productData?.price,
      quantity: productQuantity,
      subTotal: parseInt(productData?.price * productQuantity),
      productId: productData?.id,
      userId: user?.userId
    };    
    context.addToCart(newCartItem);
  }else{
    setTabError(true);
  }  
};
const selectedItem=()=>{
}

const [rating, setRating] = useState(1);
const [reviews, setReviews] = useState({
    productId:'',
    customerName:'',
    customerId:'',
    review:'',
    customerRating:1
});

const onChangeInput=(e)=>{
  setReviews(()=>({
    ...reviews,
    [e.target.name]:e.target.value
  })
)}
const changeRating = (event, newValue) => {
   setRating(newValue);
   setReviews((prev)=>({
    ...prev,
    customerRating:newValue
   }));
}

const addReview=(e)=>{
   e.preventDefault();
   
   const user = JSON.parse(localStorage.getItem("user"));

   reviews.customerName=user?.name; 
   reviews.customerId=user?.userId;
   reviews.productId=id
  
  /*const reviewData = { productId: id, customerName: user?.name, customerId: user?.userId, review: reviews.review,
    customerRating: rating }; */
  
  if (!reviews.review || reviews.review.trim() === "") {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please write a review"
    });
    return;
  }
  if (!rating || rating <= 0) {
   context.setAlertBox({
      open: true,
      error: true,
      msg: "Please select rating"
   });
   return;
}
   
   setIsLoading(true);
   postData('/api/productReviews/add', reviews).then((res)=>{
   setIsLoading(false);
 
    // reviews.customerRating=1
     setReviews({
      productId: '',
      customerName: '',
      customerId: '',
      review: '',
      customerRating: 1
    });
    setRating(1);  
     fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res)=>{
      if(Array.isArray(res)){
          setReviewsData(res);
      }else{
          setReviewsData([]);
      }
    })
    
   })
}

const addToMyList = (id) => {
const user = JSON.parse(localStorage.getItem("user"));

if(user!== undefined && user!== null && user!== ""){
  const data = {
    productTitle: productData?.name,
    image: productData?.images[0],
    rating: productData?.rating,
    price: productData?.price,
    productId: id,
    userId: user?.userId
  };
  postData(`/api/my-list/add`, data).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "The product added in my list"
      });
      const user = JSON.parse(localStorage.getItem("user"));  
      fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
        if(res.length!==0){
            setIsAddedToMyList(true);
        }      
      }); 
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Product already added in My List"
        });
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Something went wrong"
        });
      }
      console.log(error);
    });
  }else{
  context.setAlertBox({
    open: true,
    error: true,
    msg: "Please Login to Continue"
  });
}
}; 
return(
  <>
  <div className="details lightBg pt-5 pb-4">
  <section className="">
    <div className="container">
    <div className="row">
      <div className="breadcumb d-flex">
        <ul>
          <li><Link>Home</Link></li>
          <li><Link>Product</Link></li>
          <li>Product Name</li>     
        </ul> 
      </div>
    </div>
    <div className="content-bg">
      <div className="row">
        <div className="col-md-5 text-center">
          <ProductZoom images={productData?.images} discount={productData?.discount} />  
        </div>
        <div className="col-md-7">
        <div className='mb-3'><h3>{productData?.name}</h3></div>   
        <div className='d-flex align-items-center border-bottom pb-4 mb-4'>
          <div className='proBrand me-4'><span className='me-2'>Brands</span><span>{productData?.brand}</span></div>
          <div className='proRating me-4 d-flex align-items-center'>
            <span className='me-2'><Rating name="size-small" value={parseInt(productData?.rating)} size="small" readOnly  /></span><span>1 review</span></div>
          <div className='proSku'><span className='me-1'>SKU:</span><span>Welch's</span></div>
        </div>
        <div className="priceView mb-3">
              <span className="oldPrice">{productData?.oldprice}</span>
                <span className="newPrice">{productData?.price}</span>
            </div>
            <p className="stockAvbl mb-4"><span>In Stock</span></p>
            <p>{productData?.description}</p>

            {productData?.productRam?.length > 0 &&
            <div className="activeSize d-flex align-items-center mt-4">
                <span>Product Rams</span>
                <ul className={`list list-inline mb-0 px-4 ${tabError === true && 'error'}`}>
                {
                  productData?.productRam?.length > 0 && 
                  productData?.productRam?.map((ram,index)=>{
                    return(                         
                      <li key={index} className="list-inline-item">
                        <Link className={`tag ${activeSize === index ? 'active' :''}`} onClick={()=>isActive(index)}>{ram}</Link></li>
                      
                    )
                  })
                }
                </ul>
            </div>
            }
            {productData?.productSize?.length > 0 &&
            <div className="activeSize d-flex align-items-center mt-4">
                <span>Product Size:</span>
                <ul className={`list list-inline mb-0 px-4 ${tabError === true && 'error'}`}>
                {
                  productData?.productSize?.length > 0 && 
                  productData?.productSize?.map((size,index)=>{
                    return(                         
                      <li key={index} className="list-inline-item">
                        <Link className={`tag ${activeSize === index ? 'active' :''}`} onClick={()=>isActive(index)}>{size}</Link></li>
                      
                    )
                  })
                }
                </ul>
            </div>
            }
            {productData?.productWeight?.length > 0 &&
            <div className="activeSize d-flex align-items-center mt-4">
                <span>Product Weight:</span>
                <ul className={`list list-inline mb-0 px-4 ${tabError === true && 'error'}`}>
                {
                  productData?.productWeight?.length > 0 && 
                  productData?.productWeight?.map((weight,index)=>{
                    return(                         
                      <li key={index} className="list-inline-item">
                        <Link className={`tag ${activeSize === index ? 'active' :''}`} onClick={()=>isActive(index)}>{weight}</Link></li>
                    )
                  })
                }
                </ul>
            </div>
            }
            <div className="d-flex align-items-center mt-4">
              <QuantiyDetails quantity={quantity} selectedItem={selectedItem} />
              <Button className="addtocart blue-btn" onClick={()=>addtoCart()}><BsCartFill />&nbsp;
                {
                context.addingInCart===true  ? "adding..." : "Add to Cart"
                }
              </Button>
            </div>
            <div className="d-flex align-items-center mt-4">
            <Tooltip title={`${isAddedToMyList === true ? 'Added to Wishlist' : 'Add to Wishlist'}`} placement="top">
              <Button variant="text" className={`me-3 bdr-btn btn-circle ${isAddedToMyList === true && 'active'}`} 
              onClick={()=>addToMyList(id)}>
                {
                isAddedToMyList === true ? <FaHeart style={{fontSize:'20px', color:'red'}} />
                :
                <LuHeart style={{fontSize:'20px'}} />
                }   
              </Button></Tooltip>
              <Tooltip title="Compare" placement="top">
              <Button variant="text" className="bdr-btn btn-round"><MdOutlineCompareArrows /> </Button></Tooltip>
            </div>
            <div className="border-top mt-4 pt-4">
              <SocialIcons />
            </div>
        </div>   
      </div> 
    </div>
    <div className="content-bg mt-5">
      <div className="tab">
        <div className="tabList">
          <ul>
            <li><Button className={`${activeTab === 1 ? 'active': ''}`} onClick={()=>setactiveTab(1)}>Description</Button></li>
            <li><Button className={`${activeTab === 2 ? 'active': ''}`} onClick={()=>setactiveTab(2)}>Additional info</Button></li>
            <li><Button className={`${activeTab === 3 ? 'active': ''}`} onClick={()=>setactiveTab(3)}>Vendor</Button></li> 
            <li><Button className={`${activeTab === 4 ? 'active': ''}`} onClick={()=>setactiveTab(4)}>Reviews (3)</Button></li>   
          </ul> 
        </div>
        {
          activeTab === 1 && 
          <div className="tabContent">
          <p>{productData?.description}</p>
          <p>Spluttered narrowly yikes left moth in yikes bowed this that grizzly much hello on spoon-fed that alas rethought much decently richly and wow against the frequent fluidly at formidable acceptably flapped besides and much circa far over the bucolically hey precarious goldfinch mastodon goodness gnashed a jellyfish and one however because.</p>
          <ul className="product-more-infor mt-30">
              <li><span>Type Of Packing</span> Bottle</li>
              <li><span>Color</span> Green, Pink, Powder Blue, Purple</li>
              <li><span>Quantity Per Case</span> 100ml</li>
              <li><span>Ethyl Alcohol</span> 70%</li>
              <li><span>Piece In One</span> Carton</li>
          </ul>
          <hr className="wp-block-separator is-style-dots"></hr>
          <p>Laconic overheard dear woodchuck wow this outrageously taut beaver hey hello far meadowlark imitatively egregiously hugged that yikes minimally unanimous pouted flirtatiously as beaver beheld above forward energetic across this jeepers beneficently cockily less a the raucously that magic upheld far so the this where crud then below after jeez enchanting drunkenly more much wow callously irrespective limpet.</p>

          <h4 className="mt-30">Packaging &amp; Delivery</h4>
          <p>Less lion goodness that euphemistically robin expeditiously bluebird smugly scratched far while thus cackled sheepishly rigid after due one assenting regarding censorious while occasional or this more crane went more as this less much amid overhung anathematic because much held one exuberantly sheep goodness so where rat wry well concomitantly.</p>
          <p>Scallop or far crud plain remarkably far by thus far iguana lewd precociously and and less rattlesnake contrary caustic wow this near alas and next and pled the yikes articulate about as less cackled dalmatian in much less well jeering for the thanks blindly sentimental whimpered less across objectively fanciful grimaced wildly some wow and rose jeepers outgrew lugubrious luridly irrationally attractively dachshund.</p>
        </div>
        }
        {
          activeTab === 2 && 
          <div className="tabContent">
          <table className="font-md">
            <tbody>
                <tr className="stand-up">
                    <th>Stand Up</th>
                    <td>
                        <p>35″L x 24″W x 37-45″H(front to back wheel)</p>
                    </td>
                </tr>
                <tr className="folded-wo-wheels">
                    <th>Folded (w/o wheels)</th>
                    <td>
                        <p>32.5″L x 18.5″W x 16.5″H</p>
                    </td>
                </tr>
                <tr className="folded-w-wheels">
                    <th>Folded (w/ wheels)</th>
                    <td>
                        <p>32.5″L x 24″W x 18.5″H</p>
                    </td>
                </tr>
                <tr className="door-pass-through">
                    <th>Door Pass Through</th>
                    <td>
                        <p>24</p>
                    </td>
                </tr>
                <tr className="frame">
                    <th>Frame</th>
                    <td>
                        <p>Aluminum</p>
                    </td>
                </tr>
                <tr className="weight-wo-wheels">
                    <th>Weight (w/o wheels)</th>
                    <td>
                        <p>20 LBS</p>
                    </td>
                </tr>
                <tr className="weight-capacity">
                    <th>Weight Capacity</th>
                    <td>
                        <p>60 LBS</p>
                    </td>
                </tr>
                <tr className="width">
                    <th>Width</th>
                    <td>
                        <p>24″</p>
                    </td>
                </tr>
                <tr className="handle-height-ground-to-handle">
                    <th>Handle height (ground to handle)</th>
                    <td>
                        <p>37-45″</p>
                    </td>
                </tr>
                <tr className="wheels">
                    <th>Wheels</th>
                    <td>
                        <p>12″ air / wide track slick tread</p>
                    </td>
                </tr>
                <tr className="seat-back-height">
                    <th>Seat back height</th>
                    <td>
                        <p>21.5″</p>
                    </td>
                </tr>
                <tr className="head-room-inside-canopy">
                    <th>Head room (inside canopy)</th>
                    <td>
                        <p>25″</p>
                    </td>
                </tr>
                <tr className="pa_color">
                    <th>Color</th>
                    <td>
                        <p>Black, Blue, Red, White</p>
                    </td>
                </tr>
                <tr className="pa_size">
                    <th>Size</th>
                    <td>
                        <p>M, S</p>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
        }
        {
          activeTab === 3 && 
          <div className="tabContent">
          <p>Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at nulla. Morbi elit ex, viverra vitae ante vel, blandit feugiat ligula. Fusce fermentum iaculis nibh, at sodales leo maximus a. Nullam ultricies sodales nunc, in pellentesque lorem mattis quis. Cras imperdiet est in nunc tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt. Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.</p>
          <p>Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra. Maecenas lacus odio, feugiat eu nunc sit amet, maximus sagittis dolor. Vivamus nisi sapien, elementum sit amet eros sit amet, ultricies cursus ipsum. Sed consequat luctus ligula. Curabitur laoreet rhoncus blandit. Aenean vel diam ut arcu pharetra dignissim ut sed leo. Vivamus faucibus, ipsum in vestibulum vulputate, lorem orci convallis quam, sit amet consequat nulla felis pharetra lacus. Duis semper erat mauris, sed egestas purus commodo vel.</p>
        </div>
        }
        {
          activeTab === 4 && 
          <div className="tabContent">
            <div className="row">
            <div className="col-md-8">
              <h3>Customer question & answers</h3><br/>
              {
              Array.isArray(reviewsData) && reviewsData.length > 0 && 
                reviewsData?.slice(0).reverse()?.map((item,index)=>{
                return(
                <div className="card p-4 reviewCard flex-row shadow mb-4" key={index}>                    
                <div className="info">
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <h5>{item?.customerName}</h5> 
                    <div className="ml-auto">
                      <Rating name="half-rating-read" value={item?.customerRating} readOnly size="small" />
                    </div> 
                  </div> 
                <h6>{item?.dateCreated}</h6>  
                  <p>{item?.review}</p>
                </div>
              </div>
              )
              })                                               
                }
              <br className="res-hide" />  
              <form className="reviewForm mt-4" onSubmit={addReview}>
                <h4>Add & reviews</h4>   
                <div className="form-group mb-4">
                  <textarea className="form-control p-3 shadow" placeholder="write a review" name="review"
                  value={reviews.review} onChange={onChangeInput}></textarea> 
                </div>
                <div className="row">
                  {/*<div className="col-md-6">
                    <div className="form-group mb-4"> 
                        <input type="text" className="form-control p-3 shadow" placeholder="name" name="customerName" 
                        onChange={onChangeInput} />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group mb-4"> 
                      <Rating name="rating" value={rating} precision={0.5} onChange={changeRating} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <Button type="submit" className="blue-btn btn-lg btn-big btn-round">
                    {
                    isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'Submit Review' 

                    }
                    </Button> 
                  </div>  
                </form> 
            </div>
          </div>
        </div>
        }
          

      </div>
    </div>
    <div className="content-bg mt-5">
      {
        ralatedProductData?.length !== 0 && <RelatedProducts title="Related Products" data={ralatedProductData} />
      }
    </div>
    {
      recentlyViewdProducts?.length !== 0 &&
      <div className="content-bg mt-5">
        <RelatedProducts title="Recent View Products" itemView={"recentlyView"} data={recentlyViewdProducts} />
      </div>
    }
    </div>
  </section>
  </div>
  </>  
)
}
export default Details;