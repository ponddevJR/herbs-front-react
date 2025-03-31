import React, { useEffect, useRef, useState } from 'react'
import { FaArrowCircleLeft, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Banner = () => {

  const [index, setIndex] = useState(0);
    const slideInterVal = useRef(null);
  
    const updateSlide = () => {
      clearInterval(slideInterVal.current);
      slideInterVal.current = setInterval(() => {
        setIndex((prev) => (prev >= 6 ? 0 : prev + 1));
      }, 6000);
    };
  
    useEffect(() => {
      updateSlide();
      return () => clearInterval(slideInterVal);
    }, [index]);
  
    const nextSlide = () => {
      clearInterval(slideInterVal.current);
      setIndex((prev) => (prev >= 6 ? 0 : prev + 1));
      updateSlide();
    };
  
    const prevSlide = () => {
      clearInterval(slideInterVal.current);
      setIndex((prev) => (prev <= 0 ? 6 : prev - 1));
      updateSlide();
    };

  return (
    <div className='border-b-6 border-green-800 w-full overflow-hidden relative h-[63vh]'>
      <div style={{padding:"0.35rem"}} className="z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full flex items-center justify-between">
        <button onClick={prevSlide} className='border text-white bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.8)] border-white text-lg' style={{padding:" 1.5rem 0.5rem"}}>
          <FaArrowLeft/>
        </button>
        <button onClick={nextSlide} className='border text-white bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.8)] border-white text-lg' style={{padding:" 1.5rem 0.5rem"}}>
          <FaArrowRight/>
        </button>
      </div>
      <div  style={{ transform: `translateX(-${1229 * index}px)` }} className={`transition-all duration-700 w-auto h-full absolute top-0 left-0 flex`}>
          <a href="" className='h-full w-[80vw] cursor-pointer'>
            <img src="https://mw-wellness.com/wp-content/uploads/2021/03/banana-meepayof.jpg" className='object-cover w-full h-full' alt="" />
          </a>
          <a href="" className='h-full w-[80vw] cursor-pointer'>
            <img src="https://static.trueplookpanya.com/cmsblog/2364/50364/banner_file.jpg" className='object-cover w-full h-full' alt="" />
          </a>
          <a href="" className='h-full w-[80vw] cursor-pointer'>
            <img src="https://www.wordyguru.com/static/uploads/images/articles/%E0%B8%81%E0%B8%B0%E0%B9%80%E0%B8%9E%E0%B8%A3%E0%B8%B2-%E0%B8%AA%E0%B8%A3%E0%B8%A3%E0%B8%9E%E0%B8%84%E0%B8%B8%E0%B8%93-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%82%E0%B8%A2%E0%B8%8A%E0%B8%99%E0%B9%8C-1679836656.jpg" className='object-cover w-full h-full' alt="" />
          </a>
          <a href="" className='h-full w-[80vw] cursor-pointer'>
            <img src="https://img.pptvhd36.com/health/thumbor/2024/04/26/cusArticle-6259034.jpg" className='object-cover w-full h-full' alt="" />
          </a>
          <a href="" className='h-full w-[80vw] cursor-pointer' >
            <img src="https://images.contentstack.io/v3/assets/blt354ee7f3d82425c3/blt9bd9636e53cb954e/65b8935463dd3aa3ba9621d7/nutrilite-centella-asiatica-banner-jan2024.jpg" className='object-cover w-full h-full' alt="" />
          </a>
          <a href="" className='h-full w-[80vw] cursor-pointer'>
            <img src="https://static.trueplookpanya.com/cmsblog/2449/86449/banner_file.jpg" className='object-cover w-full h-full' alt="" />
          </a>
          <a href="" className='h-full w-[80vw] cursor-pointer'>
            <img src="https://static.trueplookpanya.com/cmsblog/3642/63642/banner_file.jpg" className='object-cover w-full h-full' alt="" />
          </a>
        </div>
    </div>
  )
}
export default Banner