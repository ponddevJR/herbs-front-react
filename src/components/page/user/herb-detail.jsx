import React, { useEffect, useState } from "react";
import Navbar from "../../layout/navbar";
import { Link, useParams } from "react-router-dom";
import Loading from "../../layout/loading";
import { getHerbs } from "../../function/herbs";
import { getAllCategories } from "../../function/category";
import { getAllNews, updateViewsAndRedirect } from "../../function/news";
import { FaComment, FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { getAllResearch, updateViews } from "../../function/research";
import Footer from "../../layout/footer";
import Comment from "../../layout/comment";

const HerbDetail = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [herb, setHerb] = useState({ imgs: [""] });
  const [mainImg, setMainImg] = useState("");
  const [categories, setCategories] = useState([]);
  const [otherHerbs, setOtherHerbs] = useState([]);
  const [slideIndex, setSliceIndex] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0);
  const [researchSlide, setResearchSldie] = useState(0);
  const [newsData, setNewsData] = useState([]);
  const [researchs, setResearchs] = useState([]);
  const id = params.id;

  const getResearchs = async () => {
    try {
      const res = await getAllResearch();
      if (!res?.data?.data) return;
      const filter = res?.data?.data?.filter((item) =>
        item?.herbs_id?.includes(herb._id)
      );
      console.log("🚀 ~ getResearchs ~ filter:", filter)
      setResearchs(filter?.length > 0 ? filter : res?.data?.data);
    } catch (error) {
      console.error(error);
    } 
  };

  const fetchHerbs = () => {
    getHerbs().then((res) => {
      if (!res?.data?.herbs) return;
      const herbs = res?.data?.herbs;
      const thisHerb = herbs.find((item) => item._id === id);
      if (!thisHerb) return;
      setHerb(thisHerb);
      setMainImg(thisHerb.imgs[0]);

      const filteredOther = herbs.filter((h) =>
        h.categories.some((id) => new Set(thisHerb.categories).has(id))
      );
      setOtherHerbs(
        filteredOther.filter((item) => item._id !== thisHerb._id)
      );
    });
  }

  useEffect(() => {
    try {
      getAllCategories().then((res) => {
        if (!res?.data?.categories) return;
        setCategories(res?.data?.categories);
      });
     fetchHerbs();
    } catch (err) {
      console.error(err);
    }
  }, [params]);

  useEffect(() => {
    getResearchs();
    getAllNews().then((res) => {
      if (!res?.data?.news) return;
      const news = res?.data?.news;
      const filteredDateNews = news.filter(
        (item) =>
          new Date(item.createdAt).toLocaleDateString("th-TH") ===
          new Date().toLocaleDateString("th-TH")
      );

      setNewsData(filteredDateNews.length > 0 ? filteredDateNews : news);
    });
  }, [herb]);

  const slide = (state, setState, el, arr) => {
    const newIndex = state + 1;
    const maxIndex = Math.ceil(arr.length / el); // ป้องกันค่า index ติดลบ
    setState(newIndex >= maxIndex ? 0 : newIndex);
  };

  return (
    <>
      {isLoading && <Loading />}
      <Navbar />
      <div
        className="w-screen h-screen flex flex-col items-center"
        style={{ padding: "6.5rem 0" }}
      >
        <div className="w-[65%] flex flex-col gap-5 ">
          <div className="w-full h-[65vh] border shadow-lg">
            <img
              src={
                mainImg.startsWith("i")
                  ? `${import.meta.env.VITE_IMG_URL}${mainImg}`
                  : mainImg
              }
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="w-full h-[16vh] flex items-center  relative overflow-hidden">
            <div
              style={{ padding: "0.3rem" }}
              className="flex gap-3 items-center w-auto absolute top-0 left-0"
            >
              {herb?.imgs?.map((item, index) => {
                return (
                  <div
                    onMouseEnter={() => setMainImg(item)}
                    key={index}
                    className="transition-all duration-200 hover:ring-2 hover:ring-[#0a2d1e] w-[8vw] h-[13vh] border border-gray-400"
                  >
                    <img
                      src={
                        item?.startsWith("i")
                          ? `${import.meta.env.VITE_IMG_URL}${item}`
                          : item
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{ marginBottom: "1.5rem" }}
            className="w-full flex flex-col gap-4"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.35rem", marginBottom: "0.5rem" }}
              className="border-b-4 border-green-800 font-bold text-3xl"
            >
              {herb?.name_th}
            </label>
            <div className="w-full flex gap-4 ">
              <label htmlFor="" className="text-xl text-gray-500">
                ชื่อวิทยาศาสตร์ :{" "}
              </label>
              <label htmlFor="" className="text-xl">
                {herb?.name_science}
              </label>
            </div>
            <div className="w-full flex gap-4 ">
              <label htmlFor="" className="text-xl text-gray-500">
                ชื่อสามัญ :{" "}
              </label>
              <label htmlFor="" className="text-xl">
                {herb?.name_normal}
              </label>
            </div>
            <div className="w-full flex gap-4 break-words">
              <label htmlFor="" className="text-gray-500">
                จัดอยู่ในหมวดหมู่ :{" "}
              </label>
              <label htmlFor="" className="">
                {categories
                  ?.filter((item) => herb?.categories?.includes(item?._id))
                  .map((item) => item?.ctg_name)
                  .join(",")}
              </label>
            </div>
          </div>
          <div
            style={{ marginBottom: "1.5rem" }}
            className="w-full flex flex-col gap-4"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.35rem", marginBottom: "0.5rem" }}
              className="border-b-4 border-green-800 font-bold text-3xl"
            >
              ลักษณะทางพกฤษศาสตร์
            </label>
            <p className="w-full break-words leading-relaxed">
              {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + herb?.herbs_look}
            </p>
          </div>
          <div
            style={{ marginBottom: "1.5rem" }}
            className="w-full flex flex-col gap-4"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.35rem", marginBottom: "0.5rem" }}
              className="border-b-4 border-green-800 font-bold text-3xl"
            >
              การนำไปใช้
            </label>
            <p className="w-full break-words leading-relaxed">
              {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + herb?.usage}
            </p>
          </div>
          <div
            style={{ marginBottom: "1.5rem" }}
            className="w-full flex flex-col gap-4"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.35rem", marginBottom: "0.5rem" }}
              className="border-b-4 border-green-800 font-bold text-3xl"
            >
              สรรพคุณ
            </label>
            <p className="w-full break-words leading-relaxed tracking-wider">
              {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + herb?.benefits}
            </p>
          </div>

          <div
            style={{ margin: "2rem 0" }}
            className="w-full relative flex flex-col gap-3"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.5rem" }}
              className="w-full flex justify-between text-xl border-b-2"
            >
              สมุนไพรที่คล้ายกัน({otherHerbs.length}){" "}
              <Link className="text-[#0a2d1e] text-[0.9rem]">ดูทั้งหมด</Link>
            </label>
            <button
              onClick={() => slide(slideIndex, setSliceIndex, 3, otherHerbs)}
              className="absolute top-[12rem] right-[-1.5rem] rounded-full shadow cursor-pointer z-10 border border-gray-300 hover:bg-[#0a2d1e] hover:text-white active:scale-85"
              style={{ padding: "0.3rem 0.7rem" }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="w-full h-[48vh] relative overflow-hidden">
              <div
                style={{ transform: `translateX(-${slideIndex * 998}px)` }}
                className={`transition-all duration-700 w-auto h-full absolute top-0 left-0 flex gap-7`}
              >
                {otherHerbs.length > 0 ? (
                  otherHerbs.map((item) => {
                    return (
                      <a key={item?._id} href={`/herbdetail/${item._id}`}>
                        <div className="transition-all duration-200 hover:bg-gray-100 w-[20vw] h-[98%] border-b-4 border-green-800 cursor-pointer flex flex-col gap-2">
                          <div className="w-full h-[45%]">
                            <img
                              src={
                                item?.imgs[0].startsWith("i")
                                  ? `${import.meta.env.VITE_IMG_URL}${
                                      item?.imgs[0]
                                    }`
                                  : item?.imgs[0]
                              }
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <div
                            style={{ padding: "0.2rem" }}
                            className="w-full flex flex-col"
                          >
                            <label htmlFor="" className="font-bold text-lg">
                              {item?.name_th}
                            </label>
                            <label
                              htmlFor=""
                              className="text-[0.8rem] text-gray-700"
                            >
                              {categories
                                .filter((ctg) =>
                                  item?.categories.includes(ctg._id)
                                )
                                .map((ctg) => ctg.ctg_name)
                                .join(",")
                                .substring(0, 25) + "..."}
                            </label>

                            <p
                              style={{ margin: "0.3rem 0" }}
                              className="text-[0.8rem] leading-relaxed"
                            >
                              {item?.benefits?.length > 150
                                ? item?.benefits?.substring(0, 150) + "..."
                                : item?.benefits}
                            </p>
                            <label
                              htmlFor=""
                              className="text-[0.8rem] text-gray-600"
                            >
                              แก้ไขล่าสุด{" "}
                              {new Date(item?.updatedAt).toLocaleDateString(
                                "th-TH"
                              )}{" "}
                              {new Date(item?.updatedAt).toLocaleTimeString(
                                "th-Th"
                              )}
                            </label>
                          </div>
                        </div>
                      </a>
                    );
                  })
                ) : (
                  <div className="">ไม่พบสมุนไพรที่ใกล้เคียงกัน</div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{ margin: "2rem 0" }}
            className="w-full relative flex flex-col gap-3"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.5rem" }}
              className="w-full flex justify-between text-xl border-b-2"
            >
              {newsData.filter((item) => item.herbs_id.includes(herb._id))
                .length > 0
                ? `ข่าวที่เกี่ยวข้องกับ "${herb?.name_th}"`
                : "ข่าวที่คุณอาจสนใจ"}{" "}
              (
              {newsData.filter((item) => item.herbs_id.includes(herb._id))
                .length > 0
                ? newsData.filter((item) => item.herbs_id.includes(herb._id))
                    .length
                : newsData.length}
              ){" "}
              <Link className="text-[#0a2d1e] text-[0.9rem]">
                ดูข่าวทั้งหมด
              </Link>
            </label>
            {newsData.length > 3 && (
              <button
                onClick={() =>
                  slide(researchSlide, setResearchSldie, 4, newsData)
                }
                className="absolute top-[12rem] right-[-1.5rem] rounded-full shadow cursor-pointer z-10 border border-gray-300 hover:bg-[#0a2d1e] hover:text-white active:scale-85"
                style={{ padding: "0.3rem 0.7rem" }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
            <div className="w-full h-[40vh] relative overflow-hidden">
              <div
                style={{ transform: `translateX(-${newsSlide * 998}px)` }}
                className={` transition-all duration-700 w-auto h-full absolute top-0 left-0 flex gap-7`}
              >
                {newsData?.filter((item) => item.herbs_id.includes(herb._id))
                  .length > 0
                  ? newsData
                      .filter((item) => item.herbs_id.includes(herb._id))
                      .sort(
                        (a, b) =>
                          (b?.likes?.length || 0) - (a?.likes?.length || 0)
                      )
                      .map((item) => {
                        return (
                          <a
                            key={item?._id}
                            onClick={() => updateViewsAndRedirect(item)}
                          >
                            <div className="transition-all duration-200 hover:bg-gray-100 w-[16vw] h-full border-b-4 border-green-800 cursor-pointer flex flex-col gap-2">
                              <div className="w-full h-[40%]">
                                <img
                                  src={
                                    import.meta.env.VITE_IMG_URL +
                                    item?.img_url[0]
                                  }
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              </div>
                              <div
                                style={{ padding: "0.2rem" }}
                                className="w-full flex flex-col h-[60%] justify-between"
                              >
                                <div className="w-full flex flex-col gap-1">
                                  <label
                                    htmlFor=""
                                    className="font-bold text-xl"
                                  >
                                    {item?.title}
                                  </label>
                                  <label htmlFor="" className="text-gray-600">
                                    ข่าวประจำวันที่ :{" "}
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleDateString("th-TH")}
                                  </label>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                  <label
                                    htmlFor=""
                                    className="text-gray-600 text-[0.85rem] flex gap-1 items-center"
                                  >
                                    <FaEye /> : {item?.views}
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
                                      className="text-gray-600 text-[0.85rem] flex gap-1 items-center"
                                    >
                                      <FaThumbsUp /> :{" "}
                                      {
                                        item?.likes?.filter(
                                          (item) => item !== ""
                                        )?.length
                                      }
                                    </label>
                                    <label
                                      htmlFor=""
                                      className="text-gray-600 text-[0.85rem] flex gap-1 items-center"
                                    >
                                      <FaThumbsDown /> :{" "}
                                      {
                                        item?.dislikes?.filter(
                                          (item) => item !== ""
                                        )?.length
                                      }
                                    </label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        );
                      })
                  : newsData
                      ?.sort(
                        (a, b) =>
                          (b?.likes?.length || 0) - (a?.likes?.length || 0)
                      )
                      ?.map((item) => {
                        return (
                          <a
                            key={item?._id}
                            onClick={() => updateViewsAndRedirect(item)}
                          >
                            <div className="transition-all duration-200 hover:bg-gray-100 w-[16vw] h-full border-b-4 border-green-800 cursor-pointer flex flex-col gap-2">
                              <div className="w-full h-[40%]">
                                <img
                                  src={
                                    import.meta.env.VITE_IMG_URL +
                                    item?.img_url[0]
                                  }
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              </div>
                              <div
                                style={{ padding: "0.2rem" }}
                                className="w-full flex flex-col h-[60%] justify-between"
                              >
                                <div className="w-full flex flex-col gap-1">
                                  <label
                                    htmlFor=""
                                    className="font-bold text-xl"
                                  >
                                    {item?.title}
                                  </label>
                                  <label htmlFor="" className="text-gray-600">
                                    ข่าวประจำวันที่ :{" "}
                                    {new Date(
                                      item?.createdAt
                                    ).toLocaleDateString("th-TH")}
                                  </label>
                                </div>
                                <div className="w-full flex justify-between items-center">
                                  <label
                                    htmlFor=""
                                    className="text-gray-600 text-[0.85rem] flex gap-1 items-center"
                                  >
                                    <FaEye /> : {item?.views}
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
                                      className="text-gray-600 text-[0.85rem] flex gap-1 items-center"
                                    >
                                      <FaThumbsUp /> :{" "}
                                      {
                                        item?.likes?.filter(
                                          (item) => item !== ""
                                        )?.length
                                      }
                                    </label>
                                    <label
                                      htmlFor=""
                                      className="text-gray-600 text-[0.85rem] flex gap-1 items-center"
                                    >
                                      <FaThumbsDown /> :{" "}
                                      {
                                        item?.dislikes?.filter(
                                          (item) => item !== ""
                                        )?.length
                                      }
                                    </label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        );
                      })}
              </div>
            </div>
          </div>

          <div
            style={{ margin: "2rem 0" }}
            className="w-full relative flex flex-col gap-4"
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "0.5rem" }}
              className="w-full flex justify-between text-xl border-b-2"
            >
              งานวิจัยที่เกี่ยวข้องกับ "{herb?.name_th}"
              <Link className="text-[#0a2d1e] text-[0.9rem]">
                ดูงานวิจัยทั้งหมด
              </Link>
            </label>
            {researchs.length > 3 && (
              <button
                onClick={() =>
                  slide(researchSlide, setResearchSldie, 3, researchs)
                }
                className="bg-white absolute top-[12rem] right-[-1.5rem] rounded-full shadow cursor-pointer z-10 border border-gray-300 hover:bg-[#0a2d1e] hover:text-white active:scale-85"
                style={{ padding: "0.3rem 0.7rem" }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
            <div className="w-full relative overflow-hidden h-[45vh]">
              <div
                style={{ transform: `translateX(-${researchSlide * 998}px)` }}
                className="transtion-all duration-500 w-auto absolute top-0 left-0 h-full flex gap-4"
              >
                {researchs
                  .sort((a, b) => (b.likes.length || 0) - (a.likes.length || 0))
                  .map((item) => {
                    return (
                      <div
                        onClick={() => updateViews(item)}
                        key={item?._id}
                        style={{ paddingBottom: "0.3rem" }}
                        className="cursor-pointer hover:bg-gray-200 w-[18vw] h-full flex flex-col gap-1 border-b-4 border-green-600"
                      >
                        <div className=" w-full h-[45%] rounded-tr-lg rounded-tl-lg overflow-hidden">
                          <img
                            src={
                              item?.imgs[0].startsWith("i")
                                ? import.meta.env.VITE_IMG_URL + item?.imgs[0]
                                : item?.imgs[0]
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div
                          style={{ padding: "0.35rem" }}
                          className="w-full flex flex-col justify-between h-[55%]"
                        >
                          <div className="w-full flex flex-col h-[55%] justify-between">
                            <label htmlFor="" className="text-xl font-bold">
                              {item?.title.length > 50
                                ? item?.title.slice(0, 50) + "..."
                                : item?.title}
                            </label>
                            <label
                              htmlFor=""
                              className="text-[0.9rem] text-gray-600"
                            >
                              โดย :{" "}
                              {item?.author.length > 30
                                ? item?.author.slice(0, 25) + "..."
                                : item?.author}
                            </label>
                            <label
                              htmlFor=""
                              className="text-[0.9rem] text-gray-600"
                            >
                              ปี : {item?.year}
                            </label>
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <label
                              htmlFor=""
                              className="text-gray-700 flex gap-1 items-center text-[0.9rem]"
                            >
                              <FaEye /> : {item?.views}
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
                                className="text-gray-700 flex gap-1 items-center text-[0.9rem]"
                              >
                                <FaThumbsUp /> :{" "}
                                {
                                  item?.likes?.filter((item) => item !== "")
                                    .length
                                }
                              </label>
                              <label
                                htmlFor=""
                                className="text-gray-700 flex gap-1 items-center text-[0.9rem]"
                              >
                                <FaThumbsUp /> :{" "}
                                {
                                  item?.dislikes?.filter((item) => item !== "")
                                    .length
                                }
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
          <div className="w-full">
            <Comment updateData={() => fetchHerbs()} commentList={herb?.comment_id || []} type={"herbs"} mainId={herb?._id} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HerbDetail;
