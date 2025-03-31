import { useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const SeeInfo = ({ user, active, onClose }) => {
  return (
    <div
      className={`${
        active ? "opacity-100 z-[60] visible" : "opacity-0 z-[-1] invisible"
      }transition-all duration-300 flex items-center justify-center fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)]`}
    >
      <div
        className={`shadow-md shadow-gray-800 relative w-[40%] bg-white flex flex-col items-center border-2 rounded-md shadow-lg`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-red-500 hover:text-white"
          style={{ padding: "0.2rem 0.5rem" }}
        >
          <i className="fas fa-close"></i>
        </button>
        <div
          style={{ padding: "2rem" }}
          className="w-full flex gap-2 justify-between"
        >
          <div className="w-[30%] h-[20vh] border-2">
            <img
              src={
                user?.profile?.profile_img.startsWith("h")
                  ? user?.profile?.profile_img
                  : `${import.meta.env.VITE_IMG_URL}${
                      user?.profile?.profile_img
                    }`
              }
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div
            className="relative w-[60%] flex flex-col gap-2"
            style={{ paddingTop: "1.5rem" }}
          >
            <label
              htmlFor=""
              style={{ paddingBottom: "1rem" }}
              className="font-bold border-b-2 text-3xl"
            >
              {user?.profile?.fname} {user?.profile?.lname}
            </label>
            <label htmlFor="" className="text-[0.9rem] text-gray-700">
              รหัสสมาชิก : {user?._id}
            </label>
            <label htmlFor="" className="text-[0.9rem] text-gray-700">
              บทบาท :{" "}
              {user?.role === "admin"
                ? "ผู้ดูแลระบบ"
                : user.role === "normal"
                ? "สมาชิก"
                : user.role === "medic"
                ? "แพทย์"
                : "นักวิจัย"}
            </label>
            <label htmlFor="" className="text-[0.9rem] text-gray-700">
              วันที่ลงทะเบียน :{" "}
              {new Date(user?.createdAt).toLocaleDateString("th-TH")} เวลา :{" "}
              {new Date(user.createdAt).toLocaleTimeString("th-TH")}
            </label>
            {user?.role === "normal" || user?.role === "admin" ? (
              ""
            ) : (
              <a
                href={
                  user?.role === "medic"
                    ? "https://checkmd.tmc.or.th/"
                    : "https://foreignresearcher.nrct.go.th/"
                }
                target="_blank"
                className="text-[0.9rem] underline text-blue-700"
              >
                คลิกเพื่อไปตรวจสอบรายชื่อ{" "}
                {user?.role === "medic" ? "แพทย์" : "นักวิจัย"}
              </a>
            )}
          </div>
        </div>
        <div
          className="w-full flex flex-col gap-3 bg-[#050a44] text-white"
          style={{ padding: "1.8rem" }}
        >
          <label htmlFor="" className="w-full flex items-center gap-2">
            <FaEnvelope /> Email : {user?.profile?.email}
          </label>
          <label htmlFor="" className="w-full flex items-center gap-2">
            <FaPhone /> Phone : {user?.profile?.phone}
          </label>
        </div>
      </div>
    </div>
  );
};

export default SeeInfo;
