import React, {  lazy, useEffect, useState } from 'react'
import { FaFileMedical, FaFileUpload, FaPlus, FaTimes } from 'react-icons/fa'
import { getHerbs } from '../../../function/herbs';
import {v4 as uuid} from "uuid";
import AdminLoading from '../../../layout/admin/adminloading';
import { addResearch } from '../../../function/research';

const AddResearch = ({onclose}) => {
    const [originHerb,setOriginalHerbs] = useState([]);
    const [herbsData,setHerbsData] = useState([]);
    const [inputUrl,setInputUrl] = useState("");
    const [form,setForm] = useState({title:"",author:"",objective:"",source:"",year:""});
    const [imgs,setImgs] = useState([]);
    const [filesInput,setFilesInput] = useState([]);
    const [selectHerb,setselectHerb] = useState([]);
    const [isLoading,setIsLoading] = useState(false);


    const handleInput = (e) => {
        setForm({...form,[e.target.name]:e.target.value});
    }

    useEffect(() => {
        getHerbs().then((res) => {
            if(!res?.data?.herbs)return;
            const herbs = res?.data?.herbs;
            setOriginalHerbs(herbs);
            setHerbsData(herbs.filter((item) => !selectHerb.map((item) => item.id).includes(item._id)));

        })
    },[selectHerb]);

    const uploadFiles = (e) => {
        const files = Array.from(e.target.files);
        if(files.length > 10)
            return Swal.fire("แจ้งเตือน","รูปภาพมีจำนวนมากเกินไป","error");
        if(files){
            files.forEach((item) => {
                const id = uuid();
                const reader = new FileReader();
                reader.onload = (e) => {
                    const readerObj = {id,src:e.target.result};
                    const fileObj = {id,file:item};
                    setImgs(prev => [readerObj,...prev]);
                    setFilesInput(prev => [fileObj,...prev]);
                }
                reader.readAsDataURL(item);
            })
        }
    }

    const deleteImg = (id) => {
        setImgs(prev => prev.filter((item) => item.id !== id));
        setFilesInput(prev => prev.filter((item) => item.id !== id));
    }


    const selectHerbs = (id,name) => {
        setselectHerb(prev => [{id,name},...prev]);
        console.log("🚀 ~ selectHerbs ~ {id,name}:", {id,name})
    }

    const deleteHerb = (id) => {
        setselectHerb(prev => prev.filter((item) => item.id !== id));
    }

    const searchHerb = (e) => {
        const value = e.target.value;
        if(value.length < 1 || value === ""){
            setHerbsData(originHerb.filter((item) => !selectHerb.map((item) => item.id).includes(item._id)));
        }else{
            setHerbsData(originHerb.filter((item) => !selectHerb.map((item) => item.id).includes(item._id)).filter((item) => 
                item.name_th.includes(value)
            ))
        }
    }

    const sendAddData = async () => {
        if(form.title === "" || form.author === "" || form.source === "" || form.objective === "")
            return Swal.fire("แจ้งเตือน","โปรดตรวจสอบความถูกต้อง","error");

        if(form.objective.length < 15)
            return Swal.fire("แจ้งเตือน","คำอธิบายสั้นเกินไป","error");

        if(!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(form.source))
            return Swal.fire("แจ้งเตือน","กรุณาตรวจสอบที่มาของงานวิจัย","error")

        if(inputUrl !== "")
            return Swal.fire("แจ้งเตือน","มีรูปภาพยังไม่ถูกเพิ่ม","error");

        if(imgs.length < 1)
            return Swal.fire("แจ้งเตือน","โปรดเพิ่มอย่างน้อย 1 รูปภาพ","error");
        if(selectHerb.length < 1)
            return Swal.fire("แจ้งเตือน","โปรดระบุสมุนไพรที่เกี่ยวข้อง","error");


        const {isConfirmed} = await Swal.fire({
            title:"แจ้งเตือน",
            text:"ต้องการเพิ่มงานวิจัยนี้หรือไม่?",
            icon:"question",
            showDenyButton:true,
            denyButtonText:"ยกเลิก",
            confirmButtonText:"เพิ่ม"
        })
        if(!isConfirmed)return;
        await sendToBackend();
    }

    const sendToBackend = async () => {
        let sendForm = {};
        if(filesInput.length > 0){
            const formEncryp = new FormData();
            for(const key in form){
                formEncryp.append(key,form[key]);
            }
            for(let i = 0 ; i < selectHerb.length ; i ++){
                formEncryp.append("herbs_id",selectHerb.map((item) => item.id)[i]);
            }
            const filterHttpsImg = imgs.filter((item) => item.src.startsWith("h")).map((item) => item.src);
            for(let i = 0 ; i < filterHttpsImg.length ; i ++ ){
                formEncryp.append("imgs",filterHttpsImg[i]);
            }
            for(let i = 0 ; i < filesInput.length ; i ++){
                formEncryp.append("images",filesInput.map((item) => item.file)[i]);
            }
            sendForm = formEncryp;
        }else{
            sendForm = {...form,imgs,herbs_id:selectHerb.map((item) => item.id)};
        }

        setIsLoading(true);
        try {
            const sending = await addResearch(sendForm);
            if(sending?.data?.err)return Swal.fire("แจ้งเตือน",sending?.data?.err,"error");

            await Swal.fire("สำเร็จ",sending?.data?.mes,"success");
            setForm({title:"",description:"",year:"",source:"",author:""});
            setFilesInput([]);
            setImgs([]);
            setselectHerb([]);
            continueAdd();
        } catch (error) {
            console.error(error);
            Swal.fire("แจ้งเตือน","เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง","error");
        }finally{
            setIsLoading(false);
        }
    }

    const inputYear = (e) => {
        const year = e.target.value;
        if(parseInt(year) > parseInt(new Date().toLocaleDateString('th-TH').split("/")[2]))
            return Swal.fire("แจ้งเตือน","ไม่สามารถระบุปีในอนาคตได้","error");
        if(parseInt(year) < 1 || !/^[0-9]+$/.test(year))
            return Swal.fire("แจ้งเตือน","ปีไม่ถูกต้อง","error");
        setForm({...form,year});
    }

    const continueAdd = async () => {
        const {isConfirmed} = await Swal.fire({
            title:"แจ้งเตือน",
            text:"ต้องการเพิ่มงานวิจัยต่อหรือใหม่?",
            icon:"question",
            showDenyButton:true,
            denyButtonText:"ไม่ต้องการ",
            confirmButtonText:"อยู่ต่อ"
        })
        if(!isConfirmed)return onclose();
        return;
    }

  return (
    <>
    {
        isLoading && <AdminLoading/>
    }
     <div className='absolute top-0 left-0 w-full h-full flex flex-col gap-8 bg-[rgba(0,0,0,0.8)] items-center justify-center overflow-auto'>
        <div  className="relative w-[40%] rounded-lg border bg-white flex flex-col gap-8 items-center" style={{padding:"2.5rem 2rem",marginTop:"55rem"}}>
            <button onClick={onclose} className='absolute top-2 right-2 rounded-full hover:text-white hover:bg-red-600 cursor-pointer' style={{padding:"0.3rem"}}><FaTimes/></button>
            <div className="flex flex-col gap-1">
                <label htmlFor="" className='flex items-center gap-1 font-bold text-2xl'>
                    <FaFileMedical/> เพิ่มงานวิจัย
                </label>
                <label htmlFor="" className='text-[0.9rem] text-gray-700'>add's new research</label>
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>หัวข้องานวิจัย</label>
                <input name='title' value={form.title} onChange={handleInput} type="text" style={{padding:"0.35rem 0.55rem"}} className='outline-none border rounded-lg focus:ring-2 focus:ring-[#050a44]' placeholder='ป้อนหัวข้องานวิจัย' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>ชื่อผู้ทำวิจัย</label>
                <input name='author' value={form.author} onChange={handleInput} type="text" style={{padding:"0.35rem 0.55rem"}} className='outline-none border rounded-lg focus:ring-2 focus:ring-[#050a44]' placeholder='(กรณีมีหลายชื่อให้ใส่ "," ระหว่างชื่อ)' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>วัตถุประสงค์ของงานวิจัย</label>
                <textarea name='objective' value={form.objective} onChange={handleInput} style={{padding:"0.35rem 0.55rem"}} className='outline-none border h-[15vh] rounded-lg focus:ring-2 focus:ring-[#050a44]' placeholder='วัตถุประสงค์หรือสรุปสั้นๆ' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>ที่อยู่งานวิจัย</label>
                <input name='source' value={form.source} onChange={handleInput} type="text" style={{padding:"0.35rem 0.55rem"}} className='outline-none border rounded-lg focus:ring-2 focus:ring-[#050a44]' placeholder='ลิงค์ไปยังงานวิจัย' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>ปี พ.ศ.</label>
                <input name='year' value={form.year} min={1} onChange={inputYear} style={{padding:"0.35rem 0.55rem"}} type="number" className='outline-none border rounded-lg focus:ring-2 focus:ring-[#050a44]' placeholder='ปีที่วิจัยเสร็จหรือปีที่เข้าเล่ม' />
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>รูปภาพงานวิจัย</label>
                <div className='flex w-full justify-between items-center'>
                    <span style={{padding:"0.5rem 1.5rem"}} className='rounded-lg border transition-all duration-200 cursor-pointer hover:bg-black hover:text-white'>
                        <input type="file" id='input-img' className='hidden' multiple onChange={uploadFiles}/>
                        <label htmlFor="input-img" className='flex items-center gap-1'>
                            <FaFileUpload/> อัปโหลดไฟล์
                        </label>
                    </span>
                    <span className='w-[50%] flex items-center gap-2'>
                        <input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} type="text" placeholder='หรืออัปโหลดด้วย URL' style={{padding:'0.3rem'}} className='w-full border-b outline-none' />
                        <button hidden={inputUrl === ""} onClick={() => {setImgs([{id:uuid(),src:inputUrl},...imgs]),setInputUrl("")}} style={{padding:"0.35rem"}} className='hover:bg-black hover:text-white cursor-pointer rounded-lg active:-translate-y-1'><FaPlus/></button>
                    </span>
                </div>
                <div className='w-full relative overflow-auto h-[25vh]'>
                    <div className='absolute top-0 left-0 w-auto h-[93%] flex gap-3' style={{padding:"1rem 0"}}>
                        {
                            imgs.length > 0 ? imgs.map((item) => {
                                return <div key={item?.id} className='w-[10vw] h-full border relative'>
                                            <button onClick={() => deleteImg(item?.id)} className='absolute top-[-0.8rem] right-[-0.8rem] rounded-full text-white bg-red-600 cursor-pointer' style={{padding:"0.3rem"}}><FaTimes/></button>
                                            <img src={item?.src} className='w-full h-full object-cover' alt="" />
                                        </div>
                            })
                            : <label htmlFor="" style={{marginTop:"2.5rem"}} className='text-xl text-red-600'>ยังไม่ได้อัปโหลดภาพ</label>
                        }

                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col gap-2'>
                <label htmlFor="" style={{paddingBottom:"0.5rem"}} className='border-b-2 text-xl'>สมุนไพรที่เกี่ยวข้องกับงานวิจัย</label>
                <input type="text" onChange={searchHerb} list='herbs-list' style={{padding:"0.35rem 0.55rem"}} className='outline-none border rounded-lg' placeholder='ค้นหาสมุนไพรที่นี่' />
                <div className='w-full flex flex-col h-[30vh] border overflow-y-auto relative'>
                    <div className='absolute top-0 left-0 w-full h-auto'>
                    {
                        herbsData.map((item) => {
                            return <option onClick={() => selectHerbs(item?._id,item?.name_th)} key={item?._id} value={item?._id} className='transition-all duration-200 hover:bg-gray-200 cursor-pointer' style={{padding:"0.4rem"}}>{item?.name_th}</option>
                        })
                    } 
                    </div>
                </div>
                <div className="w-full h-[8vh] overflow-auto relative">
                        <div className="absolute top-0 left-0 w-auto flex gap-3">
                            {
                                selectHerb.length > 0  ? selectHerb.map((item) => {
                                    return <label key={item?.id} htmlFor="" className='w-[9vw] rounded-lg cursor-pointer bg-gray-200 flex items-center justify-between' style={{padding:"0.5rem"}}>
                                                {item?.name} <FaTimes onClick={() => deleteHerb(item?.id)}/>
                                            </label>
                                })
                                : <label htmlFor="" style={{marginTop:"1rem"}} className='text-red-600'>โปรดระบุสมุนไพรที่เกี่ยวข้องอย่างน้อย 1 สมุนไพร</label>
                            }
                            
                        </div>
                </div>
            </div>
            <button onClick={sendAddData} className='w-full justify-center text-xl flex items-center gap-1 cursor-pointer border rounded-lg bg-[#050a44] text-white hover:bg-blue-900' style={{padding:"0.8rem"}}><FaPlus/>เพิ่ม</button>
        </div>
    </div>
    </>
  )
}

export default AddResearch