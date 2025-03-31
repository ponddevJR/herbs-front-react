import { useEffect, useState } from "react";
import {
  FaBars,
  FaFilter,
  FaListAlt,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import AddHerb from "./manageherb_components/addherb";
import AddCategory from "./manageherb_components/addctg";
import { deleteHerb, getHerbs } from "../../function/herbs";
import AdminLoading from "../../layout/admin/adminloading";
import { getAllCategories } from "../../function/category";
import HerbEdite from "./manageherb_components/herb-edit";
import FilterHerb from "./manageherb_components/filterherb";
import HerbDetail from "./manageherb_components/herb-detail";

const ManageHerbs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [showAddHerb, setShowAddHerd] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [originalHerbs, setOriginalHerbs] = useState([]);
  const [herbs, setHerbs] = useState([]);
  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(5);
  const [page, setPage] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [activeHerb, setActiveHerb] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter,setActiveFilter] = useState(false);
  const [activeDetail,setActiveDetail] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getHerbs();
      const ctgs = await getAllCategories();
      if (!res?.data) return;

      setOriginalHerbs(res?.data?.herbs?.reverse());
      setHerbs(res?.data?.herbs);

    //   setCategory(ctgs?.data?.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showAddHerb, showEdit]);

  const forwardPage = () => {
    if (page > herbs.length / 5)
      return Swal.fire(
        "แจ้งเตือน",
        `ข้อมูลสมุนไพรที่พบในระบบมี ${herbs.length} ข้อมูล`,
        "error"
      );

    setStartSlice(endSlice);
    setEndSlice(endSlice + 5);
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setStartSlice(startSlice - 5);
    setEndSlice(endSlice - 5);
    setPage(page - 1);
  };

  const resetToDefault = () => {
    fetchData();
    setPage(1);
    setEndSlice(5);
    setStartSlice(0);
  };

  const delHerb = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "ต้องการลบสมุนไพรนี้หรือไม่?",
      text: "ข้อมูลที่ลบจะไม่สามารถกู้คืนได้",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "ลบข้อมูล",
    });
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      const res = await deleteHerb(id);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res?.data?.mes, "success");
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire("แจ้งเตือน", "เกิดข้อผิดพลาดที่เซิฟเวอร์", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const searchHerbs = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
    if (value.length < 1 || value === "") {
      setHerbs(originalHerbs);
    } else {
      setHerbs(
        originalHerbs.filter(
          (item) =>
            item.name_th.includes(value) ||
            item.name_science.toLowerCase().includes(value) ||
            item.name_normal.toLowerCase().includes(value) ||
            item.herbs_look.includes(value) ||
            item.usage.includes(value) ||
            item.benefits.includes(value)
        )
      );
    }
  };

  const filterHerb = (filteredHerb) => {
    setHerbs(filteredHerb);
    setActiveFilter(false);
    setEndSlice(5);
    setStartSlice(0);
    setPage(1);
  }


  return (
    <div
      className={`${
        !showAddHerb || !showCategory ? "opacity-0" : "opacity-100"
      }w-full h-full flex flex-col gap-5`}
    >
      {isLoading && <AdminLoading />}
      {showEdit && (
        <HerbEdite herb={activeHerb} onClose={() => setShowEdit(false)} />
      )}
      <AddHerb active={showAddHerb} onClose={() => setShowAddHerd(false)} />
      <AddCategory
        active={showCategory}
        onClose={() => setShowCategory(false)}
      />
      {
        activeFilter &&
        <FilterHerb 
          onClose={() => setActiveFilter(false)}
          herbs={herbs}
          filterHerb={filterHerb}
        />
      }
      {
        activeDetail &&
        <HerbDetail onclose={() => setActiveDetail(false)} data={activeHerb}/>
      }
      <div className="w-full flex justify-between items-center">
        <div className="relative w-[25%] flex flex-col gap-2">
          <button className="text-3xl text-green-900 flex gap-2 items-center cursor-pointer">
            {!menuActive ? (
              <FaBars onClick={() => setMenuActive(true)} />
            ) : (
              <FaTimes onClick={() => setMenuActive(false)} />
            )}
          </button>
          <div
            className={`${
              menuActive
                ? "opacity-100 transalte-y-0 z-[20] visible"
                : "z-[-1] opacity-0 invisible"
            }bg-white transition-all duration-300 absolute bottom-[-8rem] left-0 flex flex-col shadow shadow-lg border border-gray-400`}
          >
            <button
              onClick={() => {
                setShowAddHerd(true), setMenuActive(false);
              }}
              style={{ padding: "0.5rem 0.8rem" }}
              className="flex bg-white items-center gap-2 hover:text-white hover:bg-green-900 cursor-pointer"
            >
              <FaPlus /> เพิ่มสมุนไพร
            </button>
            <button
              onClick={() => {
                setShowCategory(true), setMenuActive(false);
              }}
              style={{ padding: "0.5rem 0.8rem" }}
              className="flex bg-white items-center gap-2 hover:text-white hover:bg-green-900 cursor-pointer"
            >
              <FaListAlt /> จัดการหมวดหมู่
            </button>
            <button
              onClick={() => {setActiveFilter(true),setMenuActive(false)}}
              style={{ padding: "0.5rem 0.8rem" }}
              className="flex bg-white items-center gap-2 hover:text-white hover:bg-green-900 cursor-pointer"
            >
              <FaFilter /> ตัวกรอง
            </button>
          </div>
        </div>
        <div
          style={{ padding: "0.55rem" }}
          className="relative border-2 border-green-800 w-[50%] flex gap-3 items-center"
        >
          <span
            onClick={resetToDefault}
            className="absolute top-2 left-[-3rem] rounded-full transition-all duration-200 cursor-pointer hover:bg-green-900 hover:text-white"
            style={{ padding: "0.2rem 0.4rem" }}
          >
            <i className="fas fa-rotate-right"></i>
          </span>
          <i className="fas fa-magnifying-glass"></i>
          <input
            value={searchValue}
            onChange={searchHerbs}
            className="outline-none w-[95%]"
            type="text"
            name=""
            id=""
            placeholder="ค้นหาสมุนไพรที่คุณต้องการ"
          />
        </div>
      </div>

      <div className="relative w-full h-full">
        <table className="w-full">
          <thead
            className="text-center text-white bg-[#0c2d1a] sticky top-0 "
            style={{ padding: "rem" }}
          >
            <tr>
              <th style={{ padding: "0.7rem 0" }}>รหัสสมุนไพร</th>
              <th>ชื่อไทย</th>
              <th>ชื่อสามัญ</th>
              <th>รูปภาพ</th>
              <th>วันที่เพิ่ม</th>
              <th>วันที่แก้ไขล่าสุด</th>
              <th>แอคชั่น</th>
            </tr>
          </thead>
          <tbody>
            {herbs?.length > 0 ? (
              herbs.slice(startSlice, endSlice).map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="w-full text-center border-b border-gray-300 cursor-pointer transition-all duration-150 hover:bg-gray-200"
                  >
                    <td onClick={() => {setActiveDetail(true),setActiveHerb(item)}}>{item?._id.substring(0, 8) + "..."}</td>
                    <td onClick={() => {setActiveDetail(true),setActiveHerb(item)}}>{item?.name_th}</td>
                    <td onClick={() => {setActiveDetail(true),setActiveHerb(item)}}>{item?.name_normal.length > 25 ? item?.name_normal.substring(0,25)+'...' : item?.name_normal}</td>
                    <td
                      className="contents-center"
                      style={{ paddingLeft: "3.5rem" }}
                      onClick={() => {setActiveDetail(true),setActiveHerb(item)}}
                    >
                      <div className="w-[5rem] flex items-center">
                        <img
                          src={
                            item?.imgs[0]?.startsWith("h")
                              ? item?.imgs[0]
                              : `${import.meta.env.VITE_IMG_URL}${
                                  item?.imgs[0]
                                }`
                          }
                          className="w-full h-full"
                          alt=""
                        />
                      </div>
                    </td>
                    <td onClick={() => {setActiveDetail(true),setActiveHerb(item)}}>
                      {new Date(item?.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td onClick={() => {setActiveDetail(true),setActiveHerb(item)}}>
                      {new Date(item?.updatedAt).toLocaleDateString("th-TH")}
                    </td>
                    <td>
                      <div
                        style={{ padding: "0.3rem" }}
                        className="flex flex-col gap-1"
                      >
                        <button
                          onClick={() => {
                            setActiveHerb(item), setShowEdit(true);
                          }}
                          style={{ padding: "0.3rem 0.1rem" }}
                          className="bg-white hover:bg-orange-500 hover:text-white shadow border border-gray-300 flex justify-center cursor-pointer items-center gap-2"
                        >
                          <FaPen /> แก้ไข
                        </button>
                        <button
                          onClick={() => delHerb(item?._id)}
                          style={{ padding: "0.3rem 0.1rem" }}
                          className="bg-white hover:bg-red-500 hover:text-white shadow border border-gray-300 flex justify-center cursor-pointer items-center gap-2"
                        >
                          <FaTrashAlt /> ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="absolute top-5 left-0 translate-x-[28rem]">
                <td onClick={() => {fetchData(),setSearchValue("")}} className="cursor-pointer text-2xl font-blod" style={{ padding: "2rem" }}>
                  <div className="flex flex-col gap-8 items-center">
                    <img src="/img/no_herb.png" className="w-[15rem]" alt="" />{" "}
                    <label htmlFor="" className="flex items-center gap-3">ไม่พบข้อมูล</label>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div
          style={{ padding: "0.5rem 1rem" }}
          className="absolute bottom-0 left-0 w-full flex justify-between items-center text-white bg-[#0c2a1d]"
        >
          <label htmlFor="">
            ข้อมูลสมุนไพรในระบบทั้งหมด {herbs.length} ข้อมูล
          </label>
          <div className="flex items-center gap-8">
            <button
              onClick={prevPage}
              className="active:-translate-y-2 text-xl cursor-pointer hover:text-[#0c2a1d] hover:bg-white"
              style={{ padding: "0.3rem 0.6rem" }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <label htmlFor="" className="text-xl font-bold">
              {page}
            </label>
            <button
              onClick={forwardPage}
              className="active:-translate-y-2 text-xl cursor-pointer hover:text-[#0c2a1d] hover:bg-white"
              style={{ padding: "0.3rem 0.6rem" }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHerbs;
