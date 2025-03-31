import React, { useEffect, useState } from 'react'
import { getHerbs } from '../../../function/herbs';
import { FaFileUpload, FaPenNib, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { updateResearch } from '../../../function/research';
import AdminLoading from '../../../layout/admin/adminloading';

const EditResearch = ({onclose,research,getAllResearch}) => {
    const [originHerb,setOriginalHerbs] = useState([]);
    const [herbsData,setHerbsData] = useState([]);
    const [inputUrl,setInputUrl] = useState("");
    const [form,setForm] = useState({title:research?.title,author:research?.author,objective:research?.objective,source:research?.source,year:research?.year});
    const [imgs,setImgs] = useState(research?.imgs);
    const [filesInput,setFilesInput] = useState([]);
    const [selectHerb,setselectHerb] = useState(research?.herbs_id);
    const [isLoading,setIsLoading] = useState(false);
    const [imgToDelete,setImgToDelete] = useState([]);

    useEffect(() => {
           getHerbs().then((res) => {
               if(!res?.data?.herbs)return;
               const herbs = res?.data?.herbs;
               setOriginalHerbs(herbs);
               setHerbsData(herbs.filter((item) => !selectHerb.includes(item._id)));
           }).catch((err) => console.log(err));
    },[selectHerb]);

    const handleInput = (e) => {
        setForm({...form,[e.target.name]:e.target.value});
    }

    const inputYear = (e) => {
        const year = e.target.value;
        if(parseInt(year) > parseInt(new Date().toLocaleDateString('th-TH').split("/")[2]))
            return Swal.fire("แจ้งเตือน","ไม่สามารถระบุปีในอนาคตได้","error");
        if(parseInt(year) < 1 || !/^[0-9]+$/.test(year))
            return Swal.fire("แจ้งเตือน","ปีไม่ถูกต้อง","error");
        setForm({...form,year});
    }

    const searchHerb = (e) => {
        const value = e.target.value;
        if(value.length < 1 || value === ""){
            setHerbsData(originHerb.filter((item) => !selectHerb.map((item) => item).includes(item._id)));
        }else{
            setHerbsData(originHerb.filter((item) => !selectHerb.map((item) => item).includes(item._id)).filter((item) => 
                item.name_th.includes(value)
            ))
        }
    }

    const selectHerbId = (id) => {
        setselectHerb(prev => [id,...prev]);
    } 

    const delHerbID = (id) => {
        setselectHerb(prev => prev.filter((item) => item !== id));
    }

    const addImgUrl = () => {
       setImgs(prev => [inputUrl,...prev]);
       setInputUrl("");
    }

    const deleteImg = (src) => {
        setImgs(prev => prev.filter((item) => item !== src));
        setImgToDelete(prev => src.startsWith("i") ? [...prev,src] : prev)
    }

    const uploadImgs = (e) => {
        const files = Array.from(e.target.files);
        setFilesInput(prev => [...prev,...files]);
        if(files){
            files.map((item) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImgs(prev => [e.target.result,...prev]);
                }
                reader.readAsDataURL(item);
            })
        }
    }

    const sendUpdate = async () => {
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
            text:"ต้องการบันทึกข้อมูลหรือไม่?",
            icon:"question",
            showDenyButton:true,
            denyButtonText:"ยกเลิก",
            confirmButtonText:"บันทึก"
        })
        if(!isConfirmed)return;
        await sendToBackend();
    }

    const manageFormData = async () => {
        let formData = {...form,herbs_id:selectHerb,oldImg:imgToDelete.filter(Boolean),imgs:imgs.filter((item) => !item.startsWith("d"))};
        let fileReaded = imgs.filter((item) => item.startsWith("d"));
        if(fileReaded.length > 0){
            const filteredFiles = await Promise.all(
                filesInput.map( async (item) => {
                    const url = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(item);
                    })
                    return {file:item,keep:fileReaded.includes(url)};
            }))
            const newImageFiles = filteredFiles.filter((item) => item.keep).map((item) => item.file);
            
            // encrypt
            const formEncrypt = new FormData();
            for(const key in formData){ 
                formEncrypt.append(key,formData[key]);
            }
            for(let i = 0 ; i < newImageFiles.length ; i ++){
                formEncrypt.append("images",newImageFiles[i]);
            }
            formData = formEncrypt;
        }
        return formData
    }

    const sendToBackend = async () => {
        setIsLoading(true);
        try {
            const sendForm = await manageFormData();
            const sendUpdate = await updateResearch(research._id,sendForm);
            if(sendUpdate?.data?.err)
                return Swal.fire("แจ้งเตือน",sendUpdate?.data?.err,"error");

            Swal.fire("สำเร็จ",sendUpdate?.data?.mes,"success");
            onclose();
            getAllResearch();
        } catch (error) {
            console.error(error);
            Swal.fire("เกิดข้อผิดพลาด","โปรดลองใหม่อีกครั้งหรือตรวจสอบเครือข่ายของคุณ","error");
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <div className='w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center overflow-auto'>
        {isLoading && <AdminLoading/>}
        <div className="relative w-[40%] rounded-lg border bg-white flex flex-col gap-8 items-center" style={{padding:"2.5rem 2rem",marginTop:"55rem"}}>
            <button onClick={onclose} className='absolute top-2 right-2 rounded-full hover:text-white hover:bg-red-600 cursor-pointer' style={{padding:"0.3rem"}}><FaTimes/></button>
            <div className="flex flex-col gap-1 items-center">
                <label htmlFor="" className='flex items-center gap-1 font-bold text-2xl'>
                    <FaPenNib/> แก้ไขงานวิจัย
                </label>
                <label htmlFor="" className='text-[0.9rem] text-gray-700'>edit's research</label>
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
                        <input onChange={uploadImgs} type="file" id='input-img' className='hidden' multiple />
                        <label htmlFor="input-img" className='flex items-center gap-1'>
                            <FaFileUpload/> อัปโหลดไฟล์
                        </label>
                    </span>
                    <span className='w-[50%] flex items-center gap-2'>
                        <input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} type="text" placeholder='หรืออัปโหลดด้วย URL' style={{padding:'0.3rem'}} className='w-full border-b outline-none' />
                        <button onClick={addImgUrl} hidden={inputUrl === ""} style={{padding:"0.35rem"}} className='hover:bg-black hover:text-white cursor-pointer rounded-lg active:-translate-y-1'><FaPlus/></button>
                    </span>
                </div>
                <div className='w-full relative overflow-auto h-[25vh]'>
                    <div className='absolute top-0 left-0 w-auto h-[93%] flex gap-3' style={{padding:"1rem 0"}}>
                        {
                            imgs.length > 0 ? imgs.map((item) => {
                                return <div key={item?.id} className='w-[10vw] h-full border relative'>
                                            <button onClick={() => deleteImg(item)} className='absolute top-[-0.8rem] right-[-0.8rem] rounded-full text-white bg-red-600 cursor-pointer' style={{padding:"0.3rem"}}><FaTimes/></button>
                                            <img src={item?.startsWith("i") ? `${import.meta.env.VITE_IMG_URL}${item}` : item} className='w-full h-full object-cover' alt="" />
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
                            return <option  onClick={() => selectHerbId(item?._id)}  key={item?._id} value={item?._id} className='transition-all duration-200 hover:bg-gray-200 cursor-pointer' style={{padding:"0.4rem"}}>{item?.name_th}</option>
                        })
                    } 
                    </div>
                </div>
                <div className="w-full h-[8vh] overflow-auto relative">
                        <div className="absolute top-0 left-0 w-auto flex gap-3">
                            {
                                selectHerb.length > 0  ? originHerb.filter((item) => selectHerb.includes(item._id)).map((item) => {
                                    return <label key={item?.id} htmlFor="" className='w-[9vw] rounded-lg cursor-pointer bg-gray-200 flex items-center justify-between' style={{padding:"0.5rem"}}>
                                                {item?.name_th} <FaTimes onClick={() => delHerbID(item?._id)}/>
                                            </label>
                                })
                                : <label htmlFor="" style={{marginTop:"1rem"}} className='text-red-600'>โปรดระบุสมุนไพรที่เกี่ยวข้องอย่างน้อย 1 สมุนไพร</label>
                            }
                            
                        </div>
                </div>
            </div>
            <button onClick={() => sendUpdate()} className='w-full justify-center text-xl flex items-center gap-1 cursor-pointer border rounded-lg bg-[#050a44] text-white hover:bg-blue-900' style={{padding:"0.8rem"}}><FaSave/>บันทึก</button>
        </div>
    </div>
  )
}

export default EditResearch