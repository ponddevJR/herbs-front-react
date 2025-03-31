import { useEffect, useRef, useState } from "react";
import Navbar from "../../layout/navbar";
import {
  checckAuthNoLogin,
  getSingle,
  updatePassNoAuth,
} from "../../function/user";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUserAlt,
  FaEye,
  FaCheck,
  FaSave,
  FaKey,
} from "react-icons/fa";
import { generatePassword } from "../../function/randomPass";
import EmailLoading from "../../layout/emailLoading";
import { randomOTP, sendEmail } from "../../function/sendEmail";

const ChangePassword = () => {
  const [data, setdata] = useState({
    username: "",
    email: "",
    newPass: "",
    reNewPass: "",
    otp: "",
  });
  const navigate = useNavigate();
  const [authPass, setAuthPass] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [lengthCorrect, setlengCorrect] = useState(false);
  const [formatCorrect, setFormatCorrect] = useState(false);
  const [rePassCorreect, setRePassCorrecet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [OTP, setOTP] = useState(0);
  const intervalRef = useRef(null);
  const [timeRef, setTimeRef] = useState(8 * 60);
  const [otpCorrect, setOTPCorrect] = useState(false);

  const [showNewPass, setShowNewPass] = useState(false);
  const [showReNew, setShowReNew] = useState(false);

  useEffect(() => {
    getSingle().then((res) => {
      if (res) return navigate("/");
    });
  }, []);

  // ตรวจสอบรูปแบบinput
  const formatInput = (str) => {
    const hasNumber = /\d/.test(str); // ตรวจสอบว่ามีตัวเลขหรือไม่
    const hasLetter = /[a-zA-Z]/.test(str); // ตรวจสอบว่ามีตัวอักษรภาษาอังกฤษหรือไม่
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(str); // ตรวจสอบว่ามีอักขระพิเศษหรือไม่
    return {
      hasNumber,
      hasLetter,
      hasSpecialChar,
    };
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setdata({ ...data, [name]: value });
    switch (name) {
      case "newPass":
        if (value.length > 8) {
          setlengCorrect(true);
        } else {
          setlengCorrect(false);
        }
        const { hasLetter, hasNumber, hasSpecialChar } = formatInput(value);
        if (hasLetter && hasNumber && hasSpecialChar && value !== "") {
          setFormatCorrect(true);
        } else {
          setFormatCorrect(false);
        }
        if (value === "" || value !== data.reNewPass) {
          setRePassCorrecet(false);
        } else {
          setRePassCorrecet(true);
        }
        break;
      case "reNewPass":
        if (value === "" || value !== data.newPass) {
          setRePassCorrecet(false);
        } else {
          setRePassCorrecet(true);
        }
        break;
      default:
        break;
    }
  };

  const autoPassword = () => {
    setdata({ ...data, newPass: generatePassword() });
    setFormatCorrect(true);
    setlengCorrect(true);
  };

  const formatTime = (sec) => {
    const minute = Math.floor(sec / 60);
    const seccond = sec % 60;
    return timeRef < 0
      ? "หมดเวลา"
      : `0${minute}:${seccond.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isSend && timeRef > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRef((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isSend]);

  const checkAuth = async (e) => {
    e.preventDefault();
    if (data.username === "" || data.email === "")
      return Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
    setIsLoading(true);
    try {
      const res = await checckAuthNoLogin({
        username: data.username,
        email: data.email,
      });
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
      // ส่งอีเมล์
      const tempOTP = randomOTP();
      setOTP(tempOTP);
      const send = await sendEmail(
        data.email,
        "",
        "รหัสยืนยันอีเมล์แก้ไขรหัสผ่าน",
        "ระบบสารสนเทศสมุนไพรไทย",
        `"${tempOTP} คือรหัสยืนยันตัวตนของคุณ"`
      );
      if (!send) return "เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error";

      await Swal.fire(
        "แจ้งเตือน",
        "ระบบได้ส่งรหัสยืนยันไปยังอีเมล์ของคุณแล้ว",
        "success"
      );
      setIsSend(true);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "เกิดข้อผิดพลาด",
        "โปรดตรวจสอบความถูกต้องของชื่อผู้ใช้งานและอีเมล์",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkOTP = async () => {
    if (timeRef <= 0) {
      await Swal.fire("หมดเวลา", "ไม่สามารถดำเนินการได้", "error");
    }
    if (data.otp != OTP) return Swal.fire("รหัสยืนยันไม่ถูกต้อง", "", "error");

    await Swal.fire("รหัสยืนยันถูกต้อง", "", "success");
    setOTPCorrect(true);
  };

  const saveNewPass = async () => {
    if (!lengthCorrect || !formatCorrect || !rePassCorreect)
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดตรวจสอบความถูกต้อง", "error");
    setIsLoading(true);
    try {
      const res = await updatePassNoAuth({
        username: data.username,
        newPass: data.newPass,
      });
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
      navigate("/login");
    } catch (err) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดำเนินการได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultPage = () => {
    setdata({ username: "", email: "", newPass: "", reNewPass: "", otp: "" });
    setAuthPass(false);
    setFormatCorrect(false);
    setIsSend(false);
    setOTPCorrect(false);
    setRePassCorrecet(false);
    setTimeRef(8 * 60);
    setlengCorrect(false);
    setOTP(0);
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Navbar />
      {!authPass && !isSend && !otpCorrect ? (
        <form
          onSubmit={checkAuth}
          className="w-[35%] relative flex flex-col gap-8 items-center border shadow-xl rounded-lg flex"
          style={{ padding: "2rem 3rem" }}
        >
          {isLoading && <EmailLoading />}
          <div className="flex items-center flex-col gap-2">
            <label htmlFor="" className="text-4xl font-bold text-green-900">
              AUTHENTICATION
            </label>
            <label htmlFor="" className="text-gray-700">
              ยืนยันตัวตนด้วยชื่อผู้ใช้งานและอีเมล์
            </label>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="" className="w-full flex gap-2 items-center">
              <FaUserAlt /> Username
            </label>
            <input
              value={data.username}
              onChange={handleInput}
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้งาน"
              style={{ padding: "0.3rem 0.5rem" }}
              className="border-2"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="" className="w-full flex gap-2 items-center">
              <FaEnvelope /> Email
            </label>
            <input
              value={data.email}
              onChange={handleInput}
              type="email"
              name="email"
              placeholder="อีเมล์ที่ใช้กับบัญชีปัจจุบันของคุณ"
              style={{ padding: "0.3rem 0.5rem" }}
              className="border-2"
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="" className="text-[0.85rem] text-red-600">
              *ระบบจะส่งรหัสเพื่อยืนยันตัวตนไปยังอีเมล์ โปรดดำเนินการใน 8 นาที
            </label>
            <button
              style={{ marginTop: "0.5rem", padding: "0.8rem" }}
              className="w-full text-white text-xl bg-green-600 cursor-pointer rounded-lg transiton-all durartion-all hover:bg-green-800 active:scale-90"
            >
              ยืนยันตัวตน
            </button>
          </div>
        </form>
      ) : isSend && !otpCorrect ? (
        <div
          className="relative flex flex-col gap-2 border-2 items-center rounded-lg"
          style={{ padding: "2rem 3rem" }}
        >
          <button
            onClick={defaultPage}
            className="absolute top-2 left-2 transition-all duration-200 hover:text-white hover:bg-red-600 rounded-full cursor-pointer"
            style={{ padding: "0.3rem 0.5rem" }}
          >
            <i className="fas fa-rotate-right"></i>
          </button>
          <label htmlFor="" className="font-bold text-3xl text-green-900">
            ตรวจสอบที่อีเมล์ของคุณ
          </label>
          <img src="/img/email.png" className="w-[10rem]" alt="" />
          <label htmlFor="" className="text-red-600">
            *โปรดทำการยืนยันภายใน {formatTime(timeRef)}
          </label>
          <div
            className="w-[25rem] flex flex-col gap-2"
            style={{ marginTop: "2rem" }}
          >
            <label className="w-full flex items-center gap-2" htmlFor="">
              <FaKey />
              รหัสยืนยัน
            </label>
            <input
              type="text"
              name="otp"
              value={data.otp}
              onChange={handleInput}
              className="border-2"
              style={{ padding: "0.4rem" }}
              placeholder="กรอกรหัสยืนยัน"
            />
          </div>
          <button
            onClick={checkOTP}
            style={{ padding: "0.8rem", marginTop: "1.2rem" }}
            className="cursor-pointer w-full text-xl text-white bg-green-700 trasition-all duration-200 hover:bg-green-900 active:scale-95 flex items-center gap-2 justify-center"
          >
            ยืนยัน <FaCheck />
          </button>
        </div>
      ) : OTP ? (
        <div
          className="w-[50%] relative gap-6 flex items-center border shadow-xl rounded-lg justify-between"
          style={{ padding: "2rem 3rem" }}
        >
          {isLoading && <EmailLoading />}
          <button
            onClick={defaultPage}
            className="absolute top-2 left-2 transition-all duration-200 hover:text-white hover:bg-red-600 rounded-full cursor-pointer"
            style={{ padding: "0.3rem 0.5rem" }}
          >
            <i className="fas fa-rotate-right"></i>
          </button>
          <div
            className=" w-[40%] flex flex-col gap-3 border-r-4 border-green-700"
            style={{ paddingRight: "2rem" }}
          >
            <div className="w-full h-[25vh]">
              <img src="/img/edit_pass.png" className="w-full h-full" alt="" />
            </div>
            <div className="flex flex-col w-full gap-1">
              <label
                htmlFor=""
                style={{ color: `${lengthCorrect ? "green" : ""}` }}
                className={`text-[0.85rem] text-red-600 flex items-center gap-2`}
              >
                {lengthCorrect ? <FaCheck /> : "*"}รหัสผ่านมากกว่า 8 ตัวอักษร
              </label>
              <label
                htmlFor=""
                style={{ color: `${formatCorrect ? "green" : ""}` }}
                className={`text-[0.85rem] text-red-600 flex items-center gap-2`}
              >
                {formatCorrect ? <FaCheck /> : "*"}รหัสผ่านประกอบด้วยตัวอักษร
                ตัวเลขและอักขระพิเศษ
              </label>
              <label
                htmlFor=""
                style={{ color: `${rePassCorreect ? "green" : ""}` }}
                className={`text-[0.85rem] text-red-600 flex items-center gap-2`}
              >
                {rePassCorreect ? <FaCheck /> : "*"}ยืนยันรหัสผ่านถูกต้อง
              </label>
            </div>
          </div>
          <div className="relative w-[50%] flex flex-col gap-8">
            <div className="w-full items-center flex flex-col gap-2">
              <label htmlFor="" className="text-4xl font-bold text-green-900">
                CHANGE YOUR PASSWORD
              </label>
              <label htmlFor="" className="w-full text-gray-700">
                สร้างรหัสผ่านใหม่ของคุณ
              </label>
            </div>
            <div className="relative w-full flex flex-col gap-2">
              <label
                onClick={() => setShowNewPass(!showNewPass)}
                className={`absolute top-2 right-0 cursor-pointer ${
                  showNewPass ? "text-green-500" : " "
                }`}
              >
                <FaEye />
              </label>
              <label htmlFor="" className="w-full flex items-center gap-2">
                <FaLock /> New Password
              </label>
              <input
                value={data.newPass}
                onChange={handleInput}
                type={showNewPass ? "text" : "password"}
                name="newPass"
                placeholder="รหัสผ่านใหม่"
                style={{ padding: "0.3rem" }}
                className="border-2 "
              />
              <button
                onClick={autoPassword}
                className="w-full bg-gray-400 cursor-pointer transition-all deraution-200 hover:text-white hover:bg-green-900 active:scale-95"
                style={{ padding: "0.5rem 0.8rem" }}
              >
                สร้างอัตโนมัติ
              </button>
            </div>
            <div className="relative w-full flex flex-col gap-2">
              <label
                onClick={() => setShowReNew(!showReNew)}
                className={`absolute top-2 right-0 cursor-pointer ${
                  showReNew ? "text-green-500" : " "
                }`}
              >
                <FaEye />
              </label>
              <label htmlFor="" className="flex gap-2 items-center">
                <FaCheck />
                Confirm New Password :
              </label>
              <input
                value={data.reNewPass}
                onChange={handleInput}
                type={showReNew ? "text" : "password"}
                name="reNewPass"
                placeholder="ยืนยันรหัสผ่านใหม่"
                style={{ padding: "0.3rem" }}
                className="border-2 "
              />
            </div>
            <button
              onClick={saveNewPass}
              style={{ padding: "0.7rem" }}
              className="rounded-xl text-xl w-full bg-green-700 cursor-pointer flex items-center justify-center gap-2 transition-all deraution-200 text-white hover:bg-green-900 active:scale-95"
            >
              บันทึก <FaSave />
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChangePassword;
