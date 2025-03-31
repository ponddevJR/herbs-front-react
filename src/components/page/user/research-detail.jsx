import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../../layout/navbar';
import { getAllResearch, updateViews } from '../../function/research';
import { FaComment, FaEye, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { getSingle } from '../../function/user';
import {getHerbs} from "../../function/herbs";
import {getAllCategories} from "../../function/category";
import {getAllNews, updateViewsAndRedirect} from "../../function/news";
import axios from 'axios';
import Footer from '../../layout/footer';
import Comment from "../../layout/comment";

const ResearchDetail = () => {
    const params = useParams();
    const [research,setResearch] = useState({});
    const [preview,setPreview] = useState("");
    const [likes,setLikes] = useState([]);
    const [dislikes,setDislikes] = useState([]);
    const [user,setUser] = useState({});
    const [herbs,setHerbs] = useState([]);
    const [categoiries,setCategories] = useState([]);
    const [news,setNews] = useState([]);
    const [otherResearch,setOtherResearch] = useState([]);
    const [herbSlide,setHerbSlide] = useState(0);
    const [newsSlide,setNewsSlide] = useState(0);
    const [researchSlide,setResearchSldie] = useState(0);

    const fetchResearchs = () => {
        getAllResearch().then((res) => {
            if(!res?.data?.data)return;
            const data = res?.data?.data.find((item) => item._id === params.id);
            setResearch(data);
            setPreview(data?.imgs[0]);
            setLikes(data?.likes);
            setDislikes(data?.dislikes);

            const filter = res?.data?.data.filter((item) => {
                const herbsId = item?.herbs_id;
                const filterData = herbsId.filter((h) => data?.herbs_id?.includes(h));
                return filterData.length > 0;
            })
            setOtherResearch(filter.filter((item) => item._id !== data._id).length > 0 ? filter.filter((item) => item._id !== data._id) : res?.data?.data);
        });
    }

    useEffect(() => {
        try {
            fetchResearchs();
            getSingle().then((res) => {
                if(!res)return;
                setUser(res);
            });
            getHerbs().then((res) => {
                if(!res?.data?.herbs)return;
                setHerbs(res?.data?.herbs);
            });
            getAllCategories().then((res) => {
                if(!res?.data?.categories)return;
                setCategories(res?.data?.categories);
            });
            getAllNews().then((res) => {
                if(!res?.data?.news)return;
                const data = res?.data?.news;
                const filterNews = data.filter((item) => {
                    const herbsId = item.herbs_id;
                    const filter = herbsId.filter((h) => research?.herbs_id?.includes(h));
                    return filter.length > 0;
                })
                setNews(filterNews.length > 0 ? filterNews : data);
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleLike = () => {  
        const updateLikes = likes.find((item) => item === user?._id) ? likes.filter((item) => item !== user?._id) : [...likes,user?._id];
        setLikes(updateLikes);
        let updateDislike = dislikes;
        if(dislikes.find((item) => item === user?._id)){
            updateDislike = dislikes.filter((item) => item !== user?._id);
            setDislikes(updateDislike);
        }   
        updateAction({likes:updateLikes,dislikes:updateDislike});
    }

    const hadleDislike = () => {
        const updateDislike = dislikes.find((item) => item === user?._id) ? dislikes.filter((item) => item !== user?._id) : [...dislikes,user?._id];
        setDislikes(updateDislike);
        let updateLikes = likes;
        if(likes.find((item) => item === user?._id)){
            updateLikes = likes.filter((item) => item !== user?._id);
            setLikes(updateLikes);
        }
        updateAction({dislikes:updateDislike,likes:updateLikes});
    }

    const updateAction = (newValue) => {
        try {
            const data = {...research,...newValue};
            axios.put(`${import.meta.env.VITE_API_URL}/updateactionresearch`,data);
            setResearch(data);
        } catch (error) {
            console.error(error);
        }
    }

    const slide = (state,setState,el,arr) => {
        const newIndex = state + 1;
        const maxIndex = Math.ceil(arr.length / el); // ป้องกันค่า index ติดลบ
        setState(newIndex >= maxIndex ? 0 : newIndex);
      };

  return (
    <>
        <Navbar/>
        <div style={{marginTop:"7rem",marginBottom:"2rem"}} className='w-screen items-center flex flex-col gap-[5rem]'>
            <div className="w-[55%] flex flex-col gap-6">
                <label htmlFor="" style={{paddingBottom:"1rem"}} className='border-b-4 border-green-700 text-3xl font-bold'>
                    งานวิจัย
                </label>
                <div className="w-full flex gap-10">
                    <div className='w-[50%] flex flex-col gap-2'>
                        <div className="w-full h-[60vh] border rounded-md overflow-hidden">
                            <img src={preview.startsWith("i") ? `${import.meta.env.VITE_IMG_URL}${preview}` : preview} className='w-full h-full object-cover' alt="" />
                        </div>

                                {
                                    research?.imgs?.length > 1 
                                    && 
                                    <div className='w-full h-[15vh] overflow-auto relative'>
                                        <div style={{padding:"0.3rem"}} className="w-auto h-[95%] flex gap-3 absolute top-0 lef-0">
                                        {   research?.imgs?.map((item) => {
                                            return <div className="w-[8vw] h-full rounded-md transition-all duration-200 overflow-hidden hover:ring-2 hover:ring-green-900">
                                                    <img src={item.startsWith("i") ? import.meta.env.VITE_IMG_URL+item : item} className='w-full h-full object-cover' alt="" />
                                                    </div>
                                        })
                                    }
                                        </div>
                                    </div>
                                }
                            
                    </div>
                    <div className='w-[50%] flex flex-col justify-between'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="" className='text-xl font-bold leading-relaxed'>
                                {research?.title}
                            </label>
                            <label htmlFor="" className='text-[1rem] text-gray-600'>
                                ผู้เขียน : {research?.author}
                            </label>
                            <label htmlFor="" className='text-[1rem] text-gray-600'>
                                วัตถุประสงค์ : {research?.objective}
                            </label>
                            <label htmlFor="" className='text-[1rem] text-gray-600'>
                                ปี : {research?.year}
                            </label>
                            <label htmlFor="" className='text-[1rem] text-gray-600'>
                                แหล่งที่มา : <a href={research?.source} className='text-blue-600 underline'>คลิก</a>
                            </label>
                        </div>
                        <div className='w-full items-center flex justify-between'>
                            <label htmlFor="" className='text-[1rem] flex items-center gap-1'><FaEye/> : {research?.views}</label>
                            <div className="flex items-center gap-2">
                                <button onClick={handleLike} style={{padding:"0.35rem 0.5rem"}} className={`${likes.includes(user?._id) && 'text-green-600'} rounded-lg active:scale-95 hover:bg-gray-200 flex items-center gap-2`}>
                                    <FaThumbsUp/> ถูกใจ : {likes.filter((item) => item !== "").length}
                                </button>
                                <button onClick={hadleDislike} style={{padding:"0.35rem 0.5rem"}} className={`${dislikes.includes(user?._id) && 'text-red-600'} rounded-lg active:scale-95 hover:bg-gray-200 flex items-center gap-2`}>
                                    <FaThumbsDown/> ไม่ถูกใจ : {dislikes.filter((item) => item !== "").length}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative w-[65%] flex flex-col gap-4">  
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className=' border-b-4 border-green-700 w-full flex justify-between items-center text-xl font-bold'>
                    สมุนไพรที่เกี่ยวข้องกับงานวิจัยนี้ ({herbs.filter((item) => research?.herbs_id?.includes(item._id)).length})
                    <a href="" style={{padding:"0.35rem 0.5rem"}} className="transition-all duration-200 rounded-lg hover:bg-green-900 hover:text-white font-normal text-[0.9rem] flex gap-1 items-center">
                        ดูสมุนไพรทั้งหมด <i className='fas fa-chevron-right'></i>
                        </a>
                </label>
                {
                        herbs.filter((item) => research?.herbs_id?.includes(item._id)).length > 3 &&   <button onClick={() => slide(herbSlide,setHerbSlide,3,herbs)} style={{padding:"0.5rem 0.85rem"}} className='shadow-md rounded-full hover:bg-green-950 hover:text-white border border-gray-500 absolute top-[10rem] right-[-3rem] z-30'><i className='fas fa-chevron-right'></i></button>
                }
                <div className="w-full relative overflow-auto h-[50vh]">
                    <div style={{transform:`translateX(-${herbSlide * 998}px)`}} className="w-auto h-[95%] flex gap-4 absolute top-0 left-0 transition-all duration-500">
                        {
                            herbs?.filter((item) => research?.herbs_id?.includes(item._id)).map((item) => {
                                return <a href={`/herbdetail/${item?._id}`} key={item?._id} style={{paddingBottom:"0.5rem"}} className="border-b-4 border-green-700 cursor-pointer hover:bg-gray-200 transition-all duration-200 w-[18vw] h-full flex flex-col gap-1">
                                            <div className="rounded-tr-lg rounded-tl-lg overflow-hidden w-full h-[45%] border">
                                                <img src={item?.imgs[0].startsWith("i") ? import.meta.env.VITE_API_URL+item?.imgs[0] : item?.imgs[0]} className='w-full h-full object-cover' alt="" />
                                            </div>
                                            <div className="flex flex-col gap-1" style={{padding:"0.3rem"}}>
                                                <label htmlFor="" className='text-xl font-bold'>
                                                    {item?.name_th}
                                                </label>
                                                <label htmlFor="" className='text-[0.9rem] text-gray-600'>
                                                    {
                                                        categoiries?.filter((category) => item?.categories.includes(category._id)).map((category) => category.ctg_name).join(", ").slice(0,35)+"..."
                                                    }
                                                </label>
                                                <p className='text-[0.9rem]'>
                                                    {
                                                        item?.benefits?.length > 120 ? item?.benefits.slice(0,120)+"..." : item?.benefits
                                                    }
                                                </p>
                                                <label htmlFor="" className='text-[0.85rem] text-gray-600'>
                                                    แก้ไขล่าสุด : {new Date(item?.updatedAt).toLocaleDateString('th-TH')} {new Date(item?.updatedAt).toLocaleTimeString('th-TH')}
                                                </label>
                                            </div>
                                        </a>
                            })
                        }
                    </div>
                </div>
                <div className="relative w-full flex flex-col gap-4 ">
                    {
                        news.length > 3 && 
                         <button onClick={() => slide(newsSlide,setNewsSlide,3,news)} className='absolute top-[12rem] right-[-3rem] rounded-full border border-gray-500 shadow-md hover:bg-green-950 hover:text-white cursor-pointer' style={{padding:"0.5rem 0.85rem"}}>
                            <i className='fas fa-chevron-right'></i>
                        </button>
                    }
                    <label style={{padding:"0.3rem"}} htmlFor="" className='w-full flex items-center justify-between text-xl font-bold border-b-4 border-green-700'>
                        ข่าวที่เกี่ยวข้อง ({news.length})
                        <span>
                            <a href="" style={{padding:"0.35rem 0.5rem"}} className="transition-all duration-200 rounded-lg hover:bg-green-900 hover:text-white font-normal text-[0.9rem] flex gap-1 items-center">
                                ดูข่าวทั้งหมด <i className='fas fa-chevron-right'></i>
                            </a>
                        </span>
                    </label>
                    {
                        news.length > 3 &&   <button style={{padding:"0.5rem 0.85rem"}} className='shadow-md rounded-full hover:bg-green-950 hover:text-white border border-gray-500 absolute top-[10rem] right-[-3rem] z-30'><i className='fas fa-chevron-right'></i></button>
                    }
                  
                    <div className="w-full h-[45vh] relative overflow-hidden">
                      <div style={{transform:`translateX(-${newsSlide * 998}px)`}} className="w-auto h-[95%] flex gap-4 absolute top-0 left-0 transition-all duration-500">
                        {
                          news?.map((item) => {
                            return <a onClick={() => updateViewsAndRedirect(item)} href={`/newsdetail/${item?._id}`} key={item?._id} style={{paddingBottom:"0.1rem"}} className='w-[18vw] h-full flex flex-col gap-1 border-b-4 border-green-700 cursor-pointer hover:bg-gray-200 transition-all duration-200'>
                                        <div className="w-full h-[45%]">
                                            <img className='w-full h-full object-cover' src={item?.img_url[0].startsWith("i") ? import.meta.env.VITE_IMG_URL+item?.img_url[0] : item?.img_url[0]} alt="" />
                                        </div>
                                        <div className="w-full flex flex-col h-[55%] justify-between" style={{padding:"0.25rem"}}>
                                            <div className='w-full flex gap-1 flex-col'>
                                                <label htmlFor="" className='text-xl font-bold'>
                                                    {
                                                        item?.title.length > 65 ? item?.title.slice(0,65)+"..." : item?.title
                                                    }
                                                </label>
                                                <label htmlFor="" className='text-[0.85rem] text-gray-600'>
                                                    ข่าวประจำวันที่ : {new Date(item?.createdAt).toLocaleDateString('th-TH')} {new Date(item?.createdAt).toLocaleTimeString('th-TH')}
                                                </label>
                                            </div>
                                            <div style={{padding:"0 0 0.5rem 0.35rem"}} className="w-full flex items-center justify-between">
                                                <label htmlFor="" className='text-[0.9rem] flex items-center gap-1 text-gray-700'>
                                                    <FaEye/> : {item?.views}
                                                </label>
                                                <span className='flex items-center gap-3.5'>
                                                    <label
                                                      htmlFor=""
                                                      className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                                                    >
                                                      <FaComment /> :{" "}
                                                      {item?.comment_id?.filter((item) => item !== "").length}
                                                    </label>
                                                    <label htmlFor="" className='text-[0.9rem] flex items-center gap-1 text-gray-700'>
                                                        <FaThumbsUp/> : {item?.likes.filter((item) => item !== "").length}
                                                    </label>
                                                    <label htmlFor="" className='text-[0.9rem] flex items-center gap-1 text-gray-700'>
                                                        <FaThumbsDown/> : {item?.dislikes.filter((item) => item !== "").length}
                                                    </label>
                                                </span>
                                            </div>
                                                
                                        </div>
                                    </a>
                          })

                        }
                    </div>  
                    </div>
                    
                </div>
                <div className="w-full flex flex-col relative gap-4 ">
                    {
                        otherResearch.length > 3 && 
                         <button onClick={() => slide(researchSlide,setResearchSldie,3,otherResearch)} className='absolute top-[12rem] right-[-3rem] rounded-full border border-gray-500 shadow-md hover:bg-green-950 hover:text-white cursor-pointer' style={{padding:"0.5rem 0.85rem"}}>
                            <i className='fas fa-chevron-right'></i>
                        </button>
                    }
                    <label style={{padding:"0.3rem"}} htmlFor="" className='w-full flex items-center justify-between text-xl font-bold border-b-4 border-green-700'>
                        งานวิจัยอื่นๆ
                        <span>
                            <a href="" style={{padding:"0.35rem 0.5rem"}} className="transition-all duration-200 rounded-lg hover:bg-green-900 hover:text-white font-normal text-[0.9rem] flex gap-1 items-center">
                                ดูงานวิจัยทั้งหมด <i className='fas fa-chevron-right'></i>
                            </a>
                        </span>
                    </label>
                    <div className="w-full h-[45vh] relative overflow-hidden">
                      <div style={{padding:"0.5rem",transform:`translateX(-${researchSlide * 998}px)`}} className="transition-all duration-500 w-auto h-[95%] flex gap-4 absolute top-0 left-0">
                        {
                            otherResearch?.map((item) => {
                                return <a onClick={() => updateViews(item)} style={{paddingBottom:"0.3rem"}} className="w-[18vw] h-full flex flex-col gap-1 border-b-4 border-green-700 cursor-pointer hover:shadow-lg transition-all duration-200">
                                            <div className="w-full h-[45%]">
                                                <img src={item?.imgs[0].startsWith("i") ? import.meta.env.VITE_IMG_URL+item?.imgs[0] : item?.imgs[0]} className='w-full h-full object-cover' alt="" />
                                            </div>
                                            <div className='w-full h-[60%] justify-between flex flex-col gap-1' style={{padding:" 0 0 0.25rem 0.25rem"}}>
                                                <div className='w-full flex gap-1 flex-col'>
                                                    <label htmlFor="" className='text-xl font-bold'>
                                                        {item?.title.length > 65 ? item?.title.slice(0,65)+"..." : item?.title}
                                                    </label>
                                                    <label htmlFor="" className='text-[0.9rem] text-gray-600'>
                                                        {item?.author?.length > 35 ? item?.author.slice(0,35)+"..." : item?.author}
                                                    </label>
                                                </div>
                                                <div className="w-full flex items-center justify-between">
                                                    <label htmlFor="" className='flex items-center gap-1 text-[0.9rem] text-gray-700'>
                                                        <FaEye/> : {item?.views}
                                                    </label>
                                                    <span className='flex items-center gap-3.5'>
                                                        <label
                                                          htmlFor=""
                                                          className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                                                        >
                                                          <FaComment /> :{" "}
                                                          {item?.comment_id?.filter((item) => item !== "").length}
                                                        </label>
                                                        <label htmlFor="" className='text-[0.9rem] flex items-center gap-1 text-gray-700'>
                                                            <FaThumbsUp/> : {item?.likes.filter((item) => item !== "").length}
                                                        </label>
                                                        <label htmlFor="" className='text-[0.9rem] flex items-center gap-1 text-gray-700'>
                                                            <FaThumbsDown/> : {item?.dislikes.filter((item) => item !== "").length}
                                                        </label>
                                                    </span>
                                                </div>
                                            </div>
                                       </a>
                            })
                        }
                     </div>  
                    </div>
                </div>
            </div>
            <div className="w-[65%]">
                <Comment type={"researchs"} updateData={() => fetchResearchs()} commentList={research?.comment_id} mainId={research?._id}/>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default ResearchDetail