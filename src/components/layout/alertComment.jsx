
import React from 'react'
import { FaCheck } from 'react-icons/fa';

const AlertComment = ({active,type,text}) => {
  return (
    <div style={{padding:'1rem'}} className={`${active ? "translate-y-0 opacity-100" : "translate-y-[6.5rem] opacity-0"}transition-all duration-600 z-[60] fixed w-[20%] bottom-4 right-3 rounded-lg bg-white border border-gray-400 shadow-lg flex items-center gap-3`}>
        {
            type === "success" ? 
            <FaCheck className='rounded-full  bg-green-600 text-2xl  text-white' style={{padding:"0.45rem"}}/>
            : <label className='rounded-full bg-red-600 text-xl  text-white' style={{padding:"0.35rem 1rem"}}>i</label>
        }
        <label htmlFor="">{text}</label>
    </div>
  )
}

export default AlertComment;