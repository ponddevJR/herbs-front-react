import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Emoji from "emoji.json";

const EmotionComponents = ({type,sendToOpenEdit, openAddPost,sendEmotion}) => {
    const [emotions] = useState(Emoji.slice(0, 113)); // เก็บรายการทั้งหมด
    const [translatedEmotions, setTranslatedEmotions] = useState({}); 
    const [searchText, setSearchText] = useState("");
    const [filteredEmotions, setFilteredEmotions] = useState(Emoji.slice(0, 113));
    const [isLoading,setIsLoading] = useState(false);

    const searchEmotion = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        if (value === "") {
            setFilteredEmotions(emotions);
        } else {
            setFilteredEmotions(
                emotions.filter((item) => {
                    const translated = translatedEmotions[item.codes] || "";
                    return item.name.toLowerCase().includes(value) || translated.includes(value);
                })
            );
        }
    };

    useEffect(() => {
        const translateAll = async () => {
            const translations = {};
            for (const item of emotions) {
                const translatedText = await translateText(item.name);
                translations[item.codes] = translatedText;
            }
            setTranslatedEmotions(translations);
        };

        translateAll();
    }, [emotions]); 

    async function translateText(text, targetLang = 'th') {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const result = await response.json();
            return result[0].map(item => item[0]).join('');
        } catch (error) {
            console.error('Error translating text:', error);
            return text; 
        }finally{
            setIsLoading(false);
        }
    }

    const backToAddPost = (codes) => {
        if(type === "edit"){
            sendToOpenEdit(codes);
        }else{
            sendEmotion(codes);
        }
        openAddPost();
    }

  return (
    <div className='z-[60] fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.8)]'>
        <div className="relative w-[30%] flex flex-col gap-4 items-center bg-white rounded-lg border shadow-md shadow-gray-500" style={{padding:"1rem"}}>
            <button onClick={openAddPost} className='text-lg absolute top-2 left-2 rounded-full hover:bg-gray-200' style={{padding:"0.35rem"}}>
                <FaArrowLeft/>
            </button>

            <label htmlFor="" className='text-xl font-bold'>ความรู้สึก</label>
            {
                isLoading && <label htmlFor="" className='text-[0.75rem] text-red-600'>*กำลังแปลภาษาอาจใช้เวลานาน โปรดรอสักครู่...</label>
            }
            <div className="w-full rounded-xl bg-gray-200 flex items-center gap-2" style={{padding:"0.35rem 0.5rem"}}>
                <FaSearch/> <input value={searchText} onChange={searchEmotion} type="text" className='outline-none border-none w-[90%]' placeholder='ค้นหา' />
            </div>
            <div style={{padding:"0.5rem"}} className="relative w-full grid grid-cols-2 gap-5 h-[50vh] overflow-auto">
            {
                filteredEmotions.map((item) => {
                    return <button disabled={isLoading} key={item?.codes} style={{padding:"0.35rem"}} onClick={() => backToAddPost({...item,th:translatedEmotions[item.codes]})} className='text-left w-auto h-[6.5vh] rounded-lg hover:bg-gray-200 flex items-center gap-2'>
                                <label htmlFor="" className='text-xl rounded-full bg-gray-300' style={{padding:"0.25rem"}}>{item?.char}</label>
                                <label htmlFor="" className='text-[0.8rem]'>{translatedEmotions[item.codes] || "แปลไทย..."}</label>
                            </button>
                })
            }
            </div>
           
        </div>
    </div>
  )
}

export default EmotionComponents 