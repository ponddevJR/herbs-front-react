import axios from "axios";

export const addNew = async (data) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/addnewblog`,data,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}});
}

export const getAllBlogs = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/allblogs`,{withCredentials:true});
}

export const removeBlog = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/deleteblog/${id}`,{withCredentials:true});
}

export const updateBlog = async (id,data) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updateblog/${id}`,data,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}});
}

export const updateLike = async (data) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatelikes`,data,{withCredentials:true});
}

export const reportBlog = async (data) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/addreportblog`,data,{withCredentials:true});
}