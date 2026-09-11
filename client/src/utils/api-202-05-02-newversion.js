import axios from 'axios';
//require('dotenv/config');


export const fetchDataFromApi=async(url)=>{
    try{
        const {data} = await axios.get("http://localhost:5000" + url)
        return data;
    }catch(error){
        console.log(error);
        return error;
    }
}

//export const postData = async(url, formData) =>{
//    const { res } =  await axios.post("http://localhost:5000" + url, formData)
//    return res;
//}
export const postData = async (url, formData) => {
  try {
   // const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
   const response = await fetch("http://localhost:5000" + url, {
      method:'POST',
      header:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    });

    if(response.ok){
      const data = await response.json();
      return data
    }else{
      const errorData = await response.json();
      return errorData
    }

  } catch (error) {
    console.log("POST ERROR:", error);
    throw error;   // so caller can catch
  }
};  

//export const editData = async(url, updatedata)=>{
//    const {res} = await axios.put(`http://localhost:5000${url}`, updatedata)
//    return res;
//}
export const editData = async (url, updateData) => {
  try {
    const response = await axios.put("http://localhost:5000" + url, updateData);
    return response.data;
  } catch (error) {
    console.log("PUT ERROR:", error);
    throw error;
  }
};


//export const deleteData = async(url) =>{
//    const {res} = await axios.delete(`http://localhost:5000${url}`)
//    return res
//}
export const deleteData = async (url) => {
  try {
    const response = await axios.delete("http://localhost:5000" + url);
    return response.data;
  } catch (error) {
    console.log("DELETE ERROR:", error);
    throw error;
  }
};
