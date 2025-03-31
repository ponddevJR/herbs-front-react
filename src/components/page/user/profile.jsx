import {
  FaAddressCard,
  FaEnvelope,
  FaLockOpen,
  FaPenAlt,
} from "react-icons/fa";
import Navbar from "../../layout/navbar";
import "../../style/profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSingle,
  logout,
  updateData,
  updateEmail,
  updatePassword,
} from "../../function/user";
import Loading from "../../layout/loading";
import UserData from "./profile_components/userdata";
import FormEdit from "./profile_components/editform";
import EditEmail from "./profile_components/editemail";
import EditPassword from "./profile_components/editpassword";
import Footer from "../../layout/footer";

const Profile = () => {
  const [menuActive, setMenuActive] = useState(1);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const res = await getSingle();
      if (!res) {
        navigate("/");
      } else {
        setUser(res);
      }
    };
    checkLogin();
  }, [menuActive]);

  // เปลี่ยนแท็บเมนู
  const btnActive = (e) => {
    setMenuActive(parseInt(e.target.value, 10));
  };

  // ออกจากระบบ
  const logoutBtn = async () => {
    const { isConfirmed } = await Swal.fire({
      titel: "แจ้งเตือน",
      icon: "question",
      text: "ต้องการออกจากระบบหรือไม่",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ไม่ต้องการ",
    });
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      const res = await logout();
      if (res.data.err) {
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
      }
      await Swal.fire("แจ้งเตือน", res.data.mes, "success");
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (value) => {
    setIsLoading(true);
    try {
      const res = await updateData(value);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
      await Swal.fire("สำเร็จ", res.data.mes, "success");
      setMenuActive(1);
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const emailUpdate = async (value) => {
    setIsLoading(true);
    try {
      // อัปเดตอีเมล์
      const res = await updateEmail(value);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
    } catch (err) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sendNewPass = async (value) => {
    setIsLoading(true);
    try {
      const res = await updatePassword(value);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
      // ออกจากระบบ
      await logout();
      await Swal.fire("สำเร็จ", res.data.mes, "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      await Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      {isLoading && <Loading />}
      <Navbar />
      <div className="w-[65%] h-[60%] flex justify-between">
        {/* Sidebar */}
        <aside className="bg-white w-[25%] h-full flex flex-col border border-gray-200 shadow-md shadow-gray-500">
          <div
            className="img-section w-full flex items-center gap-3 bg-[#000] text-white p-4"
            style={{ padding: "1rem" }}
          >
            <div className="flex flex-col">
              <label className="font-bold">ยินดีต้อนรับ</label>
              <label className="text-2xl">
                {user?.profile?.fname || "ไม่ระบุ"} {user?.profile?.lname || ""}
              </label>
            </div>
          </div>
          {/* เมนู Sidebar */}
          <div
            className="w-full flex flex-col mt-1"
            style={{ marginTop: "0.1rem" }}
          >
            <button
              style={{ padding: "0.8rem" }}
              onClick={btnActive}
              value={1}
              className={`${
                menuActive === 1 ? "bg-green-900 text-white" : "bg-white"
              } flex items-center gap-2 border-b cursor-pointer hover:bg-green-900 hover:text-white p-3`}
            >
              <FaAddressCard /> โปรไฟล์ของฉัน
            </button>
            <button
              style={{ padding: "0.8rem" }}
              onClick={btnActive}
              value={2}
              className={`${
                menuActive === 2 ? "bg-green-900 text-white" : "bg-white"
              } flex items-center gap-2 border-b cursor-pointer hover:bg-green-900 hover:text-white p-3`}
            >
              <FaPenAlt /> แก้ไขโปรไฟล์
            </button>
            <button
              style={{ padding: "0.8rem" }}
              onClick={btnActive}
              value={3}
              className={`${
                menuActive === 3 ? "bg-green-900 text-white" : "bg-white"
              } flex items-center gap-2 border-b cursor-pointer hover:bg-green-900 hover:text-white p-3`}
            >
              <FaEnvelope /> แก้ไขอีเมล์
            </button>
            <button
              style={{ padding: "0.8rem" }}
              onClick={btnActive}
              value={4}
              className={`${
                menuActive === 4 ? "bg-green-900 text-white" : "bg-white"
              } flex items-center gap-2 border-b cursor-pointer hover:bg-green-900 hover:text-white p-3`}
            >
              <FaLockOpen /> แก้ไขรหัสผ่าน
            </button>
            <button
              style={{ padding: "0.8rem" }}
              onClick={logoutBtn}
              className="flex items-center gap-2 cursor-pointer text-white bg-red-500 hover:bg-red-700 p-3"
            >
              <i className="fa-solid fa-right-from-bracket"></i> ออกจากระบบ
            </button>
          </div>
        </aside>
        {/* Content */}
        <div className="w-[72%] h-full border bg-white shadow-md shadow-gray-500 rounded-lg overflow-hidden">
          {menuActive === 1 && user ? (
            <UserData user={user} />
          ) : menuActive === 2 ? (
            <FormEdit user={user} updateUser={updateUser} />
          ) : menuActive === 3 ? (
            <EditEmail user={user} emailUpdate={emailUpdate} />
          ) : (
            <EditPassword user={user} sendNewPass={sendNewPass} />
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  );
};

export default Profile;
