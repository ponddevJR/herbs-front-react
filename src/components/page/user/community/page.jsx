
import Navbar from '@/components/layout/navbar'
import React, { useEffect, useState } from 'react'
import { FaComment, FaDotCircle, FaFlag, FaImages, FaThumbsUp, FaTimes } from 'react-icons/fa';
import AddNewPost from './add-new-post';
import { getSingle } from '@/components/function/user';
import { useNavigate } from 'react-router-dom';
import EmotionComponents from './emotions';
import Loading from '@/components/layout/loading';
import { getAllBlogs, removeBlog, updateLike } from '@/components/function/blogs';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {getAll} from "../../../function/user";
import EditPost from './edit-post';
import { Loader2 } from 'lucide-react';
import CommentsBlog from './comments';
import ReportBlog from './report';

dayjs.extend(relativeTime);
dayjs.locale("th");

const postTime = (createdAt) => {
    return dayjs(createdAt).fromNow();
};



const CommunityPage = () => {
    const navigate = useNavigate();
    const [currentUser,setCurrentUser] = useState({});
    const [activeNewPost,setActiveNewPost] = useState(false);
    const [activeEmotion,setAvtiveEmotion] = useState(false);
    const [emotion,setEmotion] = useState("");
    const [pageLoading,setPageLoading] = useState(false);
    const [blogsData,setBlogsData] = useState([]);
    const [allUser,setAllUser] = useState([]);
    const [editPost,setEditPost] = useState({});
    const [activeManagePost,setActiveManagePost] = useState('');
    const [openEdit,setOpenEdit] = useState(false);
    const [likeLoading,setLikeLoading] = useState({id:null,loading:false});
    const [openComment,setOpenComment] = useState(false);
    const [activeBlog,setActiveBlog] = useState({});
    const [openReport,setOpenReport] = useState(false);

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };
    
    const fetchBlogs = async () => {
        try {
            const req = await getAllBlogs();
            if (!req?.data?.blogs) return;
    
            const posts = req.data.blogs;
            const validate = posts.filter((p) => isValidDate(new Date(p.createdAt)));
    
            setBlogsData(validate.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA || b.likes - a.likes;
            }));
        } catch (error) {
            console.error(error);
        }
    };
  
    useEffect(() => {
            fetchBlogs()
            getAll().then((res) => {
                if(!res?.data?.users)return;
                setAllUser(res?.data?.users);
            }).catch(err => console.log(err));
    },[]);

    useEffect(() => {
        getSingle().then((res) => {
        if(!res)return navigate("/login");
        setCurrentUser(res);
    }
    ).catch(err => console.log(err)) },[]);

    const getEmotion = (codes) => {
        setEmotion(codes,);
        setActiveNewPost(true);
        setAvtiveEmotion(false);
    }

    const openEmotionComponent = () => {
        setActiveNewPost(false);
        setAvtiveEmotion(true);
    }

    const openEditPost = (post) => {
        setEditPost(post);
        setOpenEdit(true);
        setActiveManagePost("");
    }

    const openAddPost = () => {
        setAvtiveEmotion(false);
        if(!activeNewPost && !openEdit){
            setActiveNewPost(true);
        }
    }


    const deletePost = async (id) => {
        const {isConfirmed} = await Swal.fire({
            title:"ต้องการลบโพสต์นี้หรือไม่?",
            text:'โพสต์ที่ลบแล้วจะไม่สามารถกู้คืนได้',
            icon:"question",
            showDenyButton:true,
            denyButtonText:"ยกเลิก",
            confirmButtonText:"ลบโพสต์"
        });
        if(!isConfirmed)return;
    
        setPageLoading(true);
        try {
            const req = await removeBlog(id);
            if(req?.data?.err)return Swal.fire("แจ้งเตือน",req?.data?.err,"error");

            await Swal.fire("สำเร็จ",req?.data?.mes,"success");
            location.reload();
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
        }finally{
            setPageLoading(false);
        }
    }

    const handleLikes = async (item) => {
        let likes = item.likes;
        if(likes.find((l) => l === currentUser._id)){
            likes = likes.filter((l) => l !== currentUser._id);
        }else{
            likes = [...item.likes,currentUser._id];
        }
        setLikeLoading({id:item?._id,loading:true});
        try {
            await updateLike({id:item?._id,update:likes});
            fetchBlogs();
        } catch (error) {
            console.error(error);
        }finally{
            setLikeLoading({id:null,loading:false});
        }
        
    }

    const updateActiveBlog = async () => {
        try {
            const req = await getAllBlogs();
            if(!req?.data?.blogs)return;
            const blogs = req?.data?.blogs;
            setBlogsData(blogs);
            const data = blogs.find((b) => b._id === activeBlog._id);
            setActiveBlog(data);
          } catch (error) {
            console.error(error);
          }
    }

  return (
    <>
    <Navbar/>
    {
        openReport && <ReportBlog fetchData={fetchBlogs} activeBlog={activeBlog} onclose={() => setOpenReport(false)}/>
    }
    {
        activeNewPost && <AddNewPost  backtoEmotion={openEmotionComponent} emotion={emotion} currentUser={currentUser} onclose={() => setActiveNewPost(false)}/>
    }
    {
        activeEmotion && <EmotionComponents openEdit={openEdit} sendEmotion={getEmotion} openAddPost={openAddPost}/>
    }
    {
        pageLoading && <Loading/>
    }
    {
        openEdit && <EditPost currentUser={currentUser} post={editPost} onclose={() => setOpenEdit(false)}/>
    }
    {
        openComment && <CommentsBlog fetchComment={updateActiveBlog} blogs={activeBlog} onclose={() => setOpenComment(false)}/>
    }
       <div style={{marginTop:"5rem",padding:"2rem 0",paddingBottom:"5rem"}} className="w-screen flex flex-col items-center gap-5 bg-gray-200">
            <div className="w-[40%] bg-white rounded-lg shadow-md shadow-gray-300 flex flex-col gap-3" style={{padding:"1.2rem"}}>
                <div className="w-full flex items-center gap-4">
                    <a href='/profile' className="w-[8.5%] h-[6.5vh] rounded-full border border-gray-800 overflow-hidden">
                        <img src={currentUser?.profile?.profile_img?.startsWith("i") ? import.meta.env.VITE_IMG_URL+currentUser?.profile?.profile_img : currentUser?.profile?.profile_img} className='w-full h-full object-cover' alt="" />
                    </a>
                    <button onClick={() => setActiveNewPost(true)} className="w-[91%] hover:bg-gray-300 active:bg-gray-400 text-left text-gray-600 bg-gray-200 rounded-full bg" style={{padding:"0.4rem 1rem"}}>
                        มีไรอยากแนะนำไหม? คุณ {currentUser?.profile?.fname}
                    </button>
                </div>  
                <hr />
                <div className="w-full flex items-center">
                    <button onClick={() => setActiveNewPost(true)} style={{padding:"0.5rem"}} className=' w-[50%] active:bg-gray-300 flex items-center justify-center gap-2 font-bold text-gray-700 rounded-lg hover:bg-gray-200'>
                        <FaImages className='text-xl text-green-700'/> รูปภาพ
                    </button>
                    <button onClick={() => setAvtiveEmotion(true)} style={{padding:"0.5rem"}} className=' w-[50%] active:bg-gray-300 flex items-center justify-center gap-2 font-bold text-gray-700 rounded-lg hover:bg-gray-200'>
                    <i class="fa-solid fa-face-smile text-xl text-yellow-500"></i> ความรู้สึก
                    </button>
                </div>
            </div>

            {
                blogsData.map((item) => {
                    return <div key={item?._id} style={{padding:"1rem"}} className="shadow-md shadow-gray-300 rounded-lg bg-white w-[40%] flex flex-col gap-3">
                                <div className="w-full flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img onClick={() => item?.user_id === currentUser?._id ? location.href = '/profile' : ''} src={
                                            allUser.find((u) => u._id === item?.user_id)?.profile?.profile_img.startsWith("i")
                                            ? import.meta.env.VITE_IMG_URL+allUser.find((u) => u._id === item?.user_id)?.profile?.profile_img
                                            : allUser.find((u) => u._id === item?.user_id)?.profile?.profile_img
                                            || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                        } className='w-[3vw] h-[6.3vh] border border-gray-700 rounded-full cursor-pointer object-cover' alt="" />
                                        <span className='flex flex-col relative'>
                                            <label onClick={() => item?.user_id === currentUser?._id ? location.href = '/profile' : ''} htmlFor="" className='font-bold hover:underline cursor-pointer'>{allUser.find((u => u?._id === item?.user_id))?.profile?.fname || 'ไม่พบชื่อ'} {allUser.find((u => u?._id === item?.user_id))?.profile?.lname}</label>
                                            <label htmlFor="" className='text-[0.8rem] text-gray-600'>{postTime(item?.createdAt)}</label>
                                            {
                                                currentUser._id === item?.user_id &&
                                                <>
                                                <button onClick={() => setActiveManagePost(prev => prev === "" ? item?._id : '')} className='absolute top-0 right-[-2rem] active:scale-90 active:bg-gray-300 rounded-md hover:bg-gray-200 text-[0.8rem]' style={{padding:"0.2rem 0.6rem"}}>
                                                    {activeManagePost === item?._id ? <i className='fas fa-close'></i> : <i class="fa-solid fa-ellipsis-vertical"></i>}
                                                </button>
                                                <span style={{padding:"0.35rem"}} className={`transition-all duration-200 ${activeManagePost === item?._id ? 'z-20 opacity-100' : 'z-[-1] opacity-0'} bg-white absolute top-0 right-[-6.8rem] flex flex-col border shadow-md shadow-gray-400 rounded-lg`}>
                                                    <button onClick={() => openEditPost(item)} style={{padding:"0.3rem"}} className='rounded-md text-[0.9rem] text-left w-[4vw] hover:bg-gray-200'>แก้ไข</button>
                                                    <button onClick={() => deletePost(item?._id)} style={{padding:"0.3rem"}} className='rounded-md text-[0.9rem] text-left w-[4vw] hover:bg-gray-200'>ลบ</button>
                                                </span>
                                                </>
                                            }
                                        </span>
                                    </div>
                                   <label htmlFor="" className='text-[0.8rem] text-gray-700'>{item?.emotion && 'กำลังรู้สึก'} <span className='text-lg'>{item?.emotion?.char}</span></label>
                                </div>

                                <p className='w-full leading-relaxed text-[0.9rem]'>
                                    {
                                        item?.text?.length > 400 ?
                                        item?.text?.slice(0,395)+"  ...อ่านเพิ่มเติม"
                                        : item?.text
                                    }
                                </p>
                                {
                                    item?.images?.length > 0 &&
                                    <div className="w-full h-[60vh] border border-gray-200">
                                    {
                                        item?.images?.length <= 1 &&
                                        <img src={import.meta.env.VITE_IMG_URL+item?.images[0]} alt={item?.user_id} className=' cursor-pointer w-full h-full object-cover'/>
                                    }
                                    {
                                        item?.images?.length > 1 &&
                                        <div className="w-full h-full flex gap-2">
                                            <div className='w-[65%] h-full cursor-pointer'>
                                                <img src={import.meta.env.VITE_IMG_URL+item?.images[0]} alt={item?.user_id} className='w-full h-full object-cover'/>
                                            </div>
                                            <div className="w-[35%] h-full flex flex-col gap-1">
                                                {
                                                    item?.images?.map((img,index) => {
                                                        if(index < 1 || index > 3)return;
                                                        return <div className="relative cursor-pointer w-full h-[25vh] border border-gray-200">
                                                            {
                                                                index === 3 && item?.images?.length > 4 &&
                                                                <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center text-2xl text-white font-bold">
                                                                    <label htmlFor="">+{(item.images.length) - 4}</label>
                                                                </div>
                                                            }
                                                                    <img src={import.meta.env.VITE_IMG_URL+img} alt={img} className='w-full h-full object-cover' />
                                                                </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                }

                                <div style={{marginTop:"0.3rem"}} className='w-full flex flex-col gap-3'>
                                    <div style={{paddingBottom:"0.25rem"}} className="border-b flex items-center justify-between">
                                        <label htmlFor="" className='text-[0.8rem] text-gray-600'>
                                            ถูกใจ 
                                            {
                                                ' '+item?.likes?.filter((l) => l !== "")?.length
                                            }
                                        </label>
                                        <label htmlFor="" className='text-[0.8rem] text-gray-600'>
                                            ความคิดเห็น 
                                            {
                                                ' '+item?.comment_id?.filter((l) => l !== "")?.length
                                            }
                                        </label>
                                        <label htmlFor="" className='text-[0.8rem] text-gray-600'>
                                            รายงาน 
                                            {
                                                ' '+item?.report?.filter((l) => l !== "")?.length
                                            }
                                        </label>
                                    </div>
                                    <div className="flex items-cent w-full justify-between">
                                        <button onClick={() => handleLikes(item)} disabled={likeLoading.id === item?._id && likeLoading.loading} className={`${item?.likes?.includes(currentUser?._id) ? 'text-blue-500' : ''} active:scale-95 text-lg w-[50%] hover:text-blue-600 rounded-md flex items-center justify-center hover:bg-gray-200`} style={{padding:"0.6rem"}}>
                                        {
                                            likeLoading.loading && likeLoading.id === item?._id ?
                                            <>
                                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                            </> 
                                            : <FaThumbsUp/>
                                        }
                                        </button>
                                        <button onClick={() => {setOpenComment(true),setActiveBlog(item)}} className='active:scale-95 text-lg w-[50%] hover:text-green-600  rounded-md flex items-center justify-center hover:bg-gray-200' style={{padding:"0.6rem"}}>
                                            <FaComment/>
                                        </button>
                                        <button onClick={() => {setOpenReport(true),setActiveBlog(item)}} className='active:scale-95 text-lg w-[50%] hover:text-red-600  rounded-md flex items-center justify-center hover:bg-gray-200' style={{padding:"0.6rem"}}>
                                            <FaFlag/>
                                        </button>
                                    </div>
                                </div>
                            </div> 
                    
                })
            }

       </div>
    </>
  )
}

export default CommunityPage