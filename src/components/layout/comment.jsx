import React, { useEffect, useState } from 'react'
import { FaEllipsisV, FaFlag, FaList, FaPen, FaThumbsDown, FaThumbsUp, FaTimes, FaTrash } from 'react-icons/fa'
import { getSingle,getAll } from '../function/user';
import AlertComment from './alertComment';
import { addComment, getAllComments, removeComment, updateComment, updateCommentContent } from '../function/comments';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import ReportComments from './report-comment';
import Loading from './loading';

dayjs.extend(relativeTime);
dayjs.locale("th");

const CommentTime = (createdAt) => {
    return dayjs(createdAt).fromNow();
};



const Comment = ({updateData,commentList,type,mainId}) => {
    const [user,setUser] = useState({});
    const [commentLoading,setCommentLoading] = useState(false);
    const [comment,setComment] = useState("");
    const [alertObj,setAlertObj] = useState({active:false,type:"",text:""});
    const navigate = useNavigate();
    const [commentsData,setCommentsData] = useState([]);
    const [allUsers,setAllUsers] = useState([]);
    const [activeCommentMenu,setActiveCommentMenu] = useState(null);
    const [editComment,setEditComment] = useState("");
    const [activeEdit,setActiveEdit] = useState(null);
    const [activeReport,setActiveReport] = useState({active:false,id:""});
    const [isLoading,setIsLoading] = useState(false);


    useEffect(() => {
        getSingle().then((res) => {
            if(!res)return;
            setUser(res);
        }).catch((err) => console.error(err));

        getAll().then((res) => {
            if(!res?.data?.users)return;
            setAllUsers(res?.data?.users);
        }).catch((err) => console.error(err));
    },[]);

    useEffect(() => {
            const timeout = setTimeout(() => {
                setAlertObj({...alertObj,active:false });
            }, 3500);
            return () => clearTimeout(timeout);
    }, [alertObj]);

    const fetchComments = async () => {
        try {
            const allComments = await getAllComments();
            const commentsArr = allComments?.data?.comments;
            const filter = commentsArr.filter((item) => commentList.includes(item._id));
            setCommentsData(filter);
        } catch (error) {
            console.error();
        }
    }
    
    useEffect(() => {
        fetchComments();
    },[commentList]);


    const sendComment = async () => {
        setCommentLoading(true);
        try {
            const sendComment = await addComment({type,mainId,user_id:user._id,content:comment});

            setAlertObj({active:true,type:"success",text:sendComment?.data?.mes});
            setComment("");
            updateData();
        } catch (error) {
            console.error(error);
            setAlertObj({active:true,type:"fail",text:"ไม่สามารถเพิ่มความคิดเห็นได้"})
        }finally{
            setCommentLoading(false);
        }
    }

    const handleLikes = (item) => {
        if(!user._id)return navigate("/login");
        let updateLikes = [];
        let updateDislikes = [...item.dislikes];
        if(item.dislikes.find((id) => id === user._id)){
            updateDislikes = item.dislikes.filter((item) => item !== user._id);
        }
        if(item.likes.find((l) => l === user._id)){
            updateLikes = item.likes.filter((item) => item !== user._id);
        }else{
            updateLikes = [...item.likes,user._id];
        }
        try {
            updateComment({...item,likes:updateLikes,dislikes:updateDislikes});
            updateData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDislike = (item) => {
        if(!user._id)return navigate("/login");
        let updateLikes = [...item.likes];
        let updateDislikes = [];
        if(item.likes.find((id) => id === user._id)){
            updateLikes = item.likes.filter((item) => item !== user._id);
        }
        if(item.dislikes.find((l) => l === user._id)){
            updateDislikes = item.dislikes.filter((item) => item !== user._id);
        }else{
            updateDislikes = [...item.dislikes,user._id];
        }
        try {
            updateComment({...item,likes:updateLikes,dislikes:updateDislikes});
            updateData();
        } catch (error) {
            console.error(error);
        }
    }

    const report = (id) => {
        if(!user._id)return navigate("/login");
        setActiveReport({active:true,id});
        setActiveCommentMenu(null);
    }

    const updateContent = async () => {
        setCommentLoading(true);
        try {
            const update = await updateCommentContent({id:activeEdit,content:editComment});
            if(update?.data?.err)return setAlertObj({active:true,type:"fail",text:update?.data?.err});

            setAlertObj({active:true,type:"success",text:update?.data?.mes});
            updateData();
            setActiveEdit(null);
            setEditComment("");
        } catch (error) {
            console.error(error);
            setAlertObj({active:true,type:"error",text:"เกิดข้อผิดพลาด โปรดลองอีกครั้ง"})
        }finally{
            setCommentLoading(false);
        }
    }

    const deleteComment = async () => {
        const {isConfirmed} = await Swal.fire({
            title:"แจ้งเตือน",
            text:"ต้องการลบความคิดเห็นของคุณหรือไม่?",
            icon:"question",
            showDenyButton:true,
            denyButtonText:"ยกเลิก",
            confirmButtonText:"ลบ"
        });
        if(!isConfirmed)return;

        setIsLoading(true);
        try {
            const deleting = await removeComment(activeCommentMenu);
            Swal.fire("สำเร็จ",deleting?.data?.mes,"success");
            setActiveCommentMenu(null);
            updateData();
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <div style={{marginTop:"3rem"}} className={`text-[0.9rem] w-full h-[100vh] flex flex-col gap-3 overflow-auto`}>
        {
            activeReport.active && <ReportComments onclose={() => setActiveReport({active:false,id:""})} id={activeReport.id}/>
        }
        {
            isLoading && <Loading/>
        }
        <div className="w-full flex items-center gap-6">
            <label htmlFor="" className='text-xl font-bold'>ความคิดเห็น {commentsData?.length} รายการ</label>
            <button className='flex gap-2 rounded-lg  text-gray-800 items-center hover:bg-gray-200 'style={{padding:"0.5rem 0.8rem"}}>
                <FaList/> เรียงตาม
            </button>
        </div>
        
        <div className="w-full flex justify-between gap-5 items-start">
        {
            user._id ? 
                <>
                 <a href='/profile' className='rounded-full w-[3.3vw] h-[6.7vh] border overflow-hidden'>
                    <img src={user?.profile?.profile_img?.startsWith("i") ? import.meta.env.VITE_IMG_URL+user?.profile?.profile_img : user?.profile?.profile_img} className='w-full h-full object-cover' alt="" />
                </a>
                <div className='w-[92%] flex flex-col gap-3'>
                    <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" style={{padding:"0.25rem"}} className={`text-[0.9rem] w-full outline-none border-b border-black`} placeholder='เพิ่มความคิดเห็น' name="" id="" />
                    <div className='w-full flex items-center gap-2 justify-end'>
                        <button style={{padding:"0.35rem 0.5rem"}} onClick={() => setComment("")} className='rounded-lg bg-gray-100 hover:bg-black hover:text-white'>ยกเลิก</button>
                        <button onClick={sendComment} disabled={comment === "" || commentLoading} style={{padding:"0.35rem 0.5rem"}} className={`rounded-lg ${comment !== "" && !commentLoading ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            {commentLoading ? "รอสักครู่..." : "ส่งความคิดเห็น"}
                        </button>
                    </div>
                </div>
                </>
            : <a style={{margin:"1rem 0"}} className='hover:text-blue-500 hover:underline' href='/login'>เข้าสู่ระบบเพื่อแสดงความคิดเห็น</a>
                    
        }

        </div> 

        {
            commentsData.length > 0
            ?
            commentsData?.map((item) => {
                return <div key={item?._id} className="w-full flex gap-5 relative">
                        <button  onClick={() => setActiveCommentMenu(prev => prev === item?._id ? "" : item?._id)} style={{padding:"0.3rem 0.25rem"}} className='active:-translate-y-1 z-20 rounded-md absolute top-2 right-2 hover:bg-gray-200 text-gray-700'>
                            {activeCommentMenu === item?._id ? <FaTimes/> : <FaEllipsisV/> }
                        </button>
                        {
                            item?.user_id === user._id ?
                            <span className={`${activeCommentMenu === item?._id ? "z-30 opacity-100" : "z-[-1] opacity-0"} transition-all duration-300 absolute bottom-[-2rem] right-3 rounded-lg border border-gray-400 bg-white`} style={{padding:"0.5rem"}}>
                                <button onClick={() => {setActiveEdit(item?._id),setEditComment(item?.content),setActiveCommentMenu(null)}} style={{padding:"0.35rem 0.8rem"}} className='rounded-lg hover:bg-gray-200 flex items-center gap-3 text-[0.85rem]'><FaPen/> แก้ไข</button>
                                <button onClick={deleteComment} style={{padding:"0.35rem 0.8rem"}} className='rounded-lg hover:bg-gray-200 flex items-center gap-3 text-[0.85rem]'><FaTrash/> ลบ</button>
                            </span>
                            :
                            <span className={`${activeCommentMenu === item?._id ? "z-30 opacity-100" : "z-[-1] opacity-0"} transition-all duration-300 absolute bottom-0 right-3 rounded-lg border border-gray-400 bg-white`} style={{padding:"0.5rem"}}>
                                <button onClick={() => report(item?._id)} style={{padding:"0.35rem"}} className='rounded-lg hover:bg-gray-200 flex items-center gap-2 text-[0.85rem]'><FaFlag/> รายงาน</button>
                            </span>
                        }
                        <a href='' className='rounded-full w-[3.3vw] h-[6.7vh] border overflow-hidden'>
                            <img src={allUsers?.find((u) => u?._id === item?.user_id)?.profile?.profile_img?.startsWith("i") ?
                                import.meta.env.VITE_IMG_URL+allUsers?.find((u) => u?._id === item?.user_id)?.profile?.profile_img :
                                allUsers?.find((u) => u?._id === item?.user_id)?.profile?.profile_img
                                || 'https://www.shutterstock.com/image-vector/profile-default-avatar-icon-user-600nw-2463844171.jpg'} className='w-full h-full object-cover' alt="" />
                        </a>
                        <div className='relative w-[85%] flex flex-col gap-2'>
                            <div className='w-full flex gap-2 items-end'>
                                <label htmlFor="" className='font-bold text-[0.85rem]'>{allUsers?.find((u) => u?._id === item?.user_id)?.profile?.fname} (<small className='font-normal text-gray-700'>{
                                    allUsers?.find((u) => u?._id === item?.user_id)?.role === 'normal' ? "สมาชิก"
                                    : allUsers?.find((u) => u?._id === item?.user_id)?.role === 'admin' ? "ผู้ดูแลระบบ"
                                    : allUsers?.find((u) => u?._id === item?.user_id)?.role === 'medic' ? "แพทย์" : 'นักวิจัย'
                                }</small>)
                                </label>
                                <label htmlFor="" className='text-gray-600 text-[0.75rem]'>{CommentTime(item?.createdAt)}</label>
                            </div>
                            {
                                activeEdit === item?._id ?
                                <input type="text" value={editComment} onChange={(e) => setEditComment(e.target.value)} style={{padding:"0.35rem"}} className='border-b outline-none' />
                                :   
                                <p className='w-full leading-relaxed text-[0.8rem]'>
                                {
                                
                                    item?.content?.length > 200 ? 
                                    item?.content?.slice(0,197)+'...' : item?.content
                                }
                            </p>
            
                            }
                            <div className='flex items-center gap-2'>
                                {
                                    activeEdit === item?._id ? 
                                    <>
                                    <button onClick={updateContent} disabled={commentLoading} style={{padding:"0.3rem"}} className='rounded-lg text-[0.8rem] bg-black text-white'>{commentLoading ? "รอสักครู่..." : "บันทึก"}</button>
                                    <button onClick={() => {setActiveEdit(null),setActiveCommentMenu(null)}} style={{padding:"0.3rem"}} className='rounded-lg text-[0.8rem] hover:bg-red-500 bg-gray-400 text-white'>ยกเลิก</button>
                                    </>
                                    :
                                    <>
                                     <span className='flex text-[0.8rem] items-center'>
                                        <button onClick={() => handleLikes(item)} style={{padding:"0.5rem"}} className={`${item?.likes.includes(user?._id) && "text-blue-500"} active:scale-95 text-[0.9rem] rounded-full hover:bg-gray-200`}>
                                            <FaThumbsUp/> 
                                        </button>
                                        <label htmlFor="" className='text-gray-600'>{item?.likes?.filter((item) => item !== "")?.length}</label>
                                    </span>
                                    <button onClick={() => handleDislike(item)} style={{padding:"0.5rem"}} className={`${item?.dislikes.includes(user?._id) && "text-red-500"} active:scale-95 text-[0.9rem] rounded-full hover:bg-gray-200`}>
                                        <FaThumbsDown/> 
                                    </button>
                                    {/* <button style={{padding:"0.35rem"}} className='active:scale-95 text-[0.85rem] rounded-lg hover:bg-gray-200'>
                                        ตอบกลับ
                                    </button> */}
                                    </>
                                }
                                
                            </div>
                        </div>
                    </div> 
            })
            :
            <label htmlFor="">ยังไม่มีการแสดงความคิดเห็น</label>
        }
        <AlertComment {...alertObj}/>
    </div>
  )
}

export default Comment