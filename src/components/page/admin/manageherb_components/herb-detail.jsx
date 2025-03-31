import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { getAllCategories } from '../../../function/category';

const HerbDetail = ({onclose,data}) => {

    const [categories,setCategories] = useState("");
    const [preview,setPreview] = useState(data?.imgs[0])

    useEffect(() => {
        getAllCategories().then((res) => {
            if(!res?.data?.categories)return;
            const ctgs = res?.data?.categories;
            const filter = ctgs.filter((item) => data.categories.includes(item._id)).map((item) => item.ctg_name).join(", ")    
            setCategories(filter)        
        })
    },[]);

  return (
    <div style={{paddingTop:"2rem"}} className='absolute top-0 left-0 w-full h-full bg-white z-50 flex flex-col gap-8 items-center overflow-auto'>
        <button onClick={onclose} className='fixed top-3 right-5 text-xl rounded-full hover:bg-red-600 hover:text-white' style={{padding:"0.35rem"}}>
            <FaTimes/>
        </button>
        <div className="w-[60%] flex flex-col gap-4">
            <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full border-b-4 border-green-700 text-2xl font-bold'>
                {data?.name_th}
            </label>
            <label htmlFor="" className='text-gray-800 '>
                ชื่อทางวิทยาศาตร์ : {data?.name_science}
            </label>
            <label htmlFor="" className='text-gray-800 '>
                ชื่อสามัญ : {data?.name_normal}
            </label>
            <label htmlFor="" className='text-gray-800 '>
                จัดอยู่ในหมวดหมู่ : {categories}
            </label>
        </div>
        <div className="w-[60%] flex flex-col items-center gap-4">
            <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full border-b-4 border-green-700 text-2xl font-bold'>
                รูปภาพ
            </label>
            <div className="w-[75%] h-[60vh] border">
                <img src={preview.startsWith("i") ? import.meta.env.VITE_API_URL+preview : preview} className='w-full h-full object-cover' alt="" />
            </div>
            <div className="w-full relative overflow-auto h-[25vh]">
                <div style={{padding:"0.3rem"}} className="absolute top-0 left-0 flex gap-3 w-auto h-full">
                    {
                        data?.imgs?.map((item) => {
                            return <div onClick={() => setPreview(item)} className="w-[12vw] h-[95%] transition-all duration-200 rounded-lg overflow-hidden hover:ring-4 hover:ring-green-600 cursor-pointer">
                                        <img src={item.startsWith("i") ? import.meta.env.VITE_API_URL+item : item} className='w-full h-full object-cover' alt="" />
                                    </div>
                        })
                    }
                </div>
            </div>
        </div>
        <div className="w-[60%] flex flex-col items-center gap-4">
            <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full border-b-4 border-green-700 text-2xl font-bold'>
                ลักษณะทางพกฤษศาสตร์
            </label>
            <p className='w-full leading-relaxed'>
                {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"+data?.herbs_look}
            </p>
        </div>
        <div className="w-[60%] flex flex-col items-center gap-4">
            <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full border-b-4 border-green-700 text-2xl font-bold'>
                การนำไปใช้
            </label>
            <p className='w-full leading-relaxed'>
                {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"+data?.usage}
            </p>
        </div>
        <div style={{marginBottom:"2rem"}} className="w-[60%] flex flex-col items-center gap-4">
            <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full border-b-4 border-green-700 text-2xl font-bold'>
                สรรพคุณ
            </label>
            <p className='w-full leading-relaxed'>
                {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"+data?.benefits}
            </p>
        </div>
    </div>
  )
}

export default HerbDetail