import React, { useEffect, useState } from "react";
import { FaEye, FaThumbsDown, FaThumbsUp, FaTimes } from "react-icons/fa";
import DOMpurify from "dompurify";
import { getHerbs } from "../../../function/herbs";

const NewsDetail = ({ onClose, news }) => {
  const [previewImg, setPreviewImg] = useState(news?.img_url[0]);
  const [herbs, setHerbs] = useState([]);

  useEffect(() => {
    getHerbs().then((res) => {
      if (!res?.data?.herbs) return;
      setHerbs(res?.data?.herbs);
    });
  }, []);

  return (
    <div
      style={{ paddingTop: "48rem" }}
      className="absolute top-0 left-0 w-full h-full overflow-auto flex items-center justify-center bg-[rgba(0,0,0,0.8)]"
    >
      <div
        className="relative flex flex-col gap-8 items-center w-[45%] h-auto bg-white rounded-lg"
        style={{ padding: "2rem", marginBottom: "2.5rem" }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full hover:bg-red-600 hover:text-white cursor-pointer"
          style={{ padding: "0.35rem" }}
        >
          <FaTimes />
        </button>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="" className="font-bold">
            รหัส : {news?._id}
          </label>
          <label htmlFor="" className="font-bold">
            เพิ่มเมื่อวันที่ :{" "}
            {new Date(news?.createdAt).toLocaleDateString("th-TH")}
          </label>
          <label htmlFor="" className="font-bold">
            แก้ไขล่าสุด :{" "}
            {new Date(news?.updatedAt).toLocaleDateString("th-TH")}
          </label>
        </div>
        <div className="w-full flex flex-col gap-3">
          <label
            htmlFor=""
            className="text-xl border-b-2"
            style={{ paddingBottom: "0.5rem" }}
          >
            พาดหัวข่าว
          </label>
          <label htmlFor="" className="font-bold text-xl">
            {news?.title}
          </label>
        </div>
        <div className="w-full flex flex-col gap-3">
          <label
            htmlFor=""
            className="text-xl border-b-2"
            style={{ paddingBottom: "0.5rem" }}
          >
            เนื้อหา
          </label>
          <div className="w-full  h-[55vh] overflow-y-auto">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMpurify.sanitize(news?.content),
              }}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <label
            htmlFor=""
            className="text-xl border-b-2"
            style={{ paddingBottom: "0.5rem" }}
          >
            ภาพข่าว
          </label>
          <div className="w-full h-[40vh] border">
            <img
              src={`${import.meta.env.VITE_IMG_URL}${previewImg}`}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="w-full overflow-auto relative h-[19vh]">
            <div
              className="absolute top-0 left-0 w-auto flex gap-3"
              style={{ padding: "0.35rem" }}
            >
              {news?.img_url?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setPreviewImg(item)}
                    className="cursor-pointer w-[11vw] h-[15vh] border transition=all duration-200 hover:ring-2 hover:ring-[#050a44]"
                  >
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}${item}`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <label
            htmlFor=""
            className="text-xl border-b-2"
            style={{ paddingBottom: "0.5rem" }}
          >
            สมุนไพรที่เกี่ยวข้อง
          </label>
          <div className="w-full overflow-auto relative h-[7vh]">
            <div
              className="absolute top-0 left-0 w-auto flex gap-2"
              style={{ padding: "0.35rem" }}
            >
              {herbs
                .filter((item) => news?.herbs_id?.includes(item._id))
                .map((item) => {
                  return (
                    <label
                      htmlFor=""
                      style={{ padding: "0.35rem 0.8rem" }}
                      className="bg-gray-300 rounded-lg"
                    >
                      {item?.name_th}
                    </label>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <label htmlFor="" className="flex items-center gap-1">
            <FaEye /> : {news?.views} คน
          </label>
          <span className="flex items-center gap-5">
            <label htmlFor="" className="flex items-center gap-1">
              <FaThumbsUp /> :{" "}
              {news?.likes?.filter((item) => item !== "").length} คน
            </label>
            <label htmlFor="" className="flex items-center gap-1">
              <FaThumbsDown /> :{" "}
              {news?.dislikes?.filter((item) => item !== "").length} คน
            </label>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
