import React from 'react'
import { FaCopyright, FaFacebook, FaGithub, FaInstagram, FaLine, FaTiktok, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className=' w-screen bg-[#0a2d1e] flex flex-col gap-12' style={{padding:"3rem 10rem"}}>
        <div className="w-full flex text-white justify-between">
            <div className="flex flex-col gap-3 items-start justify-start">
                <img src="https://www.rmu.ac.th/images/logo_rmu.png" className='w-[8vw] h-[15vh]' alt="" />
                <label htmlFor="" className='text-xl'>
                    ระบบจัดการสารสนเทศสมุนไพรไทย
                </label>
                <label htmlFor="">
                    โดย : นายปฐมพร วงสวุรรณ
                </label>
            </div>
            <div className="w-[35%] flex flex-col gap-5">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 border-white text-xl text-white'>
                    ติดต่อ
                </label>
                <div className="w-full flex gap-5">
                    <a className='transtion-all duration-200 text-4xl hover:text-gray-200' href=""><FaGithub/></a>
                    <a className='transtion-all duration-200 text-4xl hover:text-blue-400' href="https://www.facebook.com/pathomporn.wongsuwan"><FaFacebook/></a>
                    <a className='transtion-all duration-200 text-4xl hover:text-green-400' href=""><FaLine/></a>
                    <a className='transtion-all duration-200 text-4xl hover:text-red-500' href=""><FaYoutube/></a>
                    <a className='transtion-all duration-200 text-4xl hover:text-purple-700' href=""><FaTiktok/></a>
                    <a className='transtion-all duration-200 text-4xl hover:text-pink-300' href=""><FaInstagram/></a>
                </div>
            </div>
        </div>
        <div style={{paddingTop:"1rem"}} className="border-t-2 border-white flex justify-center">
            <label htmlFor="" className='text-lg text-white flex items-center'><FaCopyright/>{"\u00A0"}2025 : นายปฐมพร วงสวุรรณ</label>
        </div>
    </div>
  )
}

export default Footer