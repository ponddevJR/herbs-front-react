import React, { useEffect } from "react";
import { useState } from "react";
import { getAllResearch, updateViews } from "../../../function/research";
import { FaComment, FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const ResearchSection = () => {
  const [researchs, setResearchs] = useState([]);
  const [slideIndex,setSliceIndex] = useState(0);

  useEffect(() => {
    try {
      getAllResearch().then((res) => {
        console.log("🚀 ~ getAllResearch ~ res:", res);
        if (!res?.data?.data) return;
        setResearchs(res?.data?.data);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const slide = () => {
    const newIndex = slideIndex + 1;
    const maxIndex = Math.max(0, (researchs.length - 1) / 4); // ป้องกันค่า index ติดลบ
    setSliceIndex(newIndex >= maxIndex ? 0 : newIndex);
  };
  

  return (
    <div style={{marginBottom:"10rem"}} className="w-[81%] flex flex-col gap-5 items-center relative">
      <label
        htmlFor=""
        style={{ paddingBottom: "0.5rem" }}
        className="border-b-4 border-green-900 text-2xl w-full flex items-center justify-between"
      >
        งานวิจัยที่คุณอาจสนใจ
        <span
          style={{ padding: "0.55rem" }}
          className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-green-900 hover:text-white text-[1rem] flex items-center gap-2 text-green-800"
        >
          ดูทั้งหมด <i className="fas fa-chevron-right"></i>
        </span>
      </label>
      <button
      onClick={slide}
        style={{ padding: "0.5rem 0.9rem" }}
        className="bg-white rounded-full border border-gray-400 absolute top-[15rem] right-[-2.5rem] shadow-lg hover:bg-green-950 hover:text-white z-30"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="w-full h-[53vh] relative overflow-hidden">
      <div
          className="w-auto h-full flex gap-5 absolute top-0 left-0 transition-all duration-700 ease-in-out"
          style={{ transform: `translateX(-${slideIndex * 1260}px)` }}
          >

          {researchs.sort((a,b) => (b.likes.length || 0) - (a.likes.length || 0)).map((item) => {
            return (
              <div
                onClick={() => updateViews(item)}
                key={item?._id}
                style={{ paddingBottom: "0.1rem" }}
                className="cursor-pointer transition-all duration-200 hover:shadow-2xl border-b-4 border-green-700 rounded-tl-lg rounded-tr-lg overflow-hidden w-[19.3vw] h-full flex flex-col gap-1"
              >
                <div className="w-full h-[45%]">
                  <img
                    src={
                      item?.imgs[0].startsWith("i")
                        ? `${import.meta.env.VITE_IMG_URL}${item?.imgs[0]}`
                        : item?.imgs[0]
                    }
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div
                  style={{ padding: "0.3rem" }}
                  className="w-full h-[55%] justify-between flex flex-col gap-1"
                >
                  <div className="w-full flex flex-col ">
                    <label htmlFor="" className="text-xl font-bold">
                      {item?.title.length > 80
                        ? item?.title.slice(0, 80) + "..."
                        : item?.title}
                    </label>
                    <label htmlFor="" className="text-[0.9rem] text-gray-700">
                      ปี : {item?.year}
                    </label>
                    <label htmlFor="" className="text-[0.9rem] text-gray-700">
                      โดย :{" "}
                      {item?.author.length > 70
                        ? item?.author.slice(0, 70) + "..."
                        : item?.author}
                    </label>
                  </div>
                  <div style={{padding:"0 0 0.3rem 0.3rem"}} className="w-full flex items-center justify-between gap-2">
                    <label
                      htmlFor=""
                      className="text-[0.85rem] text-gray-700 flex items-center gap-1"
                    >
                      <FaEye /> : {item?.views} คน
                    </label>
                    <span className="flex items-center gap-3.5">
                      <label
                        htmlFor=""
                        className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                      >
                        <FaComment /> :{" "}
                        {item?.comment_id?.filter((item) => item !== "").length}
                      </label>
                    <label
                      htmlFor=""
                      className="text-[0.85rem] text-gray-700 flex items-center gap-1"
                    >
                      <FaThumbsUp /> :{" "}
                      {item?.likes?.filter((item) => item !== "").length} คน
                    </label>
                    <label
                      htmlFor=""
                      className="text-[0.85rem] text-gray-700 flex items-center gap-1"
                    >
                      <FaThumbsDown /> :{" "}
                      {item?.dislikes?.filter((item) => item !== "").length} คน
                    </label>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResearchSection;
