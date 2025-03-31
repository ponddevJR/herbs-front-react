import axios from "axios";

export const addCategory = async (form) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/newcategory`,form,{withCredentials:true});
}

export const getAllCategories = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getallctg`);
}

export const updateCtg = async (form) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatectg`,form,{withCredentials:true});
}

export const deleteCtg = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/deletectg/${id}`,{withCredentials:true});
}