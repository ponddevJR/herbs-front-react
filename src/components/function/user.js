import axios from "axios";
axios.defaults.withCredentials = true; // ตั้งค่า axios ให้ส่ง cookie อัตโนมัติ

export const checkUserRepeat = async (username) => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/checkusername/${username}`);
}

export const register = async (form) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/register`,form);
}

export const login = async (form) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/login`,form);
}

export const getSingle = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/getone`,{},{withCredentials:true});
        return res.data.user;
    } catch (error) {
        return false;
    }
}

export const logout = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/logout`,{withCredentials:true});
}

export const updateData = async (form) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/update`,form,{withCredentials:true});
}

export const updateEmail = async (value) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/update/email`,value,{withCredentials:true});
}

export const checkPassword = async (value) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/checkauth`,value,{withCredentials:true});
}

export const updatePassword = async (value) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatepass`,value,{withCredentials:true});
}

export const  checckAuthNoLogin = async (value) => {
    return await axios.post(`${import.meta.env.VITE_API_URL}/checkemail`,value);
}

export const updatePassNoAuth = async (value) => {
    return await axios.put(`${import.meta.env.VITE_API_URL}/updatepass/noauth`,value,{withCredentials:true});
}

export const getAll = async () => {
    return await axios.get(`${import.meta.env.VITE_API_URL}/getall`);
}

export const deleteUser = async (id) => {
    return await axios.delete(`${import.meta.env.VITE_API_URL}/deluser/${id}`);
}