import React, { useState } from 'react'
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa'

const CommentFilter = ({sendData,comments,onclose}) => {
    const [likes,setLikes] = useState({min:0,max:0});
    const [dislikes,setDislikes] = useState({min:0,max:0});
    const [date,setDate] = useState("");
    const [reports,setReports] = useState([]);

    const sendFiltered = () => {
        let filtered = [...comments];
        if(likes.min === 0 && likes.max === 0
            &&  dislikes.min === 0 && dislikes.max === 0
            && date === "" && reports.length < 1
        )return onclose();

        if(likes.min > 0 || likes.max > 0){
            filtered = filtered.filter((item) => {
                return item.likes.length >= likes.min && item.likes.length <= (likes.max || Infinity)
            })
        }

        if(dislikes.min > 0 || dislikes.max > 0){
            filtered = filtered.filter((item) => {
                return item.dislikes.length >= dislikes.min && item.dislikes.length <= (dislikes.max || Infinity)
            })
        }

        if(date !== ""){
            filtered = filtered.filter((item) => {
                return new Date(item.createdAt).toLocaleDateString("th-TH") === new Date().toLocaleDateString('th-TH')
            })
        }

        if(reports.length > 0){
            filtered = filtered.filter((item) => {
                return item.report.some((r) => new Set(reports).has(r));
            })
        }
        sendData(filtered);
        onclose();
    }

    const addReports = (text) => {
        if(reports.find((r) => r === text))return setReports(prev => prev.filter((item) => item !== text));
        setReports(prev => [text,...prev]);
    }

    const inputDate = (e) => {
        const select = e.target.value;
        if(new Date(select).setHours(0,0,0,0) > new Date())
            return Swal.fire("แจ้งเตือน","ไม่สามารถเลือกวันที่ในอนาคตได้","error");
        setDate(select);
    }

    const handleMin = (state,setState,e) => {
        const value = parseInt(e.target.value);
        setState(value > state.max && state.max > 0 ? {...state,min:state.max} : {...state,min:value} )
    }

    const handleMax = (state,setState,e) => {
        const value = parseInt(e.target.value);
        setState(value < state.min && state.min > 0 ? {...state,max:state.min} : {...state,max:value} )
    }


  return (
    <div className='z-30 overflow-y-auto absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center'>
        <div className="relative w-[40%] text-blue-950  flex flex-col gap-8 items-center rounded-lg border border-black bg-white" style={{padding:"2rem",marginTop:"8rem"}}>
            <button onClick={onclose} className='text-lg rounded-full hover:bg-red-600 hover:text-white absolute top-1 right-1' style={{padding:"0.35rem"}}><FaTimes/></button>

            <div className="flex flex-col items-center gap-1">
                <label htmlFor="" className='text-blue-950 text-3xl font-bold flex items-center gap-1'>
                    <FaFilter/> ตัวกรอง
                </label>
                <label htmlFor="" className='text-[0.85rem] text-gray-700'>
                    ค้นหาความคิดเห็นง่ายๆด้วยตัวกรอง
                </label>
            </div>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 border-black font-bold text-xl'>
                    ถูกใจ
                </label>
                <div className="w-full flex items-center justify-between gap-3">
                    <input  type="number" minLength={0} onChange={(e) => handleMin(likes,setLikes,e)} value={likes.min === 0 ? "" : likes.min} placeholder='ตั้งแต่' className='w-[12vw] outline-none border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-800' style={{padding:"0.3rem"}} />
                    <label htmlFor="" className='text-xl'>-</label>
                    <input type="number" minLength={likes.min} onChange={(e) => handleMax(likes,setLikes,e)} value={likes.max === 0 ? "" : likes.max}  placeholder='ไม่เกิน' className='w-[12vw] outline-none border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-800' style={{padding:"0.3rem"}} />
                </div>
            </div>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 border-black font-bold text-xl'>
                    ไม่ถูกใจ
                </label>
                <div className="w-full flex items-center justify-between gap-3">
                    <input type="number" minLength={0} onChange={(e) => handleMin(dislikes,setDislikes,e)} value={dislikes.min === 0 ? '' : dislikes.min} placeholder='ตั้งแต่' className='w-[12vw] outline-none border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-800' style={{padding:"0.3rem"}} />
                    <label htmlFor="" className='text-xl'>-</label>
                    <input type="number" minLength={dislikes.min} onChange={(e) => handleMax(dislikes,setDislikes,e)} value={dislikes.max === 0 ? "" : dislikes.max} placeholder='ไม่เกิน' className='w-[12vw] outline-none border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-800' style={{padding:"0.3rem"}} />
                </div>
            </div>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 border-black font-bold text-xl'>
                    วันที่โพสต์
                </label>
                <input value={date} onChange={(e) => inputDate(e)} type="date" className='outline-none rounded-lg border border-gray-600 focus:ring-2 focus:ring-2-[#050a44]' style={{padding:"0.35rem"}} />
            </div>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 border-black font-bold text-xl'>
                    ถูกรายงานด้วยประโยคเหล่านี้
                </label>
                <div style={{padding:"0.35rem"}} className="w-full flex flex-col gap-3 overflow-auto border h-[25vh] border-gray-800">
                   {
                    ["เนื้อหาเกี่ยวกับเรื่องเพศ","เนื้อหารุนแรงหรือน่ารังเกียจ","เนื้อหาแสดงความเกลียดชังหรือการล่วงละเมิด",
                        "การคุกคามหรือการกลั่นแกล้ง","การกระทำที่เสี่ยงอันตรายหรือเป็นภัย","การให้ข้อมูลที่ไม่ถูกต้อง","การละเมิดต่อเด็ก",
                        "ส่งเสริมการก่อการร้าย","สแปมหรือทำให้เข้าใจผิด"].map((item) => {
                          return  <label key={item} className="flex items-center gap-4 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                                    <input type="checkbox" onChange={() => addReports(item)} checked={reports.includes(item)} className="w-5 h-5 accent-blue-500" />
                                    <span className="text-[1rem] text-gray-700">{item}</span>
                                  </label>
                        })
                   }
                </div>
            </div>
            <button onClick={sendFiltered} className='w-full justify-center flex items-center text-lg gap-3 text-white rounded-lg hover:bg-blue-900 bg-[#050a44]' style={{padding:'0.8rem'}}><FaSearch/>ค้นหา</button>
        </div>

    </div>
  )
}

export default CommentFilter