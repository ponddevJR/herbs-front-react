import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEye,
  FaFilter,
  FaPenAlt,
  FaPlus,
  FaSearch,
  FaThumbsDown,
  FaThumbsUp,
  FaTrash,
} from "react-icons/fa";
import AddResearch from "./manageresearch_components/add-research";
import { deleteResearch, getAllResearch } from "../../function/research";
import AdminLoading from "../../layout/admin/adminloading";
import Detail from "./manageresearch_components/detail";
import EditResearch from "./manageresearch_components/edit-research";
import FilterResearch from "./manageresearch_components/filter-research";

const ManageResearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeAdd, setActiveAdd] = useState(false);
  const [originalResearchs, setOriginalResearchs] = useState([]);
  const [researchs, setResearchs] = useState([]);
  const [activeDetail, setActiveDetail] = useState(false);
  const [activeResearch, setActiveResearch] = useState({});
  const [page, setPage] = useState(1);
  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(4);
  const [activeEdit, setActiveEdit] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const getAllResearchs = async () => {
    setIsLoading(true);
    try {
      const getData = await getAllResearch();
      if (!getData?.data?.data) return;

      setOriginalResearchs(getData?.data?.data);
      setResearchs(getData?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllResearchs();
  }, [activeAdd,activeDetail]);

  const removeResearch = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "ต้องการลบงานวิจัยนี้หรือไม่",
      text: "ข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ไม่ต้องการ",
      confirmButtonText: "ลบ",
    });
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const del = await deleteResearch(id);
      if (del?.data?.err)
        return Swal.fire("แจ้งเตือน", del?.data?.err, "error");

      await Swal.fire("สำเร็จ", del?.data?.mes, "success");
      getAllResearchs();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    getAllResearchs();
    setPage(1);
    setStartSlice(0);
    setEndSlice(4);
  };

  const forwardPage = () => {
    if (page >= researchs.length / 4)
      return Swal.fire(
        "แจ้งเตือน",
        `พบงานวิจัยในระบบ ${researchs.length} วิจัย`,
        "error"
      );
    setPage((prev) => prev + 1);
    setStartSlice(endSlice);
    setEndSlice((prev) => prev + 4);
  };

  const prevPage = () => {
    if (page <= 1) return;

    setStartSlice(startSlice - 4);
    setEndSlice(endSlice - 4);
    setPage(prev => prev - 1);
  };

  const getFiltered = (data) => {
    setResearchs(data);
    setPage(1);
    setStartSlice(0);
    setEndSlice(4);
  };

  const searchResearch = (e) => {
    const value = e.target.value;
    if (value.length < 1 || value === "")
      return setResearchs(originalResearchs);
    setResearchs(
      originalResearchs.filter(
        (item) =>
          item?.title.toLowerCase().includes(value.toLowerCase()) ||
          item?.author.toLowerCase().includes(value.toLowerCase()) ||
          item?.objective?.toLowerCase().includes(value.toLowerCase())
      )
    );
    setPage(1);
    setStartSlice(0);
    setEndSlice(4);
  };

  return (
    <>
      {isLoading && <AdminLoading />}
      {activeDetail && (
        <Detail
          research={activeResearch}
          onclose={() => setActiveDetail(false)}
        />
      )}
      {activeEdit && (
        <EditResearch
          getAllResearch={getAllResearchs}
          research={activeResearch}
          onclose={() => setActiveEdit(false)}
        />
      )}
      {activeFilter && (
        <FilterResearch
          sendFilterData={getFiltered}
          data={originalResearchs}
          onclose={() => setActiveFilter(false)}
        />
      )}
      <div className="w-full h-full flex flex-col ">
        {activeAdd && <AddResearch onclose={() => setActiveAdd(false)} />}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveAdd(true)}
              style={{ padding: "0.5rem" }}
              className="rounded-full text-lg ring  hover:bg-[#050a44] hover:text-white active:-translate-y-1 cursor-pointer"
            >
              <FaPlus />
            </button>
            <button
              onClick={() => setActiveFilter(true)}
              style={{ padding: "0.5rem" }}
              className="rounded-full text-lg ring  hover:bg-[#050a44] hover:text-white active:-translate-y-1 cursor-pointer"
            >
              <FaFilter />
            </button>
            <button
              onClick={refreshData}
              style={{ padding: "0.25rem 0.5rem" }}
              className="rounded-full text-lg ring  hover:bg-[#050a44] hover:text-white active:-translate-y-1 cursor-pointer"
            >
              <i className="fas fa-rotate"></i>
            </button>
          </div>
          <div
            style={{ padding: "0.6rem 0.8rem" }}
            className="w-[40%] flex items-center gap-2 border border-gray-600 rounded-lg"
          >
            <FaSearch />
            <input
              onChange={searchResearch}
              type="text"
              className="outline-none w-[95%]"
              placeholder="พิมพ์ค้นหางานวิจัยที่คุณต้องการ"
            />
          </div>
        </div>
        <div
          style={{
            marginTop: "1.8rem",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
          className="w-full h-[90%] overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-[#0F172A] text-white text-[1rem]">
                <th style={{ padding: "1.5rem" }}>รหัส</th>
                <th>หัวข้อ</th>
                <th>ผู้ทำวิจัย</th>
                <th>รูปภาพ</th>
                <th>
                  <label
                    htmlFor=""
                    className="flex items-center gap-1 text-[0.9rem]"
                  >
                    <FaEye /> (คน)
                  </label>
                </th>
                <th>
                  <label
                    htmlFor=""
                    className="flex items-center gap-1 text-[0.9rem]"
                  >
                    <FaThumbsUp /> (คน)
                  </label>
                </th>
                <th>
                  <label
                    htmlFor=""
                    className="flex items-center gap-1 text-[0.9rem]"
                  >
                    <FaThumbsDown /> (คน)
                  </label>
                </th>
                <th>วันที่เพิ่ม</th>
                <th>แก้ไขล่าสุด</th>
                <th>แอคชั่น</th>
              </tr>
            </thead>
            <tbody>
              {researchs.length > 0 ? (
                researchs
                  .slice()
                  .reverse()
                  .slice(startSlice, endSlice)
                  .map((item) => {
                    return (
                      <tr
                        key={item?._id}
                        className="border border-gray-600 text-center  text-[0.85rem] transition-all duration-200 hover:bg-gray-200 cursor-pointer"
                      >
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                          style={{ padding: "0.5rem" }}
                        >
                          {item?._id.substring(0, 10) + "..."}
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                          className="font-bold"
                        >
                          {item?.title.length > 15
                            ? item?.title.substring(0, 15) + "..."
                            : item?.title}
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                        >
                          {item?.author.length > 20
                            ? item?.author.substring(0, 20) + "..."
                            : item?.author}
                        </td>
                        <td
                          className=" flex items-center justify-center"
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                          style={{ paddingLeft: "0.25rem" }}
                        >
                          <div
                            style={{ padding: "0.5rem" }}
                            className="w-[6vw] h-[12vh] rounded-lg"
                          >
                            <img
                              src={
                                item?.imgs[0].startsWith("i")
                                  ? `${import.meta.env.VITE_IMG_URL}${
                                      item?.imgs[0]
                                    }`
                                  : item?.imgs[0]
                              }
                              className="border border-gray-500 w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                        >
                          {item?.views}
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                        >
                          {item?.likes?.filter((item) => item !== "").length}
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                        >
                          {item?.dislikes?.filter((item) => item !== "").length}
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                        >
                          {new Date(item?.createdAt).toLocaleDateString(
                            "th-TH"
                          )}
                        </td>
                        <td
                          onClick={() => {
                            setActiveResearch(item), setActiveDetail(true);
                          }}
                        >
                          {new Date(item?.updatedAt).toLocaleDateString(
                            "th-TH"
                          )}
                        </td>
                        <td>
                          <div
                            className="flex flex-col gap-1 items-center"
                            style={{ padding: "0 1.5rem" }}
                          >
                            <button
                              onClick={() => {
                                setActiveResearch(item), setActiveEdit(true);
                              }}
                              style={{ padding: "0.5rem" }}
                              className="bg-white cursor-pointer hover:text-white hover:bg-black rounded-lg border flex items-center w-[3vw] justify-center"
                            >
                              <FaPenAlt />
                            </button>
                            <button
                              onClick={() => {
                                setActiveDetail(false),
                                  removeResearch(item?._id);
                              }}
                              style={{ padding: "0.5rem" }}
                              className="bg-white cursor-pointer hover:text-white hover:bg-red-600 rounded-lg border flex items-center w-[3vw] justify-center"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr className="absolute top-[18rem] left-0 translate-x-[28rem]">
                  <td
                    onClick={() => {
                      getAllResearch();
                    }}
                    className="cursor-pointer text-2xl font-blod"
                    style={{ padding: "2rem" }}
                  >
                    <div className="flex flex-col gap-8 items-center">
                      <img
                        src="/img/no_herb.png"
                        className="w-[15rem]"
                        alt=""
                      />{" "}
                      <label htmlFor="" className="flex items-center gap-3">
                        ไม่พบข้อมูล
                      </label>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div
          className="w-full flex items-center justify-between bg-[#0F172A] text-white"
          style={{
            padding: "1.5rem",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
          <label htmlFor="">ข้อมูลงานวิจัยที่พบ {researchs.length} วิจัย</label>
          <span className="flex items-center gap-8">
            <button
              onClick={prevPage}
              style={{ padding: "0.3rem" }}
              className="text-xl rounded-full hover:bg-white hover:text-black text-white"
            >
              <FaArrowLeft />
            </button>
            <label htmlFor="" className="text-xl">
              {page}
            </label>
            <button
              onClick={forwardPage}
              style={{ padding: "0.3rem" }}
              className="text-xl rounded-full hover:bg-white hover:text-black text-white"
            >
              <FaArrowRight />
            </button>
          </span>
        </div>
      </div>
    </>
  );
};

export default ManageResearch;
