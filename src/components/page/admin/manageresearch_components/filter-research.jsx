import React, { useEffect, useState } from 'react'
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { getHerbs } from '../../../function/herbs';

const FilterResearch = ({sendFilterData,data,onclose}) => {
   const [herbs,setHerbs] = useState([]);
   const [selectHerbs,setSelectHerbs] = useState([]);
   const [addDate,setAddDate] = useState("");
   const [updateDate,setUpdateDate] = useState("");
   const [view,setView] = useState({min:0,max:0});
   const [like,setLike] = useState({min:0,max:0});
   const [dislike,setDislike] = useState({min:0,max:0});

   useEffect(() => {
      getHerbs().then((res) => {
            if(!res?.data?.herbs);
            const herbs = res?.data?.herbs;
            setHerbs(herbs);
          })
   },[]);

   const inputDate = (e,setState) => {
      const value = e.target.value;
      if(new Date(value).setHours(0,0,0,0) > new Date()){
         Swal.fire("แจ้งเตือน","กรุณาเลือกวันที่ให้ถูกต้อง","error");
         return;
      }
      setState(value);
   }

   const handleMin = (e,state,setState) => {
      const value = e.target.value;
      if(state.max > 0 && value > state.max){
         setState({...state,min:state.max});
      }else{
         setState({...state,min:value});
      }
   }

   const handleMax = (e,state,setState) => {
      const value = e.target.value;
      if(state.min > 0 && value < state.min){
         setState({...state,max:state.min});
      }else{
         setState({...state,max:value});
      }
   }

   const filterResearch = () => {
      let fiteredResearchs = [...data]

      if(addDate !== ""){
         fiteredResearchs = fiteredResearchs.filter((item) => 
            new Date(item?.createdAt).setHours(0,0,0,0) === new Date(addDate).setHours(0,0,0,0)
         )
      }

      if(updateDate !== ""){
         fiteredResearchs = fiteredResearchs.filter((item) => 
            new Date(item?.updatedAt).setHours(0,0,0,0) === new Date(updateDate).setHours(0,0,0,0)
         )
      }

      if(view.min > 0 || view.max > 0){
         fiteredResearchs = fiteredResearchs.filter((item) => {
            return (
               item.views >= (view.min || 0) &&
               item.views <= (view.max || Infinity)
             )
         })
      }

      if(like.min > 0 || like.max > 0){
         fiteredResearchs = fiteredResearchs.filter((item) => {
            const count = item.likes.filter((item) => item !== "").length
            return (
              count >= (like.min || 0) &&
              count <= (like.max || Infinity)
            )
         })
      }

      if(dislike.min > 0 || dislike.max > 0){
         fiteredResearchs = fiteredResearchs.filter((item) => {
            const count = item.dislikes.filter((item) => item !== "").length
            return (
              count >= (dislike.min || 0) &&
              count <= (dislike.max || Infinity)
            )
         })
      }

      if(selectHerbs.length > 0){
         fiteredResearchs = fiteredResearchs.filter((item) => {
            return selectHerbs.every((id) => item.herbs_id.includes(id))
         })
      }

      sendFilterData(fiteredResearchs)
      onclose();
   }

   const resetValue = () => {
      setAddDate("");
      setUpdateDate("");
      setSelectHerbs([]);
      setView({min:0,max:0});
      setLike({min:0,max:0});
      setDislike({min:0,max:0}); 
      
   }

  return (
    <div className='w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-end overflow-auto z-50'>
        <div style={{padding:"1.5rem",marginTop:"28.5rem"}} className="w-[40%] relative rounded-tl-lg rounded-bl-lg border bg-white flex flex-col items-center gap-8">
             <button onClick={onclose} className='rounded-full absolute top-2 right-2 hover:bg-red-600 hover:text-white' style={{padding:"0.25rem"}}><FaTimes/></button>
             <div className="flex flex-col items-center gap-1">
                <label htmlFor="" className='text-3xl font-bold flex gap-2 items-center'>
                    <FaFilter/> ตัวกรองช่วยค้นหา
                </label>
                <label htmlFor="">ค้นหางานวิจัยได้งานชึ้นด้วยตัวกรอง</label>
             </div>
             <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-4 text-xl'>วันที่เพิ่ม</label>
                <input onChange={(e) => inputDate(e,setAddDate)} value={addDate} type="date" className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
             </div>
             <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-4 text-xl'>วันที่แก้ไขล่าสุด</label>
                <input onChange={(e) => inputDate(e,setUpdateDate)} value={updateDate} type="date" className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
             </div>
             <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-4 text-xl'>จำนวนผู้เข้าชม(คน)</label>
                <span className='w-full items-center flex justify-between'>
                    <input min={0} value={view.min === 0 ? "" : view.min} onChange={(e) => handleMin(e,view,setView)} type="number" placeholder='ตั้งแต่' className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
                    <label htmlFor="" className='font-bold text-lg'>-</label>
                    <input min={view.min} value={view.max === 0 ? "" : view.max}onChange={(e) => handleMax(e,view,setView)} type="number" placeholder='ไม่เกิน' className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
                </span>
             </div>
             <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-4 text-xl'>ถูกใจ(คน)</label>
                <span className='w-full items-center flex justify-between'>
                    <input min={0} value={like.min === 0 ? "" : like.min} onChange={(e) => handleMin(e,like,setLike)} type="number" placeholder='ตั้งแต่' className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
                    <label htmlFor="" className='font-bold text-lg'>-</label>
                    <input min={like.min} value={like.max === 0 ? "" : like.max} onChange={(e) => handleMax(e,like,setLike)} type="number" placeholder='ไม่เกิน' className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
                </span>
             </div>
             <div className="w-full flex flex-col gap-3">
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-4 text-xl'>ไม่ถูกใจ(คน)</label>
                <span className='w-full items-center flex justify-between'>
                    <input min={0} value={dislike.min === 0 ? "" : dislike.min} onChange={(e) => handleMin(e,dislike,setDislike)} type="number" placeholder='ตั้งแต่' className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
                    <label htmlFor="" className='font-bold text-lg'>-</label>
                    <input min={dislike.min} value={dislike.max === 0 ? "" : dislike.max} onChange={(e) => handleMax(e,dislike,setDislike)} type="number" placeholder='ไม่เกิน' className='border cursor-pointer rounded-md' style={{padding:"0.35rem"}} />
                </span>
             </div>
             <div className="w-full flex flex-col gap-3">
                   <label
                       htmlFor=""
                       style={{ paddingBottom: "0.5rem" }}
                       className="border-b-4 border-[#050a44] font-bold text-xl"
                   >
                     สมุนไพรที่เกี่ยวข้อง
                   </label>
                   <input type="text" className="w-full border outline-none" style={{padding:"0.35rem 0.5rem"}} placeholder="ค้นหาสมุนไพร"/>
                   <div className="w-full h-[25vh] border flex relative overflow-auto">
                     <div className="w-full h-auto absolute top-0 left-0 flex flex-col">
                       {
                         herbs?.filter((item) => !selectHerbs.includes(item?._id)).map((item) => {
                           return <option onClick={() => setSelectHerbs(prev => [item?._id,...prev])} value={item?._d} className="w-full h-[4.8vh] transition-all duration-200 hover:bg-gray-200 cursor-pointer" style={{padding:"0.35rem"}}>{item?.name_th}</option>
                         })
                       }
                     </div>
                   </div>
                   <div className="w-full h-[8.5vh] relative overflow-auto">
                       <div className="w-auto h-[6vh] flex gap-2 absolute top-0 left-0">
                         {
                           herbs.filter((item) => selectHerbs.includes(item?._id)).map((item) => {
                             return <label key={item?._id} htmlFor="" style={{padding:"0.3rem 0.5rem"}} className="rounded-lg cursor-pointer bg-gray-300 w-[8.5vw] h-full flex items-center justify-between">
                                     {item?.name_th} <FaTimes onClick={() => setSelectHerbs(prev => prev.filter((id) => id !== item._id))}/>
                                   </label>
                           })
                         }
                           
                       </div>
                   </div>
               </div>
               <div className="w-full flex items-center justify-between">
                  <button onClick={resetValue} className='rounded-md cursor-pointer text-white text-xl hover:bg-red-700 bg-red-600' style={{padding:"0.5rem 3rem"}}>รีเซ็ต</button>
                  <button onClick={filterResearch} className='rounded-md cursor-pointer text-white text-xl hover:bg-blue-900 bg-[#050a44]' style={{padding:"0.8rem 3rem"}}><FaSearch/></button>
               </div>
        </div>
    </div>
  )
}

export default FilterResearch;