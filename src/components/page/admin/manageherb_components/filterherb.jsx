import React, { useEffect, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { getAllCategories } from "../../../function/category";

const FilterHerb = ({ herbs, onClose, filterHerb }) => {
  const [createSearch, setCreateSearch] = useState("");
  const [updateSearch, setUpdateSearch] = useState("");
  const [originalCtg, setOriginalCtg] = useState([]);
  const [ctg, setCtg] = useState([]);
  const [selectCtg, setSelectCtg] = useState([]);

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        if (!res?.data) return;
        setOriginalCtg(res?.data?.categories);
        setCtg(
          res?.data?.categories.filter(
            (ctg) => !selectCtg.map((item) => item._id).includes(ctg._id)
          )
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const searchDate = (e, setState) => {
    const current = Date.now();
    const date = e.target.value;
    if (new Date(date).getTime() > current)
      return Swal.fire("แจ้งเตือน", "ไม่สามารถเลือกวันที่ในอนาคตได้", "error");
    setState(date);
  };

  const addSelectCtg = (ctg) => {
    const updateSelect = [ctg, ...selectCtg];
    setSelectCtg(updateSelect);
    setCtg(
      originalCtg.filter(
        (ctg) => !updateSelect.map((item) => item._id).includes(ctg._id)
      )
    );
  };

  const deleteSelectCtg = (id) => {
    const updateSelect = selectCtg.filter((item) => item._id !== id);
    setSelectCtg(updateSelect);
    setCtg(
      originalCtg.filter(
        (ctg) => !updateSelect.map((item) => item._id).includes(ctg._id)
      )
    );
  };

  const searchCtg = (e) => {
    const value = e.target.value;
    const filteArr = originalCtg.filter(
      (ctg) => !selectCtg.map((item) => item._id).includes(ctg._id)
    );
    if (value.length < 1 || value === "") {
      setCtg(filteArr);
    } else {
      setCtg(
        filteArr.filter(
          (item) =>
            item.ctg_name.includes(value) ||
            item.ctg_description.includes(value)
        )
      );
    }
  };

  const filterHerbs = () => {
    let filteredHerb = [];
    if (createSearch !== "") {
      filteredHerb = herbs.filter(
        (item) =>
          new Date(item.createdAt).toLocaleDateString("th-TH") ===
          new Date(createSearch).toLocaleDateString("th-TH")
      );
    }

    if (updateSearch !== "") {
      if (filteredHerb.length < 1) {
        filteredHerb = herbs.filter(
          (item) =>
            new Date(item.updatedAt).toLocaleDateString("th-TH") ===
            new Date(updateSearch).toLocaleDateString("th-TH")
        );
      } else {
        filteredHerb = filteredHerb.filter(
          (item) =>
            new Date(item.updatedAt).toLocaleDateString("th-TH") ===
            new Date(updateSearch).toLocaleDateString("th-TH")
        );
      }
    }
    if (selectCtg.length > 0) {
      const selectedIds = new Set(selectCtg.map((ctg) => ctg._id));
      if (filteredHerb.length < 1) {
        filteredHerb = herbs.filter((item) =>
          item.categories.some((ctgId) => selectedIds.has(ctgId))
        );
      } else {
        filteredHerb = filteredHerb.filter((item) =>
          item.categories.some((ctgId) => selectedIds.has(ctgId))
        );
      }
    }

    filterHerb(filteredHerb);
  };

  return (
    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]">
      <div
        className="relative bg-white border-2 rounded-lg flex flex-col gap-3 w-[40%]"
        style={{ padding: " 2rem 3rem" }}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-1 right-1 hover:bg-red-600 hover:text-white rounded-full"
          style={{ padding: "0.4rem" }}
        >
          <FaTimes />
        </button>
        <div className="flex flex-col gap-2 items-center">
          <label
            htmlFor=""
            className="flex gap-2 items-center text-4xl font-bold text-[#0a2e1d]"
          >
            <FaFilter /> ตัวกรองสมุนไพร
          </label>
          <label htmlFor="">ช่วยให้การค้นหาของคุณง่ายขึ้น</label>
        </div>
        <div style={{ marginTop: "1rem" }} className="flex flex-col gap-3">
          <label
            htmlFor=""
            className="w-full border-b-4 border-[#0a2e1d] text-lg font-bold"
            style={{ paddingBottom: "0.5rem" }}
          >
            วันที่เพิ่มข้อมูล
          </label>
          <input
            value={createSearch}
            onChange={(e) => searchDate(e, setCreateSearch)}
            type="date"
            className="border-2 cursor-pointer"
            placeholder="เลือกวันที่"
            style={{ padding: "0.3rem" }}
          />
        </div>
        <div style={{ marginTop: "1rem" }} className="flex flex-col gap-3">
          <label
            htmlFor=""
            className="w-full border-b-4 border-[#0a2e1d] text-lg font-bold"
            style={{ paddingBottom: "0.5rem" }}
          >
            วันที่แก้ไขล่าสุด
          </label>
          <input
            value={updateSearch}
            onChange={(e) => searchDate(e, setUpdateSearch)}
            type="date"
            className="border-2 cursor-pointer"
            placeholder="เลือกวันที่"
            style={{ padding: "0.3rem" }}
          />
        </div>
        <div style={{ marginTop: "1rem" }} className="flex flex-col gap-3">
          <label
            htmlFor=""
            className="w-full border-b-4 border-[#0a2e1d] text-lg font-bold"
            style={{ paddingBottom: "0.5rem" }}
          >
            หมวดหมู่สมุนไพร
          </label>
          <div className="flex flex-col gap-1">
            <input
              onChange={searchCtg}
              type="text"
              style={{ padding: "0.2rem 0.5rem" }}
              className="outline-none border-2"
              placeholder="พิมพ์ค้นหาหมวดหมู่"
            />
            <div className="flex flex-col h-[15vh] overflow-auto border-2">
              {ctg.length > 0 ? (
                ctg.map((item) => {
                  return (
                    <button
                      onClick={() => addSelectCtg(item)}
                      key={item._id}
                      className="w-full text-left text-gray-800 hover:bg-gray-300 cursor-pointer"
                      style={{ padding: "0.3rem 0.4rem" }}
                    >
                      {item.ctg_name}
                    </button>
                  );
                })
              ) : (
                <label htmlFor=""></label>
              )}
            </div>
            <div
              style={{ marginTop: "0.5rem" }}
              className="flex w-[25.5vw] h-[7vh] overflow-auto relative"
            >
              <div className="w-auto flex absolute top-0 left-0 gap-2">
                {selectCtg.map((item, index) => {
                  return (
                    <label
                      key={index}
                      htmlFor=""
                      className="flex items-center gap-1 w-[12vw] text-[0.8rem] justify-between rounded-xl bg-gray-300"
                      style={{ padding: "0.2rem 0.4rem" }}
                    >
                      {item.ctg_name.length < 20
                        ? item.ctg_name
                        : item.ctg_name.substring(0, 20) + "..."}{" "}
                      <FaTimes
                        className="cursor-pointer"
                        onClick={() => deleteSelectCtg(item._id)}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="flex items-center gap-2 cursor-pointer text-white bg-red-600 hover:bg-red-700"
            style={{ padding: "0.5rem 2.5rem" }}
          >
            รีเซ็ต <i className="fas fa-rotate-right"></i>
          </button>
          <button
            onClick={filterHerbs}
            className="flex items-center gap-2 cursor-pointer text-white bg-green-900 hover:bg-green-700"
            style={{ padding: "0.5rem 2.5rem" }}
          >
            <i className="fas fa-magnifying-glass"></i> ค้นหา
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterHerb;
