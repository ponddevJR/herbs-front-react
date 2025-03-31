import React, { use, useState } from 'react'
import { FaImages, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import EmotionComponents from './emotions';
import { updateBlog } from '@/components/function/blogs';

const EditPost = ({currentUser,onclose,post}) => {
    const [text,setText] = useState(post?.text || "");
    const [activePhoto,setActivePhoto] = useState(true);
    const [images,setImages] = useState([...post?.images]);
    const [oldImgs,setOldImgs] = useState([]);
    const [postLoading,setPostLoading] = useState(false);
    const [imageFiles,setImageFiles] = useState([]);
    const [openEmotion,setOpenEmotion] = useState(false);
    const [emoji,setEmoji] = useState(post?.emotion || {});

    const inputFiles = (e) => {
        const files = Array.from(e.target.files);
        files.map((f) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => [e.target.result,...prev]);
            }
            reader.readAsDataURL(f);
        })
        setImageFiles(prev => [...prev,...files]);

    }

    const deleteImg = (src) => {
        setImages(prev => prev.filter((item) => item !== src));
        setOldImgs(prev => src.startsWith("i") ? [...prev,src] : prev);
    }

    const sendUpdateBlog = async (e) => {
      if(text === "")
        return Swal.fire("แจ้งเตือน","ไม่สามารถบันทึกการแก้ไขได้","error");

      
      let sendForm = {}
      if(images.length > 0 && imageFiles.length > 0){
        const imgUpload = images.filter((src) => src.startsWith("d"));
        const filteredFiles = await Promise.all(
          imageFiles.map(async (item) => {
            const url = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.readAsDataURL(item);
            })
            return {file:item,keep:imgUpload.includes(url)};
          })
        )

        const uploadNewFiles = filteredFiles.filter((item) => item.keep).map((item) => item.file);

        const formEncrypt = new FormData();
        for(let i = 0 ; i < uploadNewFiles.length ; i ++){
          formEncrypt.append("images",uploadNewFiles[i]);
        }
        formEncrypt.append("user_id",post?.user_id);
        formEncrypt.append('text',text);
        formEncrypt.append("char",emoji.char);
        formEncrypt.append("codes",emoji.codes);
        formEncrypt.append("th",emoji.th);
        formEncrypt.append("oldimg",oldImgs);
        formEncrypt.append("img",images.length > 0 ? images.filter((item) => item.startsWith("i")) : []);

        sendForm = formEncrypt;
      }else{
        sendForm = {text,emoji:{
          codes:emoji.codes,char:emoji.char,th:emoji.th
        },oldimg:oldImgs,img:images.length > 0 ? images.filter((item) => item.startsWith("i")) : []}
      }

      setPostLoading(true);
      try {
        const req = await updateBlog(post?._id,sendForm);
        if(req?.data?.err)
          return Swal.fire("แจ้งเตือน",req?.data?.err,"error");
        await Swal.fire("สำเร็จ",req?.data?.mes,"success");
        location.reload();
      } catch (error) {
        console.error(error);
        Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
      }finally{
        setPostLoading(false);
      }
    }

    const getChangeEmoji = (emoji) => {
        setEmoji(emoji);
    }

  return (
    <div className='z-50 w-screen h-screen fixed top-0 left-0 bg-[rgba(255,255,255,0.7)] flex items-center justify-center'>
        {
            openEmotion && <EmotionComponents type={"edit"} sendToOpenEdit={getChangeEmoji} openAddPost={() => setOpenEmotion(false)}/>
        }
        <div style={{padding:"1.5rem"}} className="w-[30%] bg-white flex flex-col items-center gap-4 relative border border-gray-400 shadow-md shadow-gray-400 rounded-lg">
             
             <button onClick={onclose} style={{padding:"0.35rem"}} className='absolute top-2 right-2 rounded-full text-lg hover:bg-red-600 hover:text-white'>
              <FaTimes/>
            </button>
            
            <label htmlFor="" className='font-bold text-2xl'>
                แก้ไขโพสต์
            </label>

            <div className="w-full flex items-start gap-2">
              <img src={currentUser?.profile?.profile_img?.startsWith("i") ? import.meta.env.VITE_IMG_URL+currentUser?.profile?.profile_img : currentUser?.profile?.profile_img} className='w-[3.5vw] h-[7.5vh] rounded-full border border-gray-700 object-cover' alt="" />
              <div className="flex flex-col gap-1">
                <label htmlFor="" className='text-md font-bold'>
                   {currentUser?.profile?.fname} {currentUser?.profile?.lname}
                </label>
                <label htmlFor="" onClick={() => setOpenEmotion(true)}  className='cursor-pointer text-[0.85rem] hover:underline flex items-center gap-2 text-gray-600'>
                    {
                      emoji.char ? 
                      <>
                      กำลังรู้สึก
                        <button className="hover:underline flex items-start gap-1">
                          <label htmlFor="">{ emoji.char}</label>
                          <label htmlFor="" className='text-[0.8rem]'>{emoji.th || "โหลดยังไม่เสร็จ"}</label>
                        </button>
                      </>
                      : 'เพิ่มความรู้สึก?'
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
                      <label htmlFor="other-input" style={{padding:'0.35rem'}} className=' absolute top-[19.55rem] z-20 left-10 cursor-pointer shadow-mf border border-gray-400 hover:bg-gray-200 rounded-lg flex items-center gap-2 bg-white'>
                        <input type="file" id='other-input' multiple onChange={inputFiles} className='hidden' />
                        <FaPlus/> เพิ่ม
                      </label>
                      <div className={`relative rounded-lg w-[25.5vw] h-[35vh] border border-gray-400 overflow-auto`}>
                          <span style={{marginLeft:"4.25rem"}} className='absolute z-10 top-2 left-2 flex items-center gap-2'>
                            {
                              images.length <= 1 && 
                              <>
                              <button onClick={() => {setImages([]),setImageFiles([]),setOldImgs(post?.images)}} className='flex items-center gap-1 rounded-lg bg-white shadow-md border border-gray-400 hover:bg-red-600 hover:text-white' style={{padding:"0.35rem"}}><FaTrash/> ลบ</button>
                              </>
                            }
                          </span>
                        
                        <div style={{padding:"0.5rem"}} className="w-auto absolute top-0 left-0 flex gap-3 h-full">
                          {
                            images.map((item) => {
                              return  <div key={item} className={`${images.length <= 1 ? 'w-[24.2vw] h-full' : 'w-[18vw] h-[97%]'} rounded-lg relative`}>
                                        {
                                          images.length > 1 && <button onClick={() => deleteImg(item)} className='absolute top-[-0.4rem] right-[-0.4rem] rounded-full bg-red-600 text-white text-[0.85rem] z-10' style={{padding:"0.35rem"}}><FaTrash/></button>
                                        }
                                        <img src={item?.startsWith("i") ? import.meta.env.VITE_IMG_URL+item : item} className='w-full h-full object-cover' alt="" />
                                      </div>
                            })
                          }
                         
                        </div>
                      </div>
                      </>
                      : ''
                    }

<button disabled={postLoading} onClick={sendUpdateBlog} className='w-full flex items-center justify-center text-lg rounded-lg bg-sky-600 hover:bg-sky-800 text-white' style={{padding:"0.6rem"}}>
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
            'บันทึก'
          }
        </button>
        </div>  
    </div>
  )
}

export default EditPost;