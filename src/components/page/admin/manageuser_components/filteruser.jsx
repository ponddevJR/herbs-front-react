import { act, useState } from "react";
import { FaFilter } from "react-icons/fa";

const FilterUser = ({ users, active, onClose, filterUser }) => {
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState([]);

  const selectDate = (e, type) => {
    const dateValue = e.target.value;
    const timestamp = new Date(dateValue).getTime();
    if (timestamp > Date.now()) {
      Swal.fire("แจ้งเตือน", "ไม่สามารถเลือกวันที่ในอนาคตได้", "error");
      return;
    }
    type === "created" ? setCreatedAt(dateValue) : setUpdatedAt(dateValue);
  };

  const toggleFilter = (value, setState, state) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  const sendFilter = () => {
    let filteredUsers = [...users];

    if (roles.length > 0) {
      filteredUsers = filteredUsers.filter((user) => roles.includes(user.role));
    }
    if (status.length > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        status.includes(user.status)
      );
    }
    if (createdAt) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          new Date(user.createdAt).toLocaleDateString("th-Th") ===
          new Date(createdAt).toLocaleDateString("th-TH")
      );
    }
    if (updatedAt) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          new Date(user.updatedAt).toLocaleDateString("th-Th") ===
          new Date(updatedAt).toLocaleDateString("th-TH")
      );
    }

    filterUser(filteredUsers);
  };

  const resetVales = () => {
    setCreatedAt("");
    setRoles([]);
    setStatus([]);
    setUpdatedAt("");
  };
  return (
    <div
      className={`${
        active
          ? "translate-x-0 opacity-100 z-[60] visible"
          : "translate-x-[50rem] opacity-0 z-[-1] invisible"
      }transition-all duration-300 flex items-center justify-end fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)]`}
    >
      <div
        style={{
          padding: "2rem",
          borderTopLeftRadius: "15px",
          borderBottomLeftRadius: "15px",
        }}
        className={`transition-all duration-300 shadow-md shadow-gray-800 relative bg-white flex flex-col gap-5 items-center border shadow-lg`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-red-500 hover:text-white"
          style={{ padding: "0.2rem 0.5rem" }}
        >
          <i className="fas fa-close"></i>
        </button>
        <div className="w-full flex flex-col gap-2 items-start">
          <label htmlFor="" className="font-bold flex gap-2 text-3xl">
            <FaFilter /> FILTER SEARCH ตัวกรอง
          </label>
          <label htmlFor="" className="text-[1rem] text-gray-600">
            ตัวช่วยค้นหาข้อมูล เพิ่มความสะดวกในการจัดการกับข้อมูล
          </label>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            className="text-lg font-bold border-b-3 border-[#050a44]"
            style={{ paddingBottom: "0.2rem" }}
          >
            บทบาท
          </label>
          <div className="flex gap-3">
            {[
              { name: "สมาชิก", value: "normal" },
              { name: "แพทย์", value: "medic" },
              { name: "นักวิจัย", value: "researcher" },
              { name: "ผู้ดูแลระบบ", value: "admin" },
            ].map((item, index) => {
              return (
                <button
                  name="role"
                  onClick={(e) => toggleFilter(item.value, setRoles, roles, e)}
                  key={index}
                  style={{ padding: "0.3rem 0.5rem" }}
                  className={`${
                    roles.includes(item.value) ? "text-white bg-[#050a44]" : ""
                  } cursor-pointer border border-gray-400 active:scale-95 shadow rounded-md transition-all duration-200`}
                  value={item.value}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            className="text-lg font-bold border-b-3 border-[#050a44]"
            style={{ paddingBottom: "0.2rem" }}
          >
            สถานะการเข้าใช้งาน
          </label>
          <div className="flex gap-3">
            {[
              { name: "อนุมัติแล้ว", value: true },
              { name: "ยังไม่อนุมัติ / ถูกระงับ", value: false },
            ].map((item, index) => {
              return (
                <button
                  name="status"
                  onClick={(e) =>
                    toggleFilter(item.value, setStatus, status, e)
                  }
                  key={index}
                  style={{ padding: "0.3rem 0.5rem" }}
                  className={`${
                    status.includes(item.value) ? "text-white bg-[#050a44]" : ""
                  } cursor-pointer border border-gray-400 active:scale-95 shadow rounded-md transition-all duration-200`}
                  value={item.value}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            className="text-lg font-bold border-b-3 border-[#050a44]"
            style={{ paddingBottom: "0.2rem" }}
          >
            วันที่ลงทะเบียน
          </label>
          <div className="flex gap-3">
            <input
              value={createdAt}
              name="created"
              onChange={(e) => selectDate(e, "created")}
              type="date"
              className="border cursor-pointer"
              style={{ padding: "0.3rem" }}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor=""
            className="text-lg font-bold border-b-3 border-[#050a44]"
            style={{ paddingBottom: "0.2rem" }}
          >
            วันที่อนุมัติ
          </label>
          <div className="flex gap-3">
            <input
              value={updatedAt}
              name="updated"
              onChange={(e) => selectDate(e, "updated")}
              type="date"
              className="border cursor-pointer"
              style={{ padding: "0.3rem" }}
            />
          </div>
        </div>
        <div className="w-full flex gap-12 items-center justify-between">
          <button
            onClick={resetVales}
            className="w-full border border-gray-500 shadow cursor-pointer text-white bg-red-600 transition-all duration-300 active:scale-95"
            style={{ margin: "0.5rem 0", padding: "0.8rem 0" }}
          >
            รีเซ็ต <i className="fas fa-rotate-right"></i>
          </button>
          <button
            onClick={sendFilter}
            className="w-full border border-gray-500 shadow cursor-pointer transition-all duration-300 hover:bg-[#050a44] hover:text-white active:scale-95"
            style={{ margin: "0.5rem 0", padding: "0.8rem 0" }}
          >
            ค้นหา <i className="fas fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterUser;
