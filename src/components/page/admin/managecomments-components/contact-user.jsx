import { sendEmail } from '@/components/function/sendEmail';
import AdminLoading from '@/components/layout/admin/adminloading';
import React, { useState } from 'react'
import { FaPaperPlane, FaTimes } from 'react-icons/fa'

const ContactUser = ({user,onclose}) => {
    const [message,setMessage] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    const sendMessage = async () => {
        if(message === "")return;
        setIsLoading(true);
        try {
            const send = await sendEmail(user?.profile?.email,`${user?.profile?.fname} ${user?.profile?.lname}`
                ,'ข้อความใหม่','ระบบสารสนเทศสมุนไพรไทย',message
            );
            if(send){
             Swal.fire("สำเร็จ",`ส่งข้อความไปยังอีเมล์ของคุณ ${user?.profile?.fname} แล้ว`,"success");
             setMessage("");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","ไม่สามารถส่งข้อความได้ โปรดลองใหม่อีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <div className='absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center'>
        {
            isLoading && <AdminLoading/>
        }
        <div className="w-[25%] relative rounded-lg border border-gray-700 bg-white flex flex-col gap-2" style={{padding:"1.5rem"}}>
            <label htmlFor="" className='text-lg'>
                ส่งข้อความหาคุณ {user?.profile?.fname} 
            </label>
            <textarea onChange={(e) => setMessage(e.target.value)} value={message} type="text" className='outline-none h-[10vh] text-[0.9rem] border border-gray-600 rounded-md' style={{padding:"0.3rem",paddingBottom:"0.35rem"}} placeholder='พิมพ์ข้อความที่นี่' />
            <div className="flex items-center gap-2 justify-end">
                <button onClick={onclose} className='rounded-lg hover:bg-black hover:text-white border bg-gray-300' style={{padding:"0.35rem 0.5rem"}}><FaTimes/></button>
                <button onClick={sendMessage} disabled={message === ""} className={`rounded-lg ${message !== "" ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-500'} border`} style={{padding:"0.35rem 0.5rem"}}><FaPaperPlane/></button>
            </div>
        </div>        
    </div>
  )
}

export default ContactUser