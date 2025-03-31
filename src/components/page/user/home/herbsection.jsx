import React, { useEffect, useState } from 'react'
import { FaLeaf, FaSearch } from 'react-icons/fa';
import Loading from '../../../layout/loading';
import { getAllCategories } from '../../../function/category';
import { getHerbs } from '../../../function/herbs';

const HerbSection = () => {
  const [original,setOriginal] = useState([]);
  const [categories,setCategories] = useState([]);
  const [herbs,setHerbs] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const ctgs = await getAllCategories();
        const herbs = await getHerbs();
        if(!ctgs || !herbs)return;

        setCategories(ctgs?.data?.categories);
        setHerbs(herbs?.data?.herbs);
        setOriginal(herbs?.data?.herbs);
    } catch (error) {
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  }

  const searchHerb = (e) => {
    const value = e.target.value;
    if(value.length < 1 || value === ""){
      setHerbs(original);
    }else{
      setHerbs(original.filter((h) => 
        h.name_th.includes(value) ||
        h.name_science.toLowerCase().includes(value) ||
        h.name_normal.toLowerCase().includes(value) ||
        h.herbs_look.toLowerCase().includes(value) ||
        h.usage.toLowerCase().includes(value) ||
        h.benefits.toLowerCase().includes(value) ||
        categories.filter((ctg) => h?.categories.includes(ctg._id)).map((ctg => ctg.ctg_name)).join(", ").includes(value)
      ))
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <>
    {isLoading && <Loading/>}
    <div className='relative w-[81%] flex flex-col gap-4 items-center'>
        <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full flex justify-between font-bold text-2xl border-b-4 border-green-900'>ฐานข้อมูลสมุนไพร</label>
        <div className='w-full flex items-center justify-between'>
            <label htmlFor="" className='text-lg'>หมวดหมู่สมุนไพร</label>
            <div className='flex gap-4 border-2 border-green-900 items-center w-[40%]' style={{padding:"0.5rem 1rem"}}>
              <FaSearch/>
              <input onChange={searchHerb}  type="text" placeholder='ค้นหาสมุนไพร' className='outline-none w-[95%]'/>
            </div>
        </div>
        <div className='w-full flex justify-between'>
            <div className='w-[20%] flex flex-col'>
                <button className='rounded-lg bg-[#0a2d1e] text-white w-full flex text-left items-center cursor-pointer' style={{padding:"0.65rem 1rem"}}>ทั้งหมด</button>
                {
                  categories?.map(item => {
                      return  <button key={item._id} className='rounded-lg bg-white hover:bg-gray-200 cursor-pointer w-full flex text-left items-center text-gray-800' style={{padding:"0.65rem 1rem"}}>{item.ctg_name.length < 23 ? item.ctg_name : item.ctg_name.substring(0,23)+'...'}</button>
                  })
                }
            </div>
            <div className='w-[72%] grid grid-cols-3 gap-10'>
              {
                herbs?.length > 0 ?
                herbs?.slice(0,15).map(item => {
                  return    <a key={item._id} href={`/herbdetail/${item?._id}`}>
                              <div key={item._id} style={{paddingBottom:"0.3rem"}} className='border-b-4 border-green-600 cursor-pointer hover:bg-gray-200 hover:translate-y-[-10px] transition-all duration-300 w-[19vw] h-[47.5vh] flex flex-col'>
                                <div className='w-full h-[20vh] border'>
                                    <img src={item?.imgs[0].startsWith('i') ? `${import.meta.env.VITE_IMG_URL}${item?.imgs[0]}` : item?.imgs[0]} className='w-full h-full object-cover' alt="" />
                                </div>
                                <div className='w-full flex flex-col' style={{padding:"0.5rem"}}>
                                    <label htmlFor="" className='font-bold text-lg'>{item?.name_th}</label>
                                    <label htmlFor="" className='text-[0.8rem] text-gray-700'>
                                      {
                                        categories.filter((ctg) => item?.categories.includes(ctg._id)).map((ctg => ctg.ctg_name)).join(",").substring(0,35)+'...'
                                      }
                                    </label>

                                      <p style={{margin:"0.3rem 0"}} className='text-[0.8rem] leading-relaxed'>
                                          {item?.benefits?.length > 180 ? item?.benefits?.substring(0,180)+'...' : item?.benefits}
                                      </p>
                                    <label htmlFor="" className='text-[0.8rem] text-gray-600'>แก้ไขล่าสุด {new Date(item?.updatedAt).toLocaleDateString('th-TH')} {new Date(item?.updatedAt).toLocaleTimeString('th-Th')}</label>
                                  </div>
                                </div> 
                              </a>
    
                }) : 
                <div className="w-[25vw] flex flex-col gap-2 items-center">
                  <label htmlFor="" className='text-lg text-red-600'>
                    ขออภัย ขณะนี้ระบบไม่พบสมุนไพรที่ท่านต้องการ
                  </label>
                </div>
              }
            </div>
        </div>
    </div>
    </>
  )
}

export default HerbSection;