import React, { useEffect, useState } from "react";
import {
  getAllNews,
  updateViews,
  updateViewsAndRedirect,
} from "../../../function/news";
import { FaComment, FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    try {
      getAllNews().then((res) => {
        // console.log("🚀 ~ getAllNews ~ res:", res)
        if (!res?.data?.news) return;
        const filteredNewsToday = res?.data?.news.filter(
          (item) =>
            new Date(item.createdAt).toLocaleDateString("th-TH") ===
            new Date().toLocaleDateString("th-TH")
        );
        setNews(
          filteredNewsToday.length > 0
            ? filteredNewsToday
            : res?.data?.news?.sort(
                (a, b) => (b?.likes?.length || 0) - (a?.likes?.length || 0)
              )
        );
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const slideNewsSection = () => {
    const index = slideIndex + 1;
    if (index >= Math.abs(news.length / 4)) return setSlideIndex(0);
    setSlideIndex(index);
  };

  return (
    <div
      id="news-section"
      style={{ marginTop: "2rem" }}
      className="relative w-[81%] flex flex-col gap-7 items-center"
    >
      <button
        style={{ padding: "0.5rem 0.9rem" }}
        onClick={slideNewsSection}
        className="cursor-pointer hover:bg-green-950 active:scale-85 hover:text-white z-10 bg-white rounded-full border border-gray-400 absolute top-[13rem] right-[-3rem]"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
      <label
        htmlFor=""
        style={{ paddingBottom: "0.5rem" }}
        className="w-full flex justify-between text-2xl border-b-4 border-green-900"
      >
        {news?.filter(
          (item) =>
            new Date(item.createdAt).toLocaleDateString("th-TH") ===
            new Date().toLocaleDateString("th-TH")
        ).length > 0
          ? "ข่าวสมุนไพรประจำวันนี้"
          : "ข่าวประจำเดือนนี้"}
        &nbsp;({news.length}){" "}
        <a
          style={{ padding: "0.5rem" }}
          className="transition-all duration-200 rounded-lg hover:bg-green-900 hover:text-white font-normal text-[1rem] text-green-900 cursor-pointer flex gap-2 items-center"
        >
          ดูทั้งหมด <i className="fas fa-chevron-right"></i>
        </a>
      </label>
      <div className="w-full relative overflow-hidden h-[55vh]">
        <div
          className={`transition-all duration-600 translate-x-[-${
            slideIndex * 1260
          }px] absolute top-0 left-0 w-auto h-full flex gap-6 cursor-pointer`}
        >
          {news?.map((item) => {
            return (
              <div
                onClick={() => updateViewsAndRedirect(item)}
                key={item?._id}
                style={{ paddingBottom: "0.8rem" }}
                className="shadow-lg shadow-gray-300 transition-all duration-400 hover:translate-y-3 border-b-4 border-green-700 w-[19vw] h-[85%] flex flex-col gap-2 cursor-pointer"
              >
                <div
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  className="border w-full h-[50%] overflow-hidden"
                >
                  <img
                    src={`${import.meta.env.VITE_IMG_URL}${item?.img_url[0]}`}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div
                  style={{ padding: "0.5rem 0.25rem 0 0.5rem" }}
                  className="w-full h-[50%] justify-between flex flex-col gap-1"
                >
                  <div className="w-full flex flex-col gap-1">
                  <label htmlFor="" className="font-bold text-xl">
                    {item?.title}
                  </label>
                  <label htmlFor="" className="text-[0.85rem] text-gray-600">
                    ข่าวประจำวันที่ :{" "}
                    {new Date(item?.createdAt).toLocaleDateString("th-TH")}
                  </label>
                  </div>
                  <div className="w-full flex items-center justify-between">
                  <label
                    htmlFor=""
                    className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
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
                    className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                  >
                    <FaThumbsUp /> :{" "}
                    {item?.likes?.filter((item) => item !== "").length}
                  </label>
                  <label
                    htmlFor=""
                    className="text-[0.85rem] text-gray-600 flex gap-2 items-center"
                  >
                    <FaThumbsDown /> :{" "}
                    {item?.dislikes?.filter((item) => item !== "").length}
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

export default NewsSection;
