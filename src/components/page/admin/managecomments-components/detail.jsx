import AdminLoading from '@/components/layout/admin/adminloading';
import React, { useEffect, useState } from 'react'
import { FaEnvelope, FaPhone, FaThumbsDown, FaThumbsUp, FaTimes } from 'react-icons/fa';
import {clearReport} from "../../../function/comments";
import ContactUser from './contact-user';

const Detail = ({fetchComment,deleteComment,allUsers,comment,onclose}) => {
  const [userImg,setUserImg] = useState("https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg");
  const [activeContractMenu,setContractMenu] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [activeEmailContact,setActiveEmailContact] = useState(false);

  useEffect(() => {
      setUserImg(allUsers.find((u) => u._id === comment?.user_id)?.profile?.profile_img );
  },[comment])

  
  const reportCount = () => {
    const reports = comment?.report?.reduce((acc, r) => {
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(reports)
      .map(([report, count]) => <label className='text-red-700 text-[0.9rem]'>{report} {count} ครั้ง</label>)
  };

  const removeComment = async () => {
    await deleteComment();
    fetchComment();
  }

  const reportClear = async () => {
    const {isConfirmed} = await Swal.fire({
      title:"ต้องการล้างรายงานความคิดเห็นนี้หรือไม่?",
      text:"คำรายงานทั้งหมดจะถูกลบ",
      icon:"question",
      showDenyButton:true,
      denyButtonText:"ยกเลิก",
      confirmButtonText:"ล้าง"
    })
    if(!isConfirmed)return;
    setIsLoading(true);
    try {
      const clear = await clearReport(comment?._id);
      if(clear?.data?.err)return Swal.fire("แจ้งเตือน",clear?.data?.err,"error");

      Swal.fire("สำเร็จ",clear?.data?.mes,"success");
      fetchComment();
      onclose();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด","ไม่สามารถดำเนินการได้ โปรดลองใหม่อีกครั้ง","error");
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <div className='z-10 fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center'>
      {
        isLoading && <AdminLoading/>
      }
        <div className="bg-white rounded-lg w-[30%] relative flex flex-col gap-4" style={{padding:"1rem"}}>
          <button onClick={onclose} style={{padding:"0.35rem"}} className='absolute top-2 right-2 rounded-full hover:bg-red-600 text-lg hover:text-white'>
            <FaTimes/>
          </button>
          <div className='flex flex-col gap-2'>
            <div className="flex items-start gap-5">
              <div className="w-[8.5vw] h-[18vh] overflow-hiddden rounded-full">
                <img src={ userImg.startsWith("i") ?  import.meta.env.VITE_IMG_URL+userImg : userImg} className='w-full h-full object-cover' alt="" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className='text-[0.8rem]'>รหัสผู้ใช้ : {comment?.user_id}</label>
                <label htmlFor="" className='text-lg font-bold'>
                  {allUsers.find((u) => u?._id === comment?.user_id)?.profile?.fname}
                </label>
                <label htmlFor="" className='text-[0.85rem] text-gray-600 flex gap-1 items-center'>
                  <FaThumbsUp/> : {comment?.likes?.filter((item) => item !== "")?.length}
                </label>
                <label htmlFor="" className='text-[0.85rem] text-gray-600 flex gap-1 items-center'>
                  <FaThumbsDown/> : {comment?.dislikes?.filter((item) => item !== "")?.length}
                </label>
                <label htmlFor="" className='text-[0.85rem] text-gray-600 flex gap-1 items-center'>
                  โพสต์เมื่อ : {new Date(comment?.createdAt).toLocaleDateString('th-TH')}
                </label>
              </div>
            </div>
            <div className="relative flex items-center gap-1">
              {
                comment?.report?.length > 0 && <button onClick={reportClear} className='text-[0.8rem] active:scale-92 rounded-md bg-gray-200 hover:text-white hover:bg-green-800' style={{padding:"0.35rem"}}>ล้างรายงาน</button>
              }
              <button onClick={() => setContractMenu(!activeContractMenu)} className='relative text-[0.8rem] active:scale-92 rounded-md bg-gray-800 text-white' style={{padding:"0.35rem"}}>
                {activeContractMenu ? <FaTimes className='text-lg'/> : "ติดต่อผู้ใช้รายนี้"}
                {
                  activeContractMenu && 
                  <span className={`text-black transition-all duration-200 absolute bottom-[-1.1rem] right-[-9rem] text-[0.9rem] border border-gray-400 shadow-md bg-white rounded-md flex flex-col gap-1`} style={{padding:"0.25rem"}}>
                    <button className='flex items-center gap-1 rounded-md text-[0.8rem] hover:bg-green-700 hover:text-white ' style={{padding:"0.3rem 0.8rem"}}>
                      <FaPhone/> :{allUsers.find((u) => u?._id === comment?.user_id)?.profile?.phone}
                    </button>
                    <button onClick={() => setActiveEmailContact(true)} className='flex items-center gap-1 rounded-md text-[0.8rem] hover:bg-blue-800 hover:text-white ' style={{padding:"0.3rem 0.8rem"}}>
                      <FaEnvelope/> :ติดต่อผ่านอีเมล์
                    </button>
                  </span>
                }
              </button>
           
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className='font-bold'>ความคิดเห็น :</label>
            <p className='text-[0.9rem] leading-relaxed'>{comment?.content}</p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className='font-bold '>รายงาน :</label>
            {comment.report.length > 0 ? reportCount() : <label className='text-[0.9rem] text-green-800'>ไม่มีการายงานความคิดเห็นนี้</label>}
          </div>
            <button onClick={removeComment} style={{padding:'0.5rem',marginTop:"1rem"}} className='text-white bg-red-700 rounded-lg hover:bg-red-800'>ลบความคิดเห็น</button>
        </div>
        {
          activeEmailContact && <ContactUser onclose={() => setActiveEmailContact(false)} user={allUsers?.find((u) => u._id === comment?.user_id)}/>
        }
    </div>
  )
}

export default Detail