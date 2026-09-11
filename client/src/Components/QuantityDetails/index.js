import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

const QuantiyDetails=(props)=>{
 const [qntVal, setqntVal]=useState(1); 
 
 /**useEffect(()=>{
    if(props?.selectedQuantity!==undefined && props?.selectedQuantity!==null){
      setqntVal(props?.selectedQuantity)
    }
    console.log(props?.selectedQuantity)
 }, [props?.selectedQuantity]) **/

 useEffect(()=>{
   if(props?.value!==undefined && props?.value!==null && props?.value!==""){
    setqntVal(parseInt(props?.value));
   }
 },[props.value])

  const minus=()=>{
    if(qntVal!==1 && qntVal>0){
        setqntVal(qntVal-1) 
    }
  }
  const plus=()=>{
    setqntVal(qntVal+1)
  } 

  useEffect(()=>{
     props.quantity(qntVal);
    // props.selectedItem(props.item.qntVal);
    if(props.selectedItem && props.item){
     props.selectedItem(props.item, qntVal); // ✅ PASS BOTH
    }
  },[qntVal])

  return(
    <>
    <div className="d-flex align-items-center me-3">
      <Button className="qntminus" onClick={minus}><FiMinus /></Button>
      <span><input className="qntInput" type="number" value={qntVal} onChange={(e)=>setqntVal(Number(e.target.value))} /></span>
       <Button className="qntPlus" onClick={plus}><FaPlus /></Button>  
     </div> 
    
    </> 
  )
}

export default QuantiyDetails;