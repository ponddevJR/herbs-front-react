import {
  FaNotesMedical,
  FaResearchgate,
  FaUserAlt,
  FaUserSecret,
} from "react-icons/fa";

const UserData = ({ user }) => {
  // ฟังก์ชันปกป้องอีเมล
  const protectEmail = (email = "") => {
    return email.replace(/(?<=.{3}).(?=.*@)/g, "*");
  };

  // ฟังก์ชันปกป้องเบอร์โทรศัพท์
  const protectPhone = (phone = "") => {
    return phone.replace(/(?<=.{3})./g, "*");
  };

  return (
    <div className="user_section relative w-full h-full flex flex-col items-center">
      <div className="w-full h-full flex">
        {/* Sidebar Profile */}
        <div
          className="flex h-full flex-col bg-[#0c2d1a] items-center gap-2 p-6"
          style={{ padding: "1.3rem" }}
        >
          <img
            className="w-[5.8rem] h-[5.3rem] rounded-full border-2 border-white object-cover"
            src={`/public/img/${user?.role}.png`}
            alt="User"
          />
          <label
            htmlFor=""
            className="text-green-400 flex items-center gap-1 text-[0.9rem]"
          >
            {user?.role === "medic" ? (
              <FaNotesMedical />
            ) : user.role === "normal" ? (
              <FaUserAlt />
            ) : user?.role === "admin" ? (
              <FaUserSecret />
            ) : (
              <FaResearchgate />
            )}{" "}
            {user?.role === "medic"
              ? "แพทย์"
              : user.role === "normal"
              ? "สมาชิก"
              : user?.role === "admin"
              ? "ผู้ดูแล"
              : "นักวิจัย"}
          </label>
        </div>

        {/* ข้อมูลสมาชิก */}
        <div
          className="w-[60%] h-full flex flex-col pt-6 pl-6"
          style={{ paddingTop: "1.3rem", paddingLeft: "1.3rem" }}
        >
          <label className="w-full text-3xl">ข้อมูลส่วนตัวของสมาชิก</label>
          <label className="text-[0.9rem] text-green-800 font-bold">
            MEMBER'S INFORMATION
          </label>
          <div
            style={{ marginTop: "1.3rem" }}
            className="flex flex-col gap-5 mt-4"
          >
            <span className="flex items-center gap-3">
              <label className="text-[0.9rem] text-gray-600">ชื่อ-สกุล</label>
              <label className="text-xl">{`${
                user?.profile?.fname || "ไม่ระบุ"
              } ${user?.profile?.lname || ""}`}</label>
            </span>
            <span className="flex items-center gap-3">
              <label className="w-[2rem] text-[0.9rem] text-gray-600">
                อีเมล์
              </label>
              <label style={{ marginLeft: "1.5rem" }} className="text-xl ml-6">
                {protectEmail(user?.profile?.email)}
              </label>
            </span>
            <span className="flex items-center gap-3">
              <label className="w-[2rem] text-[0.9rem] text-gray-600">
                เบอร์โทรศัพท์
              </label>
              <label style={{ marginLeft: "1.5rem" }} className="text-xl ml-6">
                {protectPhone(user?.profile?.phone)}
              </label>
            </span>
            <span className="flex items-center gap-2">
              <label className="w-[2rem] text-[0.9rem] text-gray-600">
                รหัสสมาชิก
              </label>
              <label style={{ marginLeft: "1.5rem" }} className="text-lg ml-6">
                {user?._id?.substring(0, 20) + "..."}
              </label>
            </span>
            <span className="flex items-center gap-2">
              <label className="text-[0.9rem] text-gray-600">ที่อยู่</label>
              <label style={{ marginLeft: "1.8rem" }} className="text-lg ml-10">
                {user?.address
                  ? `${user.address.zip_code || ""} ต.${
                      user.address.sub_dis || ""
                    } อ.${user.address.amphure || ""} จ.${
                      user.address.province || ""
                    }`
                  : "ไม่ระบุ"}
              </label>
            </span>
          </div>
        </div>

        {/* รูปโปรไฟล์ & QR Code */}
        <div
          className="relative w-[30%] h-[12rem] ml-12 pt-6 pr-6"
          style={{ padding: "1.3rem" }}
        >
          <img
            className="w-full h-full object-cover border-2 border-[#0c2d1a]"
            src={`${
              user?.profile?.profile_img?.split("")[0] === "h"
                ? user?.profile?.profile_img
                : `http://localhost:8989/uploads/${user?.profile?.profile_img}`
            }`}
            alt="Profile"
          />
          <label className="absolute bottom-[-0.5rem] left-[3.5rem] text-[0.9rem] text-green-800 font-bold">
            รูปโปรไฟล์
          </label>
          <img
            style={{ marginTop: "3.5rem" }}
            className="mt-12 mr-4"
            src="/public/qr.svg"
            alt="QR Code"
          />
        </div>
      </div>
    </div>
  );
};

export default UserData;
