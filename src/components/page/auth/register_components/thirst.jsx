import { useEffect, useState, useRef } from "react";
import { FaEnvelope, FaKey, FaPersonBooth, FaPhone } from "react-icons/fa";
import {
  randomOTP,
  sendEmail,
  isValidThaiPhoneNumber,
} from "../../../function/sendEmail";
import EmailLoading from "../../../layout/emailLoading";

const Thirst = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [phoneActive, setPhoneActive] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    role: "เลือกบทบาท",
  });
  const [timeRef, setTimeRef] = useState(8 * 60);
  const intervalRef = useRef(null);
  const [OTP, setOTP] = useState("");

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  // ส่งอีเมล์;
  const checkEmail = async () => {
    if (!form.email)
      return Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");
    // check gmail format
    const gmailPattern = /^[^\s@]+@gmail\.com$/;
    const isCorrect = gmailPattern.test(form.email);
    if (!isCorrect)
      return Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");

    // ส่งอีเมล์
    const tempOTP = randomOTP();
    setOTP(tempOTP);
    setIsLoading(true);
    try {
      await sendEmail(
        form.email,
        "",
        "รหัสยืนยันอีเมล์",
        "ระบบสารสนเทศสมุนไพรไทย",
        `"${tempOTP}" คือรหัสยืนยันอีเมล์ของท่าน`
      );
      // ส่งสำเร็จ
      setIsLoading(false);
      await Swal.fire(
        "แจ้งเตือน",
        "ระบบได้ส่งรหัสยืนยันไปยังอีเมล์ของท่านแล้ว",
        "success"
      );
      setIsSend(true);
    } catch (error) {
      console.log(error);
      Swal.fire("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในระหว่างการส่งรหัส", "error");
    }
  };

  // นับถอยหลัง
  useEffect(() => {
    if (isSend && timeRef > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRef((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isSend]);
  // แสดงเวลา
  const formatTime = (sec) => {
    const minute = Math.floor(sec / 60);
    const seccond = sec % 60;
    return timeRef < 0
      ? "หมดเวลา"
      : `0${minute}:${seccond.toString().padStart(2, "0")}`;
  };

  // ยืนยันรหัสผ่านอีเมล์
  const checkEmailCode = async () => {
    if (timeRef <= 0) {
      await Swal.fire("หมดเวลา", "ไม่สามารถดำเนินการได้", "error");
      location.reload();
    }
    // ตรวจสอบรหัสผ่าน
    if (form.code === OTP) {
      await Swal.fire("รหัสยืนยันถูกต้อง", "", "success");
      setPhoneActive(true);
    } else {
      return Swal.fire("เกิดข้อผิดพลาด", "รหัสยืนยันไม่ถูกต้อง", "error");
    }
  };

  // sendForm
  const sendForm = () => {
    const correctPhoneFormat = isValidThaiPhoneNumber(form.phone);
    // validate form
    if (!correctPhoneFormat)
      return Swal.fire(
        "เกิดข้อผิดพลาด",
        "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง",
        "error"
      );
    if (form.role === "เลือกบทบาท")
      return Swal.fire(
        "เกิดข้อผิดพลาด",
        "กรุณาเลือกบทบาทในการลงทะเบียน",
        "error"
      );
    // delete otp key
    const formFinal = { ...form };
    delete formFinal.code;
    // send form to register component
    props.sendForm(formFinal);
  };

  // ขอรหัสผ่านใหม่
  const newOTPCode = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "แจ้งเตือน",
      text: "ต้องการขอรหัสยืนยันอีกครั้งหรือไม่",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "ส่งรหัสอีกครั้ง",
    });
    if (!isConfirmed) return;
    const tempOTP = randomOTP();
    setOTP(tempOTP);
    setIsLoading(true);
    try {
      await sendEmail(
        form.email,
        "",
        "รหัสยืนยันอีเมล์",
        "ระบบสารสนเทศสมุนไพรไทย",
        `"${tempOTP}" คือรหัสยืนยันอีเมล์ของท่าน`
      );
      setIsLoading(false);
      await Swal.fire(
        "แจ้งเตือน",
        "ระบบได้ส่งรหัสยืนยันไปยังอีเมล์ของท่านแล้ว",
        "success"
      );
      setTimeRef(8 * 60);
    } catch (error) {
      console.log(error);
      Swal.fire("เกิดข้อผิดพลาด", "เกิดข้อผิดพลาดในระหว่างการส่งรหัส", "error");
    }
  };
  return (
    <div
      className="relative w-[465px] h-[455px] flex flex-col justify-center"
      style={{ padding: "1.5rem 2.8rem" }}
    >
      {isLoading && <EmailLoading />}
      <div
        style={{ display: `${isSend ? "none" : "flex"}` }}
        className="w-full items-center flex-col gap-2"
      >
        <img
          src="/public/img/email.png"
          className="w-[10rem] h-[8rem]"
          alt=""
        />
        <p
          style={{ margin: "0.8rem 0" }}
          className="text-red-500 text-[0.8rem]"
        >
          *ระบบจะส่งรหัสยืนยันไปยังอีเมล์นี้ โปรดทำการยืนยันภายใน 8 นาที
        </p>
        <label className="flex items-center gap-2 w-full" htmlFor="">
          <FaEnvelope /> Email
        </label>
        <input
          value={form.email}
          onChange={handleInput}
          className="border-b-2 outline-none w-full"
          style={{ paddingBottom: "0.3rem" }}
          type="email"
          placeholder="อีเมล์(gmail เท่านั้น)"
          name="email"
        />
        <button
          onClick={checkEmail}
          className="w-full transition-all duration-200 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-700"
          style={{ padding: "0.8rem 0", marginTop: "1.5rem" }}
        >
          ตรวจสอบอีเมล์
        </button>
      </div>
      <div
        style={{ display: `${isSend && !phoneActive ? "flex" : "none"}` }}
        className="w-full items-center flex flex-col gap-2"
      >
        <img
          src="/img/mobile_mail.png"
          className="w-[10rem] h-[8rem]"
          alt=""
        />
        <p
          className="text-red-500 text-[0.8rem]"
          style={{ margin: "0.8rem 0" }}
        >
          *ตรวจสอบอีเมล์ของท่านและทำการยืนยันภายใน {formatTime(timeRef)}
        </p>
        <label className="w-full flex items-center gap-2" htmlFor="">
          <FaKey /> Enter Your Code
        </label>
        <input
          onChange={handleInput}
          className="w-full border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type="text"
          placeholder="ตรวจสอบอีเมล์และกรอกรหัส"
          name="code"
        />
        <div className="w-full flex items-center justify-between">
          <button
            onClick={newOTPCode}
            className="transition-all duration-200 bg-sky-600 text-white cursor-pointer rounded-lg hover:bg-blue-700"
            style={{ padding: "0.35rem 1rem", marginTop: "1.5rem" }}
          >
            ขอรหัสใหม่
          </button>
          <button
            onClick={checkEmailCode}
            className="transition-all duration-200 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-700"
            style={{ padding: "0.35rem 1rem", marginTop: "1.5rem" }}
          >
            ยืนยันรหัส
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: "2.5rem",
          display: `${phoneActive ? "flex" : "none"}`,
        }}
        className={`w-full h-full justify-between flex-col items-center transition-all duration-500 ${
          phoneActive
            ? "opacity-100 z-1 -translate-y-[20px]"
            : "opacity-0 z-[-1] translate-y-0"
        }`}
      >
        <div className="w-[40%] h-[28%]">
          <img className="w-full h-full" src="/public/img/phone.png" alt="" />
        </div>
        <p>กรอกเบอร์โทรศัพท์และเลือกบทบาท</p>
        <div
          style={{ marginTop: "1rem" }}
          className="w-full flex flex-col gap-2"
        >
          <label className="flex items-center gap-2" htmlFor="">
            <FaPhone /> Phone
          </label>
          <input
            value={form.phone}
            onChange={handleInput}
            className="border-b-2 outline-none"
            style={{ paddingBottom: "0.3rem" }}
            type="tel"
            placeholder="เบอร์โทรศัพท์"
            name="phone"
          />
        </div>
        <div
          className="w-full flex flex-col gap-2"
          style={{ marginTop: "1.5rem" }}
        >
          <label className="flex items-center gap-2" htmlFor="">
            <FaPersonBooth /> เลือกบทบาท
          </label>
          <select
            value={form.role}
            onChange={handleInput}
            className="border-2 outline-none cursor-pointer"
            style={{ paddingBottom: "0.3rem" }}
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            name="role"
          >
            <option value="เลือกบทบาท" disabled>
              เลือกบทบาท
            </option>
            <option value="normal">สมาชิกทั่วไป</option>
            <option value="medic">แพทย์</option>
            <option value="researcher">นักวิจัย</option>
          </select>
        </div>
        <button
          onClick={sendForm}
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer rounded-md w-[80%] text-white text-lg"
          style={{ padding: "0.8rem", marginTop: "2rem" }}
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default Thirst;
