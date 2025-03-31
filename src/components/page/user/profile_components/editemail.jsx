import { FaCheck, FaEnvelope, FaLock, FaRegEnvelope } from "react-icons/fa";
import "../../../style/editemail.css";
import { useState, useRef } from "react";
import EmailLoading from "../../../layout/emailLoading";
import { randomOTP, sendEmail } from "../../../function/sendEmail";

const EditEmail = ({ user, emailUpdate }) => {
  const [data, setData] = useState({ old: "", newEmail: "", otp: "" });
  const [oldCorrect, setOldCorrect] = useState(false);
  const [sendToNew, setSendToNew] = useState(false);
  const [OTP, setOTP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);
  const [timeRef, setTimeRef] = useState(8 * 60);

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const checkOldEmail = () => {
    if (data.old !== user?.profile?.email)
      return Swal.fire("เกิดข้อผิดพลาด", "อีเมล์ไม่ถูกต้อง", "error");
    setOldCorrect(true);
  };

  const sendNewEmail = async () => {
    setIsLoading(true);
    try {
      const gmailPattern = /^[^\s@]+@gmail\.com$/;
      const isCorrect = gmailPattern.test(data.newEmail);
      if (!isCorrect)
        return Swal.fire("เกิดข้อผิดพลาด", "รูปแบบอีเมล์ไม่ถูกต้อง", "error");
      if (data.newEmail === data.old)
        return Swal.fire(
          "เกิดข้อผิดพลาด",
          "อีเมล์ใหม่ตรงกับอีเมล์ที่ใช้ในปัจจุบัน",
          "error"
        );
      const tempOTP = randomOTP();
      setOTP(tempOTP);
      const send = await sendEmail(
        data.newEmail,
        "",
        "รหัสยืนยันอีเมล์ใหม่",
        "ระบบสารสนเทศสมุนไพรไทย",
        `"${tempOTP}" คือรหัสยืนยันอีเมล์ใหม่ของคุณ`
      );
      if (!send)
        return Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");

      await Swal.fire(
        "แจ้งเตือน",
        "ระบบได้ส่งรหัสยืนยันไปยังอีเมล์ใหม่ของท่านแล้ว",
        "success"
      );
      setSendToNew(true);
      startTimeCount();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (sec) => {
    const minute = Math.floor(sec / 60);
    const seccond = sec % 60;
    return timeRef < 0
      ? "หมดเวลา"
      : `0${minute}:${seccond.toString().padStart(2, "0")}`;
  };

  const startTimeCount = () => {
    if (sendToNew && timeRef > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRef((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  };

  const resetDefault = () => {
    setData({ old: "", newEmail: "", otp: "" });
    setOldCorrect(false);
    setSendToNew(false);
    setOTP(0);
    setTimeRef(8 * 60);
    return;
  };

  const checkOTP = async () => {
    if (timeRef <= 0) {
      Swal.fire("หมดเวลา", "โปรดดำเนินการอีกครั้งในภายหลัง", "error");
      resetDefault();
    }
    if (data.otp == OTP) {
      await emailUpdate({ _id: user._id, newEmail: data.newEmail });
      resetDefault();
    } else {
      await Swal.fire("รหัสยืนยันไม่ถูกต้อง", "", "error");
    }
  };

  const reGetOTP = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "แจ้งเตือน",
      text: "ต้องการขอรหัสยืนยันอีกครั้งหรือไม่",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ขอรหัสยืนยัน",
    });
    if (!isConfirmed) return;

    setTimeRef(8 * 60);
    setOTP(0);
    sendNewEmail();
  };
  return (
    <div className="flex w-full h-full items-center justify-end bg-green-900 gap-3">
      <div
        id="img-section"
        className="w-[40%] h-full flex flex-col bg-white items-center justify-center gap-8"
        style={{ padding: "1.5rem" }}
      >
        <div className="w-[95%] h-[45%]">
          <img
            src="/public/img/mail_edit.png"
            className="w-full h-full"
            alt=""
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label
            className={`w-full flex items-center gap-1 text-[0.9rem] ${
              oldCorrect ? "text-green-600" : ""
            }`}
            htmlFor=""
          >
            1.กรอกอีเมล์เดิมเพื่อยืนยันตัวตน {oldCorrect && <FaCheck />}
          </label>
          <label
            className={`w-full flex items-center gap-1 text-[0.9rem] ${
              sendToNew ? "text-green-600" : ""
            }`}
            htmlFor=""
          >
            2.กรอกอีเมล์ใหม่ {sendToNew && <FaCheck />}
          </label>
          <label className={`w-full text-[0.9rem] `} htmlFor="">
            3.ตรวจสอบอีเมล์ใหม่และบันทึกข้อมูล
          </label>
        </div>
      </div>
      <div
        className="relative w-[56.5%] h-full flex flex-col gap-8 bg-white"
        style={{ padding: "2.5rem" }}
      >
        {isLoading && <EmailLoading />}
        <button
          onClick={resetDefault}
          className="absolute top-2 right-2 cursor-pointer transition-all duration-500 rounded-full hover:bg-red-600 hover:text-white"
          style={{ padding: "0.3rem 0.5rem" }}
        >
          <i className="fa-solid fa-rotate-right"></i>
        </button>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="" className="flex items-center gap-2">
            <FaEnvelope />
            อีเมล์เดิม
          </label>
          <input
            value={data.old}
            onChange={handleInput}
            name="old"
            disabled={oldCorrect ? true : false}
            type="email"
            placeholder="อีเมล์ปัจจุบัน"
            className={`border-b-2 outline-none transition-all duration-500 ${
              oldCorrect ? "bg-gray-500" : ""
            }`}
            style={{ padding: "0.3rem" }}
          />
        </div>
        <div
          className={`w-full flex flex-col gap-1 transition-all duration-500 ${
            oldCorrect ? "opacity-100" : "opacity-0 -translate-y-[20px]"
          }`}
        >
          <label htmlFor="" className="flex items-center gap-2">
            <FaRegEnvelope />
            อีเมล์ใหม่
          </label>
          <input
            value={data.newEmail}
            onChange={handleInput}
            name="newEmail"
            disabled={sendToNew}
            type="email"
            placeholder="อีเมล์ที่ต้องการใช้(gmail เท่านั้น)"
            className={`border-b-2 outline-none ${
              sendToNew ? "bg-gray-500" : ""
            }`}
            style={{ padding: "0.3rem" }}
          />
        </div>
        <div
          className={`w-full flex flex-col gap-1 transition-all duration-500 ${
            sendToNew ? "opacity-100" : "opacity-0 -translate-y-[20px]"
          }`}
        >
          <label htmlFor="" className="text-[0.85rem] text-red-600">
            *โปรดทำการยืนยันภายใน {formatTime(timeRef)}
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <FaLock />
            รหัสยืนยันอีเมล์ใหม่
          </label>
          <input
            value={data.otp}
            onChange={handleInput}
            name="otp"
            type="text"
            placeholder="กรอกรหัสยืนยัน"
            className="border-b-2 outline-none"
            style={{ padding: "0.3rem" }}
          />
        </div>
        {oldCorrect && !sendToNew ? (
          <button
            onClick={sendNewEmail}
            className="w-full text-lg text-white bg-green-800 rounded-xl transition-all duration-200 hover:bg-green-600 cursor-pointer"
            style={{ padding: "0.8rem" }}
          >
            ขอรหัสยืนยัน
          </button>
        ) : sendToNew ? (
          <div className="w-full flex items-center justify-between">
            <button
              onClick={reGetOTP}
              style={{ textDecoration: "underline" }}
              className="cursor-pointer text-blue-900 text-[0.8rem]"
            >
              รหัสยืนยันใหม่?
            </button>
            <button
              onClick={checkOTP}
              style={{ padding: "0.5rem 0.8rem" }}
              className="cursor-pointer text-white bg-green-600 transiton-all duration-200 hover:bg-green-700"
            >
              ตรวจสอบและบันทึก
            </button>
          </div>
        ) : (
          <button
            onClick={checkOldEmail}
            className="w-full text-lg text-white bg-green-800 rounded-xl transition-all duration-200 hover:bg-green-600 cursor-pointer"
            style={{ padding: "0.8rem" }}
          >
            ตรวจสอบอีเมล์ปัจจุบัน
          </button>
        )}
      </div>
    </div>
  );
};

export default EditEmail;
