import { reportBlog } from '@/components/function/blogs';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';

const ReportBlog = ({fetchData,activeBlog,onclose}) => {
    const [isLoading,setIsLoading] = useState(false);
    const [report,setReport] = useState([]);
    
      const handleReport = (text) => {
        if(report.find((r) => r === text))return setReport(prev => prev.filter((item) => item !== text));
        setReport(prev => [text,...prev]);
      }


      const sendReport = async () => {
        if(report.length < 0)return;
        const blogId = activeBlog._id;
        if(!blogId)return;

        setIsLoading(true);
        try {
            const send = await reportBlog({blogId,report});
            if(send?.data?.err)
                return Swal.fire("แจ้งเตือน",send?.data?.err,"error");

            Swal.fire("สำเร็จ","รายงานโพสต์นี้แล้ว","success");
            fetchData();
            onclose();
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
      }


  return (
    <div className='z-50 fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex flex-col items-center justify-center'>
      <div className="relative bg-white border rounded-lg w-[30%] flex flex-col gap-3" style={{padding:"1.5rem"}}>
        <button onClick={onclose} className='text-lg absolute top-2 right-2 rounded-full hover:text-white hover:bg-red-500' style={{padding:"0.35rem"}}>
          <FaTimes/>
        </button>
          <label htmlFor="" className='w-full text-xl font-bold'>
              รายงาน
          </label>
          <label htmlFor="" className='w-full text-xl font-bold'>
              เกิดอะไรขึ้น
          </label>
          <label htmlFor="" className='text-[0.85rem] text-gray-600'>
            คุณสามารถเลือกได้มากกว่า 1 ข้อ ทางเราจะตรวจสอบอย่างละเอียด
          </label>
          <div className="w-full h-[40vh] flex flex-col gap-5 overflow-auto">
            {
              ["เนื้อหาเกี่ยวกับเรื่องเพศ","เนื้อหารุนแรงหรือน่ารังเกียจ","เนื้อหาแสดงความเกลียดชังหรือการล่วงละเมิด",
                "การคุกคามหรือการกลั่นแกล้ง","การกระทำที่เสี่ยงอันตรายหรือเป็นภัย","การให้ข้อมูลที่ไม่ถูกต้อง","การละเมิดต่อเด็ก",
                "ส่งเสริมการก่อการร้าย","สแปมหรือทำให้เข้าใจผิด"].map((item) => {
                  return  <label key={item} className="flex items-center gap-4 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                            <input type="checkbox" onChange={() => handleReport(item)} checked={report.includes(item)} className="w-5 h-5 accent-blue-500" />
                            <span className="text-[1rem] text-gray-700">{item}</span>
                          </label>
                })
            }
          </div>
          <button disabled={isLoading} onClick={sendReport} className={`${report.length > 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'} rounded-full text-lg border flex justify-center `} style={{padding:"0.5rem",marginTop:"1rem"}}>
            {
                isLoading ? <Loader2 className=" animate-spin h-5 w-5 mr-2" /> : 'รายงาน'
            }
            </button>
      </div>
  </div>
  )
}

export default ReportBlog