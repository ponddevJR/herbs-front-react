import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import {getHerbs} from "../../../function/herbs";

const months = [
  { value: 1, name: "มกราคม" },
  { value: 2, name: "กุมภาพันธ์" },
  { value: 3, name: "มีนาคม" },
  { value: 4, name: "เมษายน" },
  { value: 5, name: "พฤษภาคม" },
  { value: 6, name: "มิถุนายน" },
  { value: 7, name: "กรกฎาคม" },
  { value: 8, name: "สิงหาคม" },
  { value: 9, name: "กันยายน" },
  { value: 10, name: "ตุลาคม" },
  { value: 11, name: "พฤศจิกายน" },
  { value: 12, name: "ธันวาคม" },
];

const FilterNews = ({ news, onClose, sendFilterData, active }) => {
  const [mount, setMount] = useState("");
  const [date, setDate] = useState("");
  const [views, setViews] = useState({ min: 0, max: 0 });
  const [likes, setLikes] = useState({ min: 0, max: 0 });
  const [disLikes, setDisLikes] = useState({ min: 0, max: 0 });
  const [herbs,setHerbs] = useState([]);
  const [selectHerbs,setSelectHerbs] = useState([]);

  useEffect(() => {
    getHerbs().then((res) => {
      if(!res?.data?.herbs);
      const herbs = res?.data?.herbs;
      setHerbs(herbs);
    })
  },[selectHerbs]);

  const selectDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return Swal.fire("แจ้งเตือน", "ไม่สามารถเลือกวันที่ในอนาคตได้", "error");
    }
    setDate(e.target.value);
  };

  const filterData = (e) => {
    e.preventDefault();
    let filteredNews = [...news];
    if (date !== "") {
      filteredNews = filteredNews.filter(
        (item) =>
          new Date(item.createdAt).toLocaleDateString("th-TH") ===
          new Date(date).toLocaleDateString("th-TH")
      );
    }
    if (mount !== "") {
      const monthIndex = months.filter((item) => item.name === mount)[0].value;
      filteredNews = filteredNews.filter(
        (item) => new Date(item.createdAt).getMonth() + 1 === monthIndex
      );
    }

    if (views.min > 0 || views.max > 0) {
      filteredNews = filteredNews.filter((item) => {
        return (
          item.views >= (views.min || 0) &&
          item.views <= (views.max || Infinity)
        );
      });
    }

    if (likes.min > 0 || likes.max > 0) {
      filteredNews = filteredNews.filter((item) => {
        const count = item.likes.filter((item) => item !== "").length
        return (
          count >= (likes.min || 0) &&
          count <= (likes.max || Infinity)
        )
      })
    }

    if (disLikes.min > 0 || disLikes.max > 0) {
      filteredNews = filteredNews.filter((item) => {
        const count = item.dislikes.filter((item) => item !== "").length
        return count < 1 ?  "" :
          count >= (disLikes.min || 0) &&
          count <= (disLikes.max || Infinity)
      });
    }

    if(selectHerbs.length > 0){
      filteredNews = filteredNews.filter((item) => item.herbs_id.some((hId) => new Set(selectHerbs).has(hId)));
    }

    if (
      !mount &&
      !date &&
      views.min === 0 &&
      views.max === 0 &&
      likes.min === 0 &&
      likes.max === 0 &&
      disLikes.min === 0 &&
      disLikes.max === 0 && selectHerbs.length < 1
    ) {
      sendFilterData(news);
      onClose();
    } else {
      sendFilterData(filteredNews);
      onClose();
    }
  };

  const resetValue = () => {
    setDate("");
    setMount("");
    setViews({ min: 0, max: 0 });
    setLikes({ min: 0, max: 0 });
    setDisLikes({ min: 0, max: 0 });
    setSelectHerbs([]);
  };

  const handleActionMin = (e, state, setState) => {
    const value = parseInt(e.target.value);
    setState(
      state.max > 0 && value >= state.max
        ? { ...state, min: state.max }
        : { ...state, min: value }
    );
  };

  const handleActionMax = (e, state, setState) => {
    const value = parseInt(e.target.value);
    setState(
      state.min > 0 && value <= state.min
        ? { ...state, max: state.min }
        : { ...state, max: value }
    );
  };

  const addSelectHerb = (id) => {
    setSelectHerbs(prev => [id,...prev]);
  }

  const deleteSelectHerb = (id) => {
    setSelectHerbs(prev => prev.filter((item) => item !== id));
  }

  const searchHerb = (e) => {
    const value = e.target.result;
    console.log("🚀 ~ searchHerb ~ value:", value)
    if(value.length < 1 || value === ""){
      setHerbs(herbs);
    }else{
      setHerbs(herbs.filter((item) => item.name_th.includes(value)));
    }
  }


  return (
    <div
      className={`${
        active ? "visible z-30" : "z-[-1] invisible"
      } z-30 absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)] flex items-center justify-end overflow-auto`}
    >
      <form
        onSubmit={filterData}
        style={{
          padding: "1.5rem 2rem",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          marginTop:"21rem"
        }}
        className="bg-white w-[38%] flex flex-col gap-6 relative"
      >
        <button
          onClick={onClose}
          style={{ padding: "0.35rem" }}
          className="absolute top-2 right-2 rounded-full cursor-pointer hover:bg-red-600 hover:text-white"
        >
          <FaTimes />
        </button>
        <div className="w-full flex gap-1 items-end">
          <label
            htmlFor=""
            className="flex items-center gap-1 font-bold text-2xl text-[#050a44]"
          >
            <FaFilter /> ตัวช่วยค้นหา
          </label>
          <label htmlFor="" className="text-[0.85rem] text-gray-700">
            ค้นหาง่ายๆ ด้วยตัวกรองค้นหา
          </label>
        </div>

        <div className="w-full flex flex-col gap-3">
          <label
            htmlFor=""
            style={{ paddingBottom: "0.5rem" }}
            className="border-b-4 border-[#050a44] font-bold text-xl"
          >
            ค้นหาข่าวประจำวัน{" "}
            <small
              hidden={mount === "" || mount.name === ""}
              className="font-normal text-red-500 text-[0.8rem]"
            >
              เลือกเดือนแล้วจะไม่สามารถค้นหาข่าวประจำวันได้
            </small>
          </label>
          <input
            disabled={mount !== ""}
            value={date}
            onChange={selectDate}
            type="date"
            style={{ padding: "0.35rem" }}
            className={`${
              mount !== "" ? "bg-gray-300" : ""
            } outline-none focus:ring-2 focus:ring-[#050a44] border rounded-lg cursor-pointer`}
          />
        </div>
        <div className="w-full flex flex-col gap-3">
          <label
            htmlFor=""
            style={{ paddingBottom: "0.5rem" }}
            className="border-b-4 border-[#050a44] font-bold text-xl"
          >
            ค้นหาข่าวประจำเดือน{" "}
            <small
              hidden={date === ""}
              className="font-normal text-red-500 text-[0.8rem]"
            >
              เลือกข่าวประจำวันแล้วจะไม่สามารถเลือกเดือนได้
            </small>
          </label>
          <div className="w-full flex flex-col gap-1">
            <select
              disabled={date !== ""}
              value={mount}
              onChange={(e) => setMount(e.target.value)}
              style={{ padding: "0.35rem" }}
              className={`${
                date !== "" ? "bg-gray-300" : ""
              } outline-none border rounded-lg hover:ring-2 hover:ring-[#050a44]`}
              id="mounts"
            >
              <option value="">-- เลือกเดือน --</option>
              {months.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            style={{ paddingBottom: "0.5rem" }}
            className="border-b-4 border-[#050a44] font-bold text-xl"
          >
            ผู้เข้าชม(คน)
          </label>
          <div className="w-full flex justify-between items-center">
            <input
              style={{ padding: "0.35rem 0.5rem" }}
              type="number"
              onInput={(e) => handleActionMin(e, views, setViews)}
              value={views.min > 0 ? views.min : ""}
              onChange={(e) => handleActionMin(e, views, setViews)}
              min={0}
              className="border w-[30%] rounded-lg focus:ring-2 focus:ring-[#050a44] outline-none"
              placeholder="ตั้งแต่"
            />
            <label htmlFor="" className="text-gray-700 text-[0.85rem]">
              แต่ไม่เกิน
            </label>
            <input
              style={{ padding: "0.35rem 0.5rem" }}
              type="number"
              min={views.min}
              value={views.max > 0 ? views.max : ""}
              onInput={(e) => handleActionMax(e, views, setViews)}
              onChange={(e) => handleActionMax(e, views, setViews)}
              className="border w-[30%] rounded-lg focus:ring-2 focus:ring-[#050a44] outline-none"
              placeholder="ไม่เกิน"
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            style={{ paddingBottom: "0.5rem" }}
            className="border-b-4 border-[#050a44] font-bold text-xl"
          >
            ถูกใจ(คน)
          </label>
          <div className="w-full flex justify-between items-center">
            <input
              style={{ padding: "0.35rem 0.5rem" }}
              type="number"
              value={likes.min > 0 ? likes.min : ""}
              onInput={(e) => handleActionMin(e, likes, setLikes)}
              onChange={(e) => handleActionMin(e, likes, setLikes)}
              min={0}
              className="border w-[30%] rounded-lg focus:ring-2 focus:ring-[#050a44] outline-none"
              placeholder="ตั้งแต่"
            />
            <label htmlFor="" className="text-gray-700 text-[0.85rem]">
              แต่ไม่เกิน
            </label>
            <input
              style={{ padding: "0.35rem 0.5rem" }}
              type="number"
              min={likes.min}
              value={likes.max > 0 ? likes.max : ""}
              onInput={(e) => handleActionMax(e, likes, setLikes)}
              onChange={(e) => handleActionMax(e, likes, setLikes)}
              className="border w-[30%] rounded-lg focus:ring-2 focus:ring-[#050a44] outline-none"
              placeholder="ไม่เกิน"
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            style={{ paddingBottom: "0.5rem" }}
            className="border-b-4 border-[#050a44] font-bold text-xl"
          >
            ไม่ถูกใจ(คน)
          </label>
          <div className="w-full flex justify-between items-center">
            <input
              style={{ padding: "0.35rem 0.5rem" }}
              type="number"
              min={0}
              value={disLikes.min > 0 ? disLikes.min : ""}
              onInput={(e) => handleActionMin(e, disLikes, setDisLikes)}
              onChange={(e) => handleActionMin(e, disLikes, setDisLikes)}
              className="border w-[30%] rounded-lg focus:ring-2 focus:ring-[#050a44] outline-none"
              placeholder="ตั้งแต่"
            />
            <label htmlFor="" className="text-gray-700 text-[0.85rem]">
              แต่ไม่เกิน
            </label>
            <input
              style={{ padding: "0.35rem 0.5rem" }}
              type="number"
              min={disLikes.min}
              value={disLikes.max > 0 ? disLikes.max : ""}
              onInput={(e) => handleActionMax(e, disLikes, setDisLikes)}
              onChange={(e) => handleActionMax(e, disLikes, setDisLikes)}
              className="border w-[30%] rounded-lg focus:ring-2 focus:ring-[#050a44] outline-none"
              placeholder="ไม่เกิน"
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
            <label
                htmlFor=""
                style={{ paddingBottom: "0.5rem" }}
                className="border-b-4 border-[#050a44] font-bold text-xl"
            >
              สมุนไพรที่เกี่ยวข้อง
            </label>
            <input onChange={searchHerb} type="text" className="w-full border outline-none" style={{padding:"0.35rem 0.5rem"}} placeholder="ค้นหาสมุนไพร"/>
            <div className="w-full h-[25vh] border flex relative overflow-auto">
              <div className="w-full h-auto absolute top-0 left-0 flex flex-col">
                {
                  herbs?.filter((item) => !selectHerbs.includes(item?._id)).map((item) => {
                    return <option onClick={() => addSelectHerb(item?._id)} value={item?._d} className="w-full h-[4.8vh] transition-all duration-200 hover:bg-gray-200 cursor-pointer" style={{padding:"0.35rem"}}>{item?.name_th}</option>
                  })
                }
              </div>
            </div>
            <div className="w-full h-[8.5vh] relative overflow-auto">
                <div className="w-auto h-[6vh] flex gap-2 absolute top-0 left-0">
                  {
                    herbs.filter((item) => selectHerbs.includes(item?._id)).map((item) => {
                      return <label key={item?._id} htmlFor="" style={{padding:"0.3rem 0.5rem"}} className="rounded-lg cursor-pointer bg-gray-300 w-[8.5vw] h-full flex items-center justify-between">
                              {item?.name_th} <FaTimes onClick={() => deleteSelectHerb(item?._id)}/>
                            </label>
                    })
                  }
                    
                </div>
            </div>
        </div>
        <div className="w-full flex justify-between">
          <button
            type="reset"
            onClick={resetValue}
            style={{ padding: "0.35rem 1.5rem" }}
            className="flex items-center gap-1 text-white cursor-pointer hover:bg-red-600 bg-red-500"
          >
            รีเซ็ต
          </button>
          <button
            type="submit"
            style={{ padding: "0.35rem 1.5rem" }}
            className="flex items-center gap-1 text-white cursor-pointer hover:bg-blue-900 bg-[#050a44]"
          >
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterNews;
