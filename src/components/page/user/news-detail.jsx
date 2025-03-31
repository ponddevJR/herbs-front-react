import React, { useEffect, useState } from 'react'
import Navbar from '../../layout/navbar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../../layout/loading';
import { getAllNews, getOneNews, updateLikesOrDisLikes, updateViewsAndRedirect } from '../../function/news';
import DOMpurify from "dompurify";
import { FaComment, FaEye, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import {getSingle} from "../../function/user";
import {getHerbs} from "../../function/herbs";
import { getAllCategories } from '../../function/category';
import { getAllResearch, updateViews } from '../../function/research';
import Footer from '../../layout/footer';
import Comment from "../../layout/comment";

const NewsDetail = () => {
    const [isLoading,setIsLoading] = useState(false);
    const [user,setUser] = useState({});
    const params = useParams();
    const navigate = useNavigate();
    const [news,setNews] = useState({});
    const [mainImg,setMainImg] = useState("");
    const [likes,setLikes] = useState(0);
    const [disLikes,setDisLikes] = useState(0);
    const [likeUsers,setLikeUser] = useState([]);
    const [dislikesUser,setDisLikesUser] = useState([]);
    const [aboutHerbs,setAboutHerb] = useState([]);
    const [categories,setCategories] = useState([]);
    const [allNews,setAllNews] = useState([]);
    const [researchs,setResearchs] = useState([]);
    const [researchSlide,setResearchSldie] = useState(0);
    const [newsSlide,setNewsSlide] = useState(0);
    const [herbSlide,setHerbSlide] = useState(0);

    const getData = async () => {
        const id = params.id;
        try {
            const getOne = await getOneNews(id);
            const user = await getSingle();
            if(!getOne?.data?.news)return;
            setUser(user?._id);
        
            const data = getOne?.data?.news;
            setNews(data);
            setMainImg(data?.img_url[0]);
            setLikes(data?.likes?.filter((item) => item !== "").length);
            setDisLikes(data?.dislikes?.filter((item) => item !== "").length);
            setLikeUser(data?.likes);
            setDisLikesUser(data?.dislikes);
            
        } catch (error) {
            console.error(error);
        }
    }

    const filterHerb = async () => {
        setIsLoading(true);
        try {
            const herbs = await getHerbs();
            setAboutHerb(herbs?.data?.herbs);
            const categories = await getAllCategories();
            setCategories(categories?.data?.categories);
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }

    const fetchAllNews = async () => {
        getAllNews().then((res) => {
            if(!res?.data?.news)return;
            setAllNews(res?.data?.news);
        }).catch((err) => console.error(err));
    }

    const fetchResearch = () => {
        getAllResearch().then((res) => {
            if(!res?.data?.data)return;
            const data = res?.data?.data;
            const filter = data.filter((item) => item.herbs_id.some(id => new Set(news.herbs_id).has(id)));
            setResearchs(filter.length < 1 ? data : filter);
        })
    }

    useEffect(() => {
        getData();
        filterHerb();
        fetchAllNews();
    },[params])

    useEffect(() => {
        fetchResearch();
    },[news])
      
    const updateReaction = async (type) => {
        if(!user)return navigate('/login');
        let updateLikes = [];
        let updateDislikes = [];
        switch (type) {
            case "like":
                    updateLikes = likeUsers.find((item) => item === user) ? likeUsers.filter((item) => item !== user) : [...likeUsers,user];
                    updateDislikes = dislikesUser.find((item) => item === user) ? dislikesUser.filter((item) => item !== user) : dislikesUser;
                    setLikes(updateLikes.filter((item) => item !== "").length);
                    setDisLikes(updateDislikes.filter((item) => item !== "").length);
                    setLikeUser(updateLikes);
                    setDisLikesUser(updateDislikes);
                break;
            case "dislike" :
                    updateDislikes = dislikesUser.find((item) => item === user) ? dislikesUser.filter((item) => item !== user) : [...dislikesUser,user];
                    updateLikes = likeUsers.find((item) => item === user) ? likeUsers.filter((item) => item !== user) : likeUsers;
                    setDisLikes(updateDislikes.filter((item) => item !== "").length);
                    setLikes(updateLikes.filter((item) => item !== "").length);
                    setDisLikesUser(updateDislikes);
                    setLikeUser(updateLikes);
                break;
            default:
                break;
        }
        const data = {...news,likes:updateLikes,dislikes:updateDislikes};
        try {
            await updateLikesOrDisLikes(data);
        } catch (error) {
            console.error(error);
        }
    };
    

    const slide = (state,setState,el,arr) => {
        const newIndex = state + 1;
        const maxIndex = Math.ceil(arr.length / el); // ป้องกันค่า index ติดลบ
        setState(newIndex >= maxIndex ? 0 : newIndex);
      };

  return (
    <>
    {isLoading && <Loading/>}
    <Navbar/>
        <div className='w-screen h-screen flex flex-col gap-14 items-center' style={{padding:"7rem 0"}}>
            <div className='w-[70%] flex flex-col gap-8'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-4 border-green-900 text-3xl'>ข่าวประจำวันที่ {new Date(news?.createdAt).toLocaleDateString('th-TH')}</label>
                <label htmlFor="" className='text-3xl font-bold'>{news?.title}</label>

                <div className='w-full flex gap-5'>
                     <div className='w-[80%] h-[63vh] border border-green-900'>
                         <img src={`${import.meta.env.VITE_IMG_URL}${mainImg}`} className='w-full h-full object-cover' alt="" />
                     </div>
                     <div className='w-[20%] h-full relative overflow-auto'>
                            <div style={{padding:"0.5rem 1rem"}} className="absolute top-0 left-0 flex flex-col gap-5 w-full h-auto">
                                {
                                    news?.img_url?.map((item,index) => {
                                        return <div onClick={() => setMainImg(item)} key={index} className='cursor-pointer w-full h-[20vh] border transition-all duration-200 hover:ring-2 hover:ring-green-800'>
                                                    <img src={`${import.meta.env.VITE_IMG_URL}${item}`} className='w-full h-full object-cover' alt="" />
                                                </div>
                                    })
                                }
                            </div>
                     </div>
                </div>
                <div className='w-full' dangerouslySetInnerHTML={{__html:DOMpurify.sanitize(news?.content)}}/>
                <div style={{marginTop:"1rem",paddingBottom:"1rem"}} className='w-full flex justify-between border-b-4 border-green-800'>
                    <label htmlFor="" className='flex gap-2 items-center text-xl'>จำนวนผู้เข้าชม <FaEye/> : {news?.views} คน</label>
                    <span className='flex items-center gap-8'>
                        <label htmlFor="" style={{padding:"0.25rem 0.5rem"}} onClick={() => updateReaction("like")} className={`${likeUsers.find((item) => item === user) ? 'text-green-600' : ''} active:scale-105 hover:bg-gray-200 transition-all duration-200 rounded-lg flex items-center text-lg cursor-pointer gap-2`}><FaThumbsUp/>ถูกใจ : {likes}</label>
                        <label htmlFor="" style={{padding:"0.25rem 0.5rem"}} onClick={() => updateReaction("dislike")} className={`${dislikesUser.find((item) => item === user ) ? 'text-red-600' : ''} active:scale-105 hover:bg-gray-200 transition-all duration-200 rounded-lg flex items-center text-lg cursor-pointer gap-2`}><FaThumbsDown/>ไม่ชอบ : {disLikes}</label>
                    </span>
                </div>
            </div>
            <div className='w-[70%] relative flex flex-col gap-5'>
                {
                    aboutHerbs?.filter((item) => news?.herbs_id?.includes(item._id)).length > 4 && 
                    <button onClick={() => slide(herbSlide,setHerbSlide,3,aboutHerbs)} style={{padding:"0.3rem 0.7rem"}} className='hover:bg-green-900 hover:text-white cursor-pointer border border-gray-400 rounded-full absolute top-[13rem] right-[-4rem]'><i className='fas fa-chevron-right'></i></button>
                }
                <label htmlFor="" className='text-2xl border-b-2 border-green-800 flex items-center justify-between' style={{paddingBottom:"0.5rem"}}>สมุนไพรที่เกี่ยวข้อง ({aboutHerbs?.filter((item) => news?.herbs_id?.includes(item._id)).length})<small style={{padding:"0.3rem 0.5rem"}} className='rounded-lg transition-all duration-200 hover:bg-green-900 hover:text-white text-[0.9rem] cursor-pointer'>ดูสมุนไพรทั้งหมด</small></label>
                <div className='relative w-full overflow-auto h-[56vh]'>
                    <div style={{transform:`translateX(-${herbSlide * 1000}px)`}} className='transition-all duration-500 w-auto h-full flex gap-3 absolute top- left-0'>
                        {
                            aboutHerbs?.filter((item) => news?.herbs_id?.includes(item._id)).map((item) => {
                                return <a key={item?._id} href={`/herbdetail/${item._id}`}>
                                            <div style={{paddingBottom:"0.5rem"}} className='transition-all duration-200 hover:bg-gray-100 border-b-4 border-green-600 cursor-pointer w-[20vw] h-[90%] flex flex-col gap-1'>
                                            <div className='w-full h-[45%] border'>
                                                <img src={item?.imgs[0].startsWith('i') ? `${import.meta.env.VITE_IMG_URL}${item?.imgs[0]}` : item?.imgs[0]} className='w-full h-full object-cover' alt="" />
                                            </div>
                                            <div style={{padding:"0.25rem"}} className='flex flex-col gap-1'>
                                                <label htmlFor="" className='text-xl font-bold'>{item?.name_th}</label>
                                                <label htmlFor="" className='text-[0.85rem] text-gray-700'>
                                                   {
                                                    categories.filter((ctg) => item?.categories?.includes(ctg?._id)).map((item) => item?.ctg_name).join(",").substring(0,42)+'...'
                                                    }
                                                </label>
                                                <p className='text-[0.9rem]'>
                                                  {
                                                    item?.benefits?.length < 160 ? item?.benefits : item?.benefits?.substring(0,160)+'...'
                                                  }
                                                </p>
                                                <label htmlFor="" className='text-[0.85rem] text-gray-700'>
                                                    แก้ไขล่าสุด : {new Date(item?.createdAt).toLocaleDateString('th-TH')} {new Date(item?.createdAt).toLocaleTimeString('th-TH')}
                                                </label>
                                            </div>
                                        </div>
                                        </a>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className='w-[70%] relative flex flex-col gap-4'>
                {
                    allNews.length > 3 && 
                    <button onClick={() => slide(newsSlide,setNewsSlide,4,allNews)} className='absolute top-[12rem] right-[-1.5rem] rounded-full shadow cursor-pointer z-10 border border-gray-300 hover:bg-[#0a2d1e] hover:text-white active:scale-85' style={{padding:"0.3rem 0.7rem"}}><i className='fas fa-chevron-right'></i></button>
                }
                <label htmlFor="" className='text-2xl border-b-4 border-green-800 flex items-center justify-between' style={{paddingBottom:"0.5rem"}}>{allNews?.filter((item) => new Date(item?.createdAt).toLocaleDateString('th-TH') === new Date().toLocaleDateString('th-TH')).length > 0 ? `ข่าวประจำวันที่ ${new Date().toLocaleDateString('th-TH')}` : 'ข่าวอื่นๆที่คุณอาจสนใจ'} ({
                    allNews?.filter((item) => new Date(item?.createdAt).toLocaleDateString('th-TH') === new Date().toLocaleDateString('th-TH')).length > 0 ? allNews?.filter((item) => new Date(item?.createdAt).toLocaleDateString('th-TH') === new Date().toLocaleDateString('th-TH')).length : allNews.length
                    })<small style={{padding:"0.3rem 0.5rem"}} className='rounded-lg transition-all duration-200 hover:bg-green-900 hover:text-white text-[0.9rem] cursor-pointer'>ดูข่าวทั้งหมด</small></label>
                <div className='relative w-full overflow-auto h-[40vh]'>
                    <div className='w-auto h-full flex gap-5 absolute top- left-0 transition-all duration-500 ' style={{transform:`translateX(-${newsSlide * 998}px)`}}>
                        {
                           allNews?.filter((item) => new Date(item?.createdAt).toLocaleDateString('th-TH') === new Date().toLocaleDateString('th-TH')).length > 0
                           ?
                           allNews?.filter((item) => new Date(item?.createdAt).toLocaleDateString('th-TH') === new Date().toLocaleDateString('th-TH')).map((item) => {
                            return <a key={item?._id} onClick={() => updateViewsAndRedirect(item)}>
                                        <div style={{paddingBottom:"0.5rem"}} className='transition-all duration-200 hover:bg-gray-100 border-b-4 border-green-600 cursor-pointer w-[16.5vw] h-[95%] flex flex-col gap-1'>
                                            <div className='w-full h-[40%] border'>
                                                <img src={import.meta.env.VITE_IMG_URL+item?.img_url[0]} className='w-full h-full object-cover' alt="" />
                                            </div>
                                             <div style={{padding:"0.2rem"}} className='w-full flex flex-col h-[60%] justify-between'>
                                                <div className='w-full flex flex-col gap-1'>
                                                    <label htmlFor="" className='font-bold text-xl'>{item?.title}</label>
                                                    <label htmlFor="" className='text-gray-600'>ข่าวประจำวันที่ : {new Date(item?.createdAt).toLocaleDateString("th-TH")}</label>
                                                </div>
                                                <div className="w-full flex justify-between items-center">
                                                    <label htmlFor="" className='text-gray-600 text-[0.85rem] flex gap-1 items-center'><FaEye/> : {item?.views}</label>
                                                    <span className='flex items-center gap-3.5'>
                                                        <label
                                                          htmlFor=""
                                                          className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                                                        >
                                                          <FaComment /> :{" "}
                                                          {item?.comment_id?.filter((item) => item !== "").length}
                                                        </label>
                                                        <label htmlFor="" className='text-gray-600 text-[0.85rem] flex gap-1 items-center'><FaThumbsUp/> : {item?.likes?.filter((item) => item !== "")?.length}</label>
                                                        <label htmlFor="" className='text-gray-600 text-[0.85rem] flex gap-1 items-center'><FaThumbsDown/> : {item?.dislikes?.filter((item) => item !== "")?.length}</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                           })
                           :
                           allNews.sort((a,b) => (b?.likes?.length || 0) - (a?.likes?.length || 0)).map((item) => {
                            return  <a key={item?._id} onClick={() => updateViewsAndRedirect(item)}>
                                        <div style={{paddingBottom:"0.5rem"}} className='transition-all duration-200 hover:bg-gray-100 border-b-4 border-green-600 cursor-pointer w-[16.5vw] h-[95%] flex flex-col gap-1'>
                                            <div className='w-full h-[40%] border'>
                                                <img src={import.meta.env.VITE_IMG_URL+item?.img_url[0]} className='w-full h-full object-cover' alt="" />
                                            </div>
                                             <div style={{padding:"0.2rem"}} className='w-full flex flex-col h-[60%] justify-between'>
                                                <div className='w-full flex flex-col gap-1'>
                                                    <label htmlFor="" className='font-bold text-xl'>{item?.title}</label>
                                                    <label htmlFor="" className='text-gray-600'>ข่าวประจำวันที่ : {new Date(item?.createdAt).toLocaleDateString("th-TH")}</label>
                                                </div>
                                                <div className="w-full flex justify-between items-center">
                                                    <label htmlFor="" className='text-gray-600 text-[0.85rem] flex gap-1 items-center'><FaEye/> : {item?.views}</label>
                                                    <span className='flex items-center gap-3.5'>
                                                        <label
                                                          htmlFor=""
                                                          className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                                                        >
                                                          <FaComment /> :{" "}
                                                          {item?.comment_id?.filter((item) => item !== "").length}
                                                        </label>
                                                        <label htmlFor="" className='text-gray-600 text-[0.85rem] flex gap-1 items-center'><FaThumbsUp/> : {item?.likes?.filter((item) => item !== "")?.length}</label>
                                                        <label htmlFor="" className='text-gray-600 text-[0.85rem] flex gap-1 items-center'><FaThumbsDown/> : {item?.dislikes?.filter((item) => item !== "")?.length}</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                           })
                        }
                    </div>
                </div>
            </div>
            <div style={{marginTop:"2rem",paddingBottom:"3rem"}} className='w-[70%] relative flex flex-col gap-4'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='w-full flex justify-between text-2xl border-b-2'>
                    งานวิจัยที่คุณอาจสนใจ<a style={{padding:"0.3rem 0.5rem"}} className='rounded-lg transition-all duration-200 hover:bg-green-900 hover:text-white text-[0.9rem] cursor-pointer'>ดูงานวิจัยทั้งหมด</a>
                </label>
                {
                    researchs.length > 3 && 
                    <button onClick={() => slide(researchSlide,setResearchSldie,4,researchs)} className='absolute top-[12rem] right-[-1.5rem] rounded-full shadow cursor-pointer z-10 border border-gray-300 hover:bg-[#0a2d1e] hover:text-white active:scale-85' style={{padding:"0.3rem 0.7rem"}}><i className='fas fa-chevron-right'></i></button>
                }
                <div className="w-full relative overflow-hidden h-[45vh]">
                    <div className="w-auto absolute top-0 left-0 h-full flex gap-4 transition-all duration-500" style={{transform:`translateX(-${researchSlide * 998}px)`}}>
                        {
                            researchs.sort((a,b) => (b.likes.length || 0) - (a.likes.length || 0)).map((item) => {
                                return <div onClick={() => updateViews(item)} key={item?._id} style={{paddingBottom:"0.5rem"}} className="cursor-pointer hover:bg-gray-200 w-[18vw] h-full flex flex-col gap-1 border-b-4 border-green-600">
                                            <div className=" w-full h-[45%] rounded-tr-lg rounded-tl-lg overflow-hidden">
                                                <img src={item?.imgs[0].startsWith("i") ? import.meta.env.VITE_IMG_URL+item?.imgs[0] : item?.imgs[0]} className='w-full h-full object-cover' alt="" />
                                            </div>
                                            <div style={{padding:"0.35rem"}} className="w-full flex flex-col justify-between h-[55%]">
                                                <div className="w-full flex flex-col">
                                                    <label htmlFor="" className='text-xl font-bold'>
                                                        {
                                                            item?.title.length > 50 ? item?.title.slice(0,50)+'...'
                                                            : item?.title
                                                        }
                                                    </label>
                                                    <label htmlFor="" className='text-[0.9rem] text-gray-600'>
                                                        โดย : {
                                                                item?.author.length > 50 ? item?.author.slice(0,50)+'...'
                                                                : item?.author   
                                                            }
                                                    </label>
                                                    <label htmlFor="" className='text-[0.9rem] text-gray-600'>
                                                        ปี : {item?.year}
                                                    </label>
                                                </div>
                                                <div className="w-full flex justify-between items-center">
                                                    <label htmlFor="" className='flex gap-1 items-center text-[0.9rem]'>
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
                                                        <label htmlFor="" className='flex gap-1 items-center text-[0.9rem]'>
                                                            <FaThumbsUp/> : {item?.likes?.filter((item) => item !== "").length}
                                                        </label>
                                                        <label htmlFor="" className='flex gap-1 items-center text-[0.9rem]'>
                                                            <FaThumbsUp/> : {item?.dislikes?.filter((item) => item !== "").length}
                                                        </label>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                            })
                        }
                        
                    </div>
                </div>
                <Comment updateData={() => getData()} type={"news"} commentList={news?.comment_id} mainId={news?._id}/>
            </div>
            <Footer/>
        </div>
    </>
  )
}

export default NewsDetail