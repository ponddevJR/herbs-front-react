import axios from "axios";

export const addNews = async (form) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/addnews`,form,{withCredentials:true},{headers:{"Content-type":"multipart/form-data"}});
}

export const getAllNews = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getallnews`);
}

export const updateViews = async (news) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updateview`,news);
}

export const getOneNews = async (id) => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getonenews/${id}`);
}

export const updateLikesOrDisLikes = async (news) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatelikeordislike`,news);
}

export const deleteNews = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/deletenews/${id}`,{withCredentials:true});
}

export const updateNews = async (form) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatenews`,form,{withCredentials:true},{headers:{"Content-type":"multipart/form-data"}});
}

export const updateViewsAndRedirect = async (item) => {
    try {
        const updateNews = {...item,views:item.views + 1};
        const update = updateViews(updateNews);
        if(!update?.data?.err)console.log(update?.data?.err);
        location.href = `/newsdetail/${item._id}`;
    } catch (error) {
        console.error(error);
        }
}