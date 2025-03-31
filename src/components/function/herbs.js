import axios from "axios";

export const addHerb = async (form) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/addherb`,form,{withCredentials:true});
}

export const getHerbs = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getallherb`);
}

export const deleteHerb = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/deleteherb/:${id}`,{withCredentials:true});
}

export const updateHerb = async (form) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updateherb`,form,{withCredentials:true})
}