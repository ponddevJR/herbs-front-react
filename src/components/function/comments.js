import axios from "axios";

export const addComment = async (data) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/addcomment`,data);
}

export const getAllComments = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getallcomments`);
}

export const updateComment = async (data) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatelikes/${data?._id}`,data,{withCredentials:true});
}

export const commentReport = async (data) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/commentreport`,data,{withCredentials:true});
}

export const updateCommentContent = async (data) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatecontent`,data,{withCredentials:true});
}

export const removeComment = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/removecomment/${id}`,{withCredentials:true});
}

export const clearReport = async (id) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/clearreport/${id}`,{withCredentials:true});
}