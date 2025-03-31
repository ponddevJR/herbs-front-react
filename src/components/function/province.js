import axios from 'axios';

export const getProvince = async (province) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/province/${province}`);
}