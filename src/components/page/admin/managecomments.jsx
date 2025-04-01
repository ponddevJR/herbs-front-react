
import { getAllComments, removeComment } from '@/components/function/comments';
import { getAll } from '@/components/function/user';
import AdminLoading from '@/components/layout/admin/adminloading';
import React, { useEffect, useState } from 'react'
import { FaEye, FaFilter, FaFlag, FaListAlt, FaSearch, FaThumbsDown, FaThumbsUp, FaTrash } from 'react-icons/fa'
import Detail from './managecomments-components/detail';
import CommentFilter from './managecomments-components/filter';

const ManageComments = () => {
    const [originalComments,setOriginalComment] = useState([]);
    const [comments,setComments] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [allUsers,setAllUsers] = useState([]);
    const [page,setPage] = useState(1);
    const [start,setStart] = useState(0);
    const [end,setEnd] = useState(5);
    const [activeDetail,setActiveDetail] = useState({active:false,comment:{}});
    const [sortList,setSortList] = useState({active:false,type:"ความคิดเห็นใหม่"});
    const [searchValue,setSearchValue] = useState("");
    const [activeFilter,setActiveFilter] = useState(false);

    const fetchComment = async () => {
        setIsLoading(true);
        try {
            const data = await getAllComments();
            const user = await getAll();
            if(!data?.data?.comments || !user?.data?.users)return;

            setComments(data?.data?.comments.slice().reverse());
            setOriginalComment(data?.data?.comments);
            setAllUsers(user?.data?.users);
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }
 
    useEffect(() => {
        fetchComment();
    },[]);

    const forward = () => {
        if(page >= comments.length / 5){
            setPage(1);
            setStart(0);
            setEnd(5);
        }else{
            setPage(prev => prev + 1);
            setStart(end);
            setEnd(prev => prev + 5);
        }
    }

    const prev = () => {
        if(page <= 1)return;
        setPage(prev => prev - 1);
        setStart(prev => prev - 5);
        setEnd(prev => prev - 5);
    }

    const deleteComment = async (id) => {
        const {isConfirmed} = await Swal.fire({
            title:"แจ้งเตือน",
            text:"ต้องการลบความคิดเห็นนี้หรือไม่?",
            icon:"question",
            showDenyButton:true,
            denyButtonText:"ยกเลิก",
            confirmButtonText:"ลบ"
        })
        if(!isConfirmed)return;

        setIsLoading(true);
        try {
            const remove = await removeComment(id);
            Swal.fire("สำเร็จ",remove?.data?.mes,"success");
            fetchComment();
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
    }

    const searchComment = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if(value === "" || value.length < 1){
            setComments(originalComments);
        }else{
            setComments(originalComments.filter((c) => 
                c.content.toLowerCase().includes(value) || 
                allUsers.find((u) => u._id === c.user_id).profile.fname.toLowerCase().includes(value) ||
                allUsers.find((u) => u._id === c.user_id)._id.toLowerCase().includes(value)
            ))
        }
        setPage(1);
        setStart(0);
        setEnd(5);
    }

    const getFilter = (data) => {
        setComments(data);
        setPage(1);
        setStart(0);
        setEnd(5);
    }

    const reloadPage = () => {
        setPage(1);
        setStart(0);
        setEnd(5);
        fetchComment();
    }

    const sortingData = (type) => {
        switch(type){
            case "ความคิดเห็นใหม่" : 
            setComments(prev => prev.sort((a,b) => new Date(b) - new Date(a) )) ;
            break;
            case "ถูกรายงาน" : 
            setComments(prev => prev.sort((a,b) => (b.report.length || 0) - (a.report.length || 0))) ;
            break;
            case "ถูกใจมากที่สุด" :
            setComments(prev => prev.sort((a,b) => (b.likes.length || 0) - (a.likes.length || 0))) ;
            break;
            case "ไม่ถูกใจมากที่สุด" :
            setComments(prev => prev.sort((a,b) => (b.dislikes.length || 0) - (a.dislikes.length || 0))) ;
            break;
            default:
            break;
        }
        setSortList({active:false,type})
    }

  return (
    <div style={{marginTop:"1rem"}} className='w-full h-full flex flex-col gap-2 overflow-hidden rounded-tr-lg rounded-tl-lg'>
        {
            isLoading && <AdminLoading/>
        }
        {
            activeDetail.active && <Detail fetchComment={fetchComment} deleteComment={() => deleteComment(activeDetail.comment._id)} onclose={() => setActiveDetail({active:false,comment:{}})} allUsers={allUsers} comment={activeDetail.comment}/>
        }
        {
            activeFilter && <CommentFilter sendData={getFilter} comments={originalComments} onclose={() => setActiveFilter(false)}/>
        }
        <div className="w-full flex items-center justify-between">
            <div className="relative flex items-center gap-2">
                <button onClick={() => setActiveFilter(true)} style={{padding:"0.5rem"}} className='rounded-lg border border-gray-500 hover:bg-[#050a44] hover:text-white flex items-center gap-1'><FaFilter/> : กรอง</button>
                <button onClick={() => setSortList({...sortList,active:!sortList.active})} style={{padding:"0.5rem"}} className='rounded-lg border border-gray-500 hover:bg-[#050a44] hover:text-white flex items-center gap-1'><FaListAlt/> : {sortList.type}</button>
                <button onClick={reloadPage} style={{padding:"0.5rem"}} className='rounded-lg border border-gray-500 hover:bg-[#050a44] hover:text-white flex items-center gap-1'><i className='fas fa-rotate-right'></i> : รีโหลด</button>
                <div style={{padding:"0.35rem"}} className={`${sortList.active ? "z-1 opacity-100" : "z-[-1] opacity-0"}w-[8vw] absolute bottom-[-6rem] left-[6rem] border shadow-lg shadow-gray-800 rounded-lg bg-white flex flex-col`}>
                <button onClick={() => sortingData("ความคิดเห็นใหม่")} style={{padding:"0.35rem"}} className='text-left text-[0.85rem] hover:bg-gray-200'>ความคิดเห็นใหม่</button>
                    <button onClick={() => sortingData("ถูกรายงาน")} style={{padding:"0.35rem"}} className='text-left text-[0.85rem] hover:bg-gray-200'>ถูกรายงาน</button>
                    <button onClick={() => sortingData("ถูกใจมากที่สุด")} style={{padding:"0.35rem"}} className='text-left text-[0.85rem] hover:bg-gray-200'>ถูกใจมากที่สุด</button>
                    <button onClick={() => sortingData("ไม่ถูกใจมากที่สุด")} style={{padding:"0.35rem"}} className='text-left text-[0.85rem] hover:bg-gray-200'>ไม่ถูกใจมากที่สุด</button>
                </div>
            </div>
            <div style={{padding:"0.5rem 0.8rem"}} className="w-[40%] flex items-center gap-3 border-2 rounded-lg border-[#050a44]">
                <FaSearch/> <input value={searchValue} onChange={searchComment} type="text" className='w-[91%] outline-none border-none' placeholder='ค้นหาความคิดเห็น' />
            </div>
        </div>
        <div className="w-full h-[80%] rounded-tr-lg rounded-tl-lg overflow-hidden">
            <table className='w-full'>
                <thead>
                    <tr className='text-[0.9rem] bg-[#050a44] text-white text-center'>
                        <th style={{padding:"1rem 0"}}>รหัสผู้ใช้งาน</th>
                        <th>ผู้ใช้งาน</th>
                        <th>ชื่อ</th>
                        <th>ความคิดเห็น</th>
                        <th>ถูกใจ</th>
                        <th>ไม่ถูกใจ</th>
                        <th>โพสต์</th>
                        <th>แก้ไข</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        comments?.length > 0 ?
                            comments.slice(start,end).map((item,index) => {
                                return <tr key={item?._id} className='border-b border-gray-300 text-[0.85rem] transition-all duration-200 hover:bg-gray-200 cursor-pointer text-center'>
                                <td style={{padding:"0.8rem"}} className='relative'>
                                    {
                                        item?.report?.length > 0 && <span onClick={() => setActiveDetail({active:true,comment:item})} className='absolute top-1 left-0 rounded-md bg-red-600 text-white text-[0.75rem] flex gap-1 items-center' style={{padding:"0.1rem 0.35rem"}}><FaFlag/>({item?.report?.length})</span>
                                    }
                                    {allUsers.find((u) => u._id === item?.user_id)?._id?.slice(0,10)+'...'}
                                </td>
                                <td className=''>
                                    <div style={{padding:"0.8rem"}} className="flex items-center justify-center">
                                        <img src={allUsers.find((u) => u._id === item?.user_id)?.profile?.profile_img?.startsWith("i") ? 
                                        import.meta.env.VITE_IMG_URL+allUsers.find((u) => u._id === item?.user_id)?.profile?.profile_img : allUsers.find((u) => u._id === item?.user_id)?.profile?.profile_img
                                        || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} className='object-cover w-[3.3vw] h-[7vh] border border-gray-800 rounded-full' alt="" />
                                    </div>
                                </td>
                                <td className='font-bold'>
                                    {allUsers.find((u) => u?._id === item?.user_id)?.profile?.fname || 'ไม่พบชื่อ'}
                                </td>
                                <td className='text-left'>
                                    {
                                        item?.content?.length > 35 ? item?.content?.slice(0,35)+'...'
                                        : item?.content
                                    }
                                </td>
                                <td>
                                    {item?.likes?.filter((l) => l !== "")?.length} (คน)
                                </td>
                                <td>
                                    {item?.dislikes?.filter((l) => l !== "")?.length} (คน)
                                </td>
                                <td>
                                    {
                                        new Date(item?.createdAt).toLocaleDateString('th-TH')
                                    }
                                </td>
                                <td>
                                    {
                                        new Date(item?.updatedAt).toLocaleDateString('th-TH')
                                    }
                                </td>
                                <td>
                                    <div style={{padding:"0.35rem 0"}} className="flex flex-col gap-1 items-center justify-center">
                                        <button onClick={() => setActiveDetail({active:true,comment:item})} style={{padding:"0.35rem 0.6rem"}} className='shadow-md rounded-lg border hover:bg-[#050a44] text-[1.2rem] hover:text-white bg-white'><FaEye/></button>
                                        <button onClick={() => deleteComment(item?._id)} style={{padding:"0.35rem 0.6rem"}} className='shadow-md rounded-lg border hover:bg-red-600 text-[1.2rem] hover:text-white bg-white'><FaTrash/></button>
                                    </div>
                                </td>
                            </tr>
                            })
                        :<tr></tr>
                    }
                </tbody>
            </table>
        </div>
        <div style={{padding:"1rem"}} className="rounded-bl-lg rounded-br-lg w-full bg-[#050a44] text-white items-center justify-between flex">
            <label htmlFor="">ความคิดเห็นที่พบในระบบ {comments.length} ความคิดเห็น</label>
            <span className='flex items-center gap-8'>
                <button onClick={prev} className='text-2xl'><i className='fas fa-chevron-circle-left'></i></button>
                <label htmlFor="" className='text-xl'>{page}</label>
                <button onClick={forward} className='text-2xl'><i className='fas fa-chevron-circle-right'></i></button>
            </span>
        </div>
    </div>
  )
}

export default ManageComments