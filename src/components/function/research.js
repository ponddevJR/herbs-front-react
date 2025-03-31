import axios from "axios";

export const addResearch = async (form) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/addresearch`,form,{withCredentials:true},{headers:{"Content-type":"multipart/form-data"}})
}

export const getAllResearch = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getallresearch`);
}

export const deleteResearch = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/deleteresearch/${id}`);
}

export const updateResearch = async (id,form) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updateresearch/${id}`,form,{withCredentials:true});
}

export const updateViews = (item) => {
    try {
        const data = {...item,views:item.views+1};
        axios.put(`${import.meta.env.VITE_API_URL}/updateactionresearch`,data);

        location.href = `/researchdetail/${data._id}`;
    } catch (error) {
        console.error(error);
    }
}