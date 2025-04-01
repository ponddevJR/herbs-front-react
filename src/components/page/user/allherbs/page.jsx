import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import React, { useState } from 'react'
import Banner from './banner'
import { FaFilter, FaList, FaSearch } from 'react-icons/fa'
import HerbsComponents from './herbs'
import { getHerbs } from '@/components/function/herbs'
import { getAllCategories } from '@/components/function/category'
import Loading from '@/components/layout/loading'

const AllHerbPage = () => {
  const [originalHerbs,setOriginalHerb] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [herbs,setHerbs] = useState([]);
  const [categories,setCategories] = useState([]);

  const fetchHerb = async () => {
    setIsLoading(true);
    try {
      const herbs = await getHerbs();
      const categories = await getAllCategories();
      if(!herbs?.data?.herbs || !categories?.data?.categories)return;

      setOriginalHerb(herbs?.data?.herbs);
      setHerbs(herbs?.data?.herbs);
      setCategories(categories?.data?.categories)
    } catch (error) {
      console.erro(error);
    }finally{
      setIsLoading(false);
    }
  }

  useState(() => {fetchHerb()},[]);

  return (
    <>
    {
      isLoading && <Loading/>
    }
    <Navbar/>
        <div className="w-screen h-screen flex flex-col items-center">
            <div  style={{marginTop:"6.5rem",marginBottom:"10rem"}} className="w-[75%] flex flex-col gap-6 items-center">
                <Banner/>

                <div style={{padding:"0.5rem 0.35rem"}} className="sticky z-20 top-[5.5rem] w-full bg-white flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <button className='shadow-md shadow-gray-400 hover:bg-green-800 hover:text-white hover:scale-110 rounded-lg border border-gray-400 active:scale-95 flex items-center gap-2' style={{padding:"0.5rem"}}><FaFilter/> กรอง</button>
                    <button className='shadow-md shadow-gray-400 hover:bg-green-800 hover:text-white hover:scale-110 rounded-lg border border-gray-400 active:scale-95 flex items-center gap-2' style={{padding:"0.5rem"}}><FaList/> หมวดหมู่</button>
                    <button className='shadow-md shadow-gray-400 hover:bg-green-800 hover:text-white hover:scale-110 rounded-lg border border-gray-400 active:scale-95 flex items-center gap-2' style={{padding:"0.5rem"}}><i className="fas fa-rotate-right"></i> รีเฟรช</button>
                  </div>
                  <div className="w-[45%] rounded-3xl flex items-center gap-2 border-2 border-green-900" style={{padding:"0.5rem 0.8rem"}}>
                    <FaSearch/>
                    <input type="text" className='outline-none border-none w-[90%]' placeholder='พิมพ์ค้นหาสมุนไพร' />
                  </div>
                </div>

                <HerbsComponents herbs={herbs} categories={categories}/>

            </div>
            <Footer/>
        </div>
    </>
  )
}

export default AllHerbPage