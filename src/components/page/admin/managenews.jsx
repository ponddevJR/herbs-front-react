import React, { useEffect, useState } from "react";
import {
  FaFilter,
  FaPenFancy,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import AdminLoading from "../../layout/admin/adminloading";
import AddNews from "./managenews_components/addnews";
import { deleteNews, getAllNews } from "../../function/news";
import EditNews from "./managenews_components/editnews";
import FilterNews from "./managenews_components/filter-news";
import NewsDetail from "./managenews_components/newsdetail";

const ManageNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeAdd, setActiveAdd] = useState(false);
  const [originalNews, setOriginalNews] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [startSlice, setStartSlice] = useState(0);
  const [endSlide, setEndSlice] = useState(4);
  const [tablePage, setTablePage] = useState(1);
  const [activeEdit, setActiveEdit] = useState(false);
  const [activeNews, setActiveNews] = useState({});
  const [filterActive, setFilterActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeDetail, setActiveDetail] = useState(false);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const news = await getAllNews();
      if (!news?.data?.news) return;
      setOriginalNews(news?.data?.news);
      setNewsData(news?.data?.news);
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [activeAdd]);

  const forwardTable = () => {
    if (tablePage >= newsData.length / 4)
      return Swal.fire(
        "แจ้งเตือน",
        `พบข่าวในระบบ ${newsData.length} ข่าว`,
        "error"
      );

    setStartSlice(endSlide);
    setEndSlice(endSlide + 4);
    setTablePage((prev) => prev + 1);
  };

  const prevTable = () => {
    if (tablePage <= 1) return;

    setStartSlice(startSlice - 4);
    setEndSlice(endSlide - 4);
    setTablePage((prev) => prev - 1);
  };

  const delNews = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "ต้องการลบข่าวนี้หรือไม่?",
      text: "ข้อมูลที่ถูกลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "ลบ",
    });
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const del = await deleteNews(id);
      if (del?.data?.err)
        return Swal.fire("แจ้งเตือน", del?.data?.err, "error");

      Swal.fire("สำเร็จ", del?.data?.mes, "success");
      fetchNews();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้าวได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = (data) => {
    setNewsData(data);
    setTablePage(1);
    setStartSlice(0);
    setEndSlice(4);
  };

  const searchNews = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length < 1 || value === "") {
      setNewsData(originalNews);
    } else {
      setNewsData(
        originalNews.filter(
          (item) =>
            item.title.toLowerCase().includes(value) ||
            item.content.toLowerCase().includes(value) ||
            item.likes.filter((item) => item !== "").length === value ||
            item.dislikes.filter((item) => item !== "").length === value ||
            item.views === value
        )
      );
    }
  };

  return (
    <>
      {isLoading && <AdminLoading />}
      <div className="w-full h-full flex flex-col gap-5">
        {activeAdd && <AddNews onclose={() => setActiveAdd(false)} />}
        {activeEdit && (
          <EditNews
            news={activeNews}
            onclose={() => setActiveEdit(false)}
            fetchNews={() => fetchNews()}
          />
        )}

        <FilterNews
          active={filterActive}
          sendFilterData={filteredData}
          news={originalNews}
          onClose={() => setFilterActive(false)}
        />
        {activeDetail && (
          <NewsDetail
            onClose={() => setActiveDetail(false)}
            news={activeNews}
          />
        )}

        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <FaPlus
              onClick={() => setActiveAdd(true)}
              style={{ padding: "0.3rem 0.5rem" }}
              className="  transition-all duration-200 hover:bg-gray-200 hover:ring rounded-xl text-4xl cursor-pointer border border-gray-400"
            />
            <FaFilter
              onClick={() => setFilterActive(true)}
              style={{ padding: "0.3rem 0.5rem" }}
              className="transition-all duration-200 hover:bg-gray-200 rounded-xl hover:ring text-4xl cursor-pointer border border-gray-400"
            />
            <i
              onClick={() => {
                fetchNews(), setSearchValue("");
              }}
              style={{ padding: "0.5rem" }}
              className="fas fa-rotate-right transition-all duration-200 hover:bg-gray-200 rounded-xl hover:ring text-xl cursor-pointer border border-gray-400"
            ></i>
          </div>
          <div
            className="w-[45%] flex gap-3 items-center border rounded-xl border-[#050a44]"
            style={{ padding: "0.6rem 1rem" }}
          >
            <FaSearch />
            <input
              onChange={searchNews}
              value={searchValue}
              type="text"
              placeholder="ค้นหาข่าวที่นี่"
              className="transition-all duration-200 outline-none w-[95%]"
            />
          </div>
        </div>
        <div className="w-full h-[90%] flex flex-col gap-1">
          <div className="w-full h-[90%] border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#050a44] text-white text-[0.9rem]">
                  <th style={{ padding: "1rem 0" }}>รหัสข่าว</th>
                  <th>พาดหัวข่าว</th>
                  <th>ภาพปก</th>
                  <th>จำนวนผู้อ่าน</th>
                  <th>ถูกใจ</th>
                  <th>ไม่ถูกใจ</th>
                  <th>วันที่เพิ่ม</th>
                  <th>แก้ไขล่าสุด</th>
                  <th>แอคชั่น</th>
                </tr>
              </thead>
              <tbody>
                {newsData?.length > 0 ? (
                  newsData
                    ?.slice()
                    .reverse()
                    .slice(startSlice, endSlide)
                    .map((item) => {
                      return (
                        <tr
                          key={item?._id}
                          className="border-b border-gray-500 text-center transition-all duration-200 hover:bg-gray-100 text-[0.85rem] cursor-pointer"
                        >
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                            className="relative"
                          >
                            {Math.round(
                              (new Date().setHours(0, 0, 0, 0) -
                                new Date(item?.createdAt).setHours(
                                  0,
                                  0,
                                  0,
                                  0
                                )) /
                                (1000 * 60 * 60 * 24) <
                                1
                            ) && (
                              <span
                                className="absolute top-1 left-1 rounded-lg bg-orange-700 text-white"
                                style={{ padding: "0.3rem 0.5rem" }}
                              >
                                ข่าวประจำวันนี้
                              </span>
                            )}

                            {item?._id.substring(0, 10) + "..."}
                          </td>
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                            className="font-bold"
                          >
                            {item?.title.length > 45
                              ? item?.title.substring(0, 45) + "..."
                              : item?.title}
                          </td>
                          <td
                            style={{ padding: "0.6rem 0" }}
                            className="w-[6vw]"
                          >
                            <div className="w-full h-[11vh] ">
                              <img
                                src={`${import.meta.env.VITE_IMG_URL}${
                                  item?.img_url[0]
                                }`}
                                className="w-full h-full object-cover rounded-md border border-gray-500"
                                alt=""
                              />
                            </div>
                          </td>
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                          >
                            {item?.views} คน
                          </td>
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                          >
                            {item?.likes?.filter((item) => item !== "").length}{" "}
                            คน
                          </td>
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                          >
                            {
                              item?.dislikes?.filter((item) => item !== "")
                                .length
                            }{" "}
                            คน
                          </td>
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                          >
                            {new Date(item?.createdAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </td>
                          <td
                            onClick={() => {
                              setActiveNews(item), setActiveDetail(true);
                            }}
                          >
                            {new Date(item?.updatedAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </td>
                          <td>
                            <div
                              style={{ padding: "0.5rem 1rem" }}
                              className="flex flex-col gap-1"
                            >
                              <button
                                onClick={() => {
                                  setActiveDetail(false),
                                    setActiveNews(item),
                                    setActiveEdit(true);
                                }}
                                className="bg-white text-[0.95rem] flex items-center gap-1 border border-gray-400 cursor-pointer shadow justify-center hover:bg-sky-600 hover:text-white rounded-lg"
                                style={{ padding: "0.5rem 0.15rem" }}
                              >
                                <FaPenFancy />
                              </button>
                              <button
                                onClick={() => delNews(item?._id)}
                                className="bg-white text-[0.95rem] flex items-center gap-1 border border-gray-400 cursor-pointer shadow justify-center hover:bg-red-600 hover:text-white rounded-lg"
                                style={{ padding: "0.5rem 0.15rem" }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr className="absolute top-[15rem] left-0 translate-x-[28rem]">
                    <td onClick={() => {fetchNews(),setSearchValue("")}} className="cursor-pointer text-2xl font-blod" style={{ padding: "2rem" }}>
                      <div className="flex flex-col gap-8 items-center">
                        <img src="/img/no_data.png" className="w-[15rem]" alt="" />{" "}
                        <label htmlFor="" className="flex items-center gap-3">ไม่พบข้อมูล</label>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            className="w-full rounded-lg border bg-[#050a44] text-white flex justify-between items-center"
            style={{ padding: "1rem" }}
          >
            <label htmlFor="">
              ข้อมูลข่าวที่พบในระบบ {newsData.length} ข้อมูล
            </label>
            <div className="flex items-center gap-5">
              <button
                onClick={prevTable}
                className="text-2xl cursor-pointer hover:scale-105 active:translate-y-2"
              >
                <i className="fas fa-chevron-circle-left"></i>
              </button>
              <label htmlFor="" className="text-xl">
                {tablePage}
              </label>
              <button
                onClick={forwardTable}
                className="text-2xl cursor-pointer hover:scale-105 active:translate-y-2"
              >
                <i className="fas fa-chevron-circle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageNews;
