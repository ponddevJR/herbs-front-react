import React, { useEffect, useState } from 'react'
import { FaEye, FaThumbsDown, FaThumbsUp, FaTimes } from 'react-icons/fa';
import { getHerbs } from '../../../function/herbs';

const Detail = ({research,onclose}) => {
    const [preview,setPreview] = useState(research?.imgs[0]);
    const [herbsAbout,setHerbAbout] = useState([]);

    useEffect(() => {
        getHerbs().then((res) => {
            if(!res?.data?.herbs)return;
            const herbs = res?.data?.herbs;
            console.log("🚀 ~ getHerbs ~ herbs:", herbs)
            setHerbAbout(herbs.filter((item) => research?.herbs_id.includes(item._id)).map((item) => item.name_th).join(","));
        })
    },[]);

  return (
    <div className='overflow-auto flex items-center justify-center w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)]'>
        <div className="bg-white borer rounded-lg flex items-center flex-col gap-8 w-[45%] relative" style={{padding:"2rem",marginTop:"38.5rem"}}>
            <button onClick={onclose} className='rounded-full absolute top-2 right-2 hover:bg-red-600 hover:text-white' style={{padding:"0.25rem"}}><FaTimes/></button>
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="">รหัส : {research?._id}</label>
                <label htmlFor="">ปี : {research?.year}</label>
                <label htmlFor="" style={{marginTop:"0.5rem"}} className='text-[0.9rem] text-gray-700'>สมุนไพรที่เกี่ยวข้อง : {herbsAbout}</label>
            </div>
            <label htmlFor="" className='font-bold text-2xl'>
                {research?.title}
            </label>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="" className='text-xl border-b-2 border-gray-500' style={{paddingBottom:"0.5rem"}}>ผู้ทำวิจัย</label>
                <p className='leading-relaxed'>{research?.author}</p>
            </div>
            <div className='w-full flex flex-col gap-3'>
                <label htmlFor="" className='text-xl border-b-2 border-gray-500' style={{paddingBottom:"0.5rem"}}>วัตถุประสงค์ของงานวิจัย</label>
                <div className='w-full h-[15vh] overflow-auto'>
                    <p className='leading-relaxed'>{research?.objective}</p>
                </div>
            </div>
            <div className='w-full flex flex-col gap-3'>
                <label htmlFor="" className='text-xl border-b-2 border-gray-500' style={{paddingBottom:"0.5rem"}}>ลิงค์</label>
                <a href={research?.source} className='underline text-blue-800'>คลิกเพื่อดูงานวิจัย</a>
            </div>
            <div className='w-full flex flex-col gap-3'>
                <label htmlFor="" className='text-xl border-b-2 border-gray-500' style={{paddingBottom:"0.5rem"}}>รูป</label>
                <img src={preview.startsWith("i") ? `${import.meta.env.VITE_IMG_URL}${preview}` : preview} className='w-full h-[50vh] border object-cover' alt="" />

                {
                    research?.imgs?.length > 1 &&
                    <div className="w-full h-[23vh] overflow-auto relative">
                        <div style={{padding:"0.5rem"}} className="w-auto flex gap-3 absolute top-0 letf-0 ">
                            {
                                research?.imgs?.map((item) => {
                                    return <div onClick={() => setPreview(item)} className='hover:ring-3 hover:rounded-md transition-all duration-200 hover:border-none hover:ring-green-500 w-[10vw] h-[18vh] border border-gray-700 cursor-pointer'>
                                                <img src={item.startsWith("i") ? `${import.meta.env.VITE_IMG_URL}${item}` : item} className='w-full h-full object-cover' alt="" />
                                            </div>
                                })
                            }
                            
                        </div>
                    </div>
                }
            </div>
            <div className='w-full flex items-center justify-between'>
                <label htmlFor="" className='flex items-center gap-1'><FaEye/> : {research?.views}</label>
                <span className='flex items-center gap-5'>
                    <label htmlFor="" className='flex items-center gap-1'><FaThumbsUp/> : {research?.likes?.length}</label>
                    <label htmlFor="" className='flex items-center gap-1'><FaThumbsDown/> : {research?.dislikes?.length}</label>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Detail;