import axios from 'axios';
//require('dotenv/config');

export const fetchDataFromApi=async(url)=>{
    try{
        const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}` + url)
        return data;
    }catch(error){
        console.log(error);
        return error;
    }
}

export const postData = async (url, formData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}${url}` + url, formData);
    return response.data;
  } catch (error) {
    console.log("POST ERROR:", error);
    throw error;   // so caller can catch
  }
};  

export const editData = async (url, updateData) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_BASE_URL}` + url, updateData);
    return response.data;
  } catch (error) {
    console.log("PUT ERROR:", error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.log("DELETE ERROR:", error);
    throw error;
  }
};

export const deleteImages = async(url, image) => {
  const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`, image);
  return res;
} 
