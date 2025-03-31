import { addNew, getAllBlogs } from '@/components/function/blogs';
import React, { useEffect, useState } from 'react'
import { FaImages, FaPen, FaPenAlt, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import {v4 as uuid} from "uuid";

const AddNewPost = ({emotion,currentUser,onclose,backtoEmotion}) => {

  const [activePhoto,setActivePhoto] = useState(true);
  const [text,setText] = useState("");
  const [images,setImages] = useState([]);
  const [imageFiles,setImagesFiles] = useState([]);
  const [postLoading,setPostLoading] = useState(false);

  const inputFiles = (e) => {
    const files = Array.from(e.target.files);
    // สร้าง array ของอ็อบเจ็กต์ที่มี id เดียวกันทั้ง imgArr และ files
    const newFiles = files.map((f) => {
      const id = uuid(); // สร้าง id เดียวกันสำหรับทั้ง imgArr และ files
      return {
        imgObj: { id, src: URL.createObjectURL(f) }, // สำหรับ imgArr
        fileObj: { id, file: f }, // สำหรับไฟล์จริง
      };
    });
    // แยกข้อมูลสำหรับ setState
    const fileObjArr = newFiles.map((f) => f.imgObj);
    const objFileArr = newFiles.map((f) => f.fileObj);

    setImages((prevImgArr) => [...fileObjArr, ...prevImgArr]);
    setImagesFiles((prevFiles) => [...prevFiles, ...objFileArr]);
  }

  const deleteImg = (id) => {
    setImages(prev => prev.filter((item) => item.id !== id));
    setImagesFiles(prev => prev.filter((item) => item.id !== id));
  }

  const sendNewBlog = async () => {
    if(text === "" && imageFiles.length < 1)
      return Swal.fire("แจ้งเตือน","ไม่สามารถโพสต์ได้","error");

    let sendForm = {text,user_id:currentUser._id};
    if(imageFiles.length > 0){
      const formEncrypt = new FormData();
      for(const key in sendForm){
        formEncrypt.append(key,sendForm[key]);
      }
      for(let i = 0 ; i < imageFiles.length ; i++){
        formEncrypt.append('images',imageFiles.map((f) => f.file)[i]);
      }
      if(emotion.codes){
        formEncrypt.append('codes',emotion.codes);
        formEncrypt.append('char',emotion.char);
        formEncrypt.append('th',emotion.th);
      }
      
      sendForm = formEncrypt;
    }else{
      const emojiData = {codes:emotion.codes,char:emotion.char,th:emotion.th};
      sendForm = {...sendForm,emotion:emojiData};
    }
    setPostLoading(true);
    try{
      const req = await addNew(sendForm);
      if(req?.data?.err)
        return Swal.fire("แจ้งเตือน",req?.data?.err,"error");

      await Swal.fire("สำเร็จ",req?.data?.mes,"success");
      location.reload();
    }catch(err){
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
    }finally{
      setPostLoading(false);
    }
  }

  return (
    <div style={{paddingTop:"5rem"}} className='z-10 fixed w-full top-0 left-0 h-full flex items-center justify-center bg-[rgba(255,255,255,0.8)]'>
      <div className="w-[28%] relative bg-white flex flex-col gap-3 items-center rounded-md border shadow-gray-400 shadow-md" style={{padding:"1rem"}}>
        
        <button onClick={onclose} style={{padding:"0.35rem"}} className='absolute top-2 right-2 rounded-full text-lg hover:bg-red-600 hover:text-white'>
          <FaTimes/>
        </button>

        <label htmlFor="" className='font-bold text-2xl'>
          สร้างโพสต์
        </label>

        <div className="w-full flex items-start gap-2">
          <img src={currentUser?.profile?.profile_img?.startsWith("i") ? import.meta.env.VITE_IMG_URL+currentUser?.profile?.profile_img : currentUser?.profile?.profile_img} className='w-[3.5vw] h-[7.5vh] rounded-full border border-gray-700 object-cover' alt="" />
          <div className="flex flex-col gap-1">
            <label htmlFor="" className='text-md font-bold'>
               {currentUser?.profile?.fname} {currentUser?.profile?.lname}
            </label>
            <label htmlFor="" className='text-[0.85rem] flex items-center gap-2 text-gray-600'>
              กำลังรู้สึก {
                emotion.codes ? 
                <button onClick={backtoEmotion} className="hover:underline flex items-start gap-1">
                  <label htmlFor="">{emotion?.char}</label>
                  <label htmlFor="" className='text-[0.8rem]'>{emotion?.th || "โหลดยังไม่เสร็จ"}</label>
                </button>
                :<button onClick={backtoEmotion} className='underline text-black hover:text-blue-800'>ระบุความรู้สึก?</button>
              } 
            </label>
          </div>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} name="" style={{padding:"0.2rem"}} placeholder={`มีอะไรอยากแนะนำไหม `} className={`${text.length > 100 ? 'text-[0.95rem]' : 'text-xl'} leading-relaxed w-full outline-none h-[20vh]`} id=""></textarea>

        {
          activePhoto && images.length < 1 ?
          <div style={{padding:"0.5rem"}} className="relative rounded-lg w-full h-[35vh] border border-gray-400">
            <button onClick={() => setActivePhoto(false)} style={{padding:"0.35rem"}} className='rounded-full hover:bg-gray-400 hover:text-gray-100 text-lg absolute top-3 right-3'><FaTimes/></button>
            <label htmlFor="img-input" className='bg-gray-200 w-full h-full hover:bg-gray-300 rounded-lg cursor-pointer flex flex-col items-center justify-center'>
              <input type="file" multiple onChange={inputFiles} id='img-input' className='hidden' />
              <FaImages className='text-xl text-black'/>
              เพิ่มรูปภาพุ
            </label>
          </div>
          : images.length >= 1 ?
          <>
          <label htmlFor="other-input" style={{padding:'0.35rem'}} className=' absolute top-[18.3rem] z-20 left-5 cursor-pointer shadow-mf border border-gray-400 hover:bg-gray-200 rounded-lg flex items-center gap-2 bg-white'>
            <input type="file" id='other-input' multiple onChange={inputFiles} className='hidden' />
            <FaPlus/> เพิ่ม
          </label>
          <div className={`relative rounded-lg w-[25.5vw] h-[35vh] border border-gray-400 overflow-auto`}>
              <span style={{marginLeft:"4.25rem"}} className='absolute z-10 top-2 left-2 flex items-center gap-2'>
                {
                  images.length <= 1 && 
                  <>
                  <button onClick={() => {setImages([]),setImagesFiles([])}} className='flex items-center gap-1 rounded-lg bg-white shadow-md border border-gray-400 hover:bg-red-600 hover:text-white' style={{padding:"0.35rem"}}><FaTrash/> ลบ</button>
                  </>
                }
              </span>
            
            <div style={{padding:"0.5rem"}} className="w-auto absolute top-0 left-0 flex gap-3 h-full">
              {
                images.map((item) => {
                  return  <div key={item?.id} className={`${images.length <= 1 ? 'w-[24.2vw] h-full' : 'w-[18vw] h-[97%]'} rounded-lg relative`}>
                            {
                              images.length > 1 && <button onClick={() => deleteImg(item.id)} className='absolute top-[-0.4rem] right-[-0.4rem] rounded-full bg-red-600 text-white text-[0.85rem] z-10' style={{padding:"0.35rem"}}><FaTrash/></button>
                            }
                            <img src={item?.src} className='w-full h-full object-cover' alt="" />
                          </div>
                })
              }
             
            </div>
          </div>
          </>
          : ''
        }
        

        <button disabled={postLoading} onClick={sendNewBlog} className='w-full flex items-center justify-center text-lg rounded-lg bg-sky-600 hover:bg-sky-800 text-white' style={{padding:"0.6rem"}}>
          {
            postLoading ? 
            <>
             <span className="mr-2">กำลังโหลด...</span>
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
            ></path>
          </svg>
          </> :
            'โพสต์'
          }
        </button>
      </div>
    
    </div>
  )
}

export default AddNewPost;