import { useState } from "react";
import { FaCheck, FaLock, FaUser, FaEye } from "react-icons/fa";
import { checkUserRepeat } from "../../../function/user";
import EmailLoading from "../../../layout/emailLoading";

const FirstStep = (props) => {
  const [form, setForm] = useState({});
  // state สำหรับตรวจสอบความถูกต้อง
  const [checkUsername, setCheckUsername] = useState(false);
  const [passwordLength, setPassLength] = useState(false);
  const [correctFormat, setCorrectFormat] = useState(false);
  const [confirmCorrect, setConfirmCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
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

  // set input form value
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value.trim();
    setForm({ ...form, [name]: value });
    switch (name) {
      // ตรวจสอบ username
      case "username":
        const { hasNumber, hasLetter } = formatInput(value);
        if (
          value.length > 6 &&
          hasNumber &&
          hasLetter &&
          value !== form.password
        ) {
          setCheckUsername(true);
        } else {
          setCheckUsername(false);
        }
        if(value === form.password){
          setCheckUsername(false);
        }else{
          setCheckUsername(true)
        }
        break;
      case "password":
        const {
          hasNumber: num,
          hasLetter: letter,
          hasSpecialChar,
        } = formatInput(value);
        if (value.length > 8) {
          setPassLength(true);
        } else {
          setPassLength(false);
        }
        if (num && letter && hasSpecialChar) {
          setCorrectFormat(true);
        } else {
          setCorrectFormat(false);
        }
        if (value !== form.confirm_password) {
          setConfirmCorrect(false);
        } else {
          setConfirmCorrect(true);
        }
        if(value === form.username){
          setCheckUsername(false);
        }else{
          setCheckUsername(true)
        }
        break;
      case "confirm_password":
        if (form.password === value) {
          setConfirmCorrect(true);
        } else {
          setConfirmCorrect(false);
        }
        break;
      default:
        return;
    }
  };

  // ตรวจสอบเพื่อไปขั้นตอนต่อไป
  const nextStep = async (e) => {
    e.preventDefault();
    // ตรวจสอบความถูกต้อง
    if (!checkUsername || !passwordLength || !correctFormat || !confirmCorrect)
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดตรวจสอบความถูกต้อง", "error");
    // ตรวจสอบรหัสผ่านตรงกับชื่อผู้ใช้งาน
    if (form.username === form.password)
      return Swal.fire(
        "เกิดข้อผิดพลาด",
        "รหัสผ่านต้องไม่ตรงกับชื่อผู้ใช้งาน",
        "error"
      );
    // ตรวจสอบ username ซ้ำ
    setIsLoading(true);
    try {
      const isRepeat = await checkUserRepeat(form.username);
      if (isRepeat.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", isRepeat.data.err, "error");
      // ส่งไปยัง Register
      const formData = { ...form };
      delete formData.confirm_password;
      props.sendForm(formData);
      setForm({});
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={nextStep}
      className="w-[465px] h-[455px] flex flex-col justify-between"
      style={{ padding: "1.5rem 2.8rem" }}
    >
      {isLoading && <EmailLoading />}
      <div className="w-full flex flex-col gap-2">
        <label className="flex items-center gap-2" htmlFor="">
          <FaUser /> Username
        </label>
        <input
          onChange={handleInput}
          className="border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type="text"
          placeholder="ชื่อผู้ใช้งาน"
          name="username"
        />
      </div>
      <div className="relative w-full flex flex-col gap-2">
        <label
          onClick={() => setShowPass(!showPass)}
          className={`cursor-pointer absolute top-2 right-0 ${
            showPass ? "text-green-500" : ""
          }`}
        >
          <FaEye />
        </label>
        <label className="flex items-center gap-2" htmlFor="">
          <FaLock /> Password
        </label>
        <input
          onChange={handleInput}
          className="border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type={showPass ? "text" : "password"}
          placeholder="รหัสผ่าน"
          name="password"
        />
      </div>
      <div className="relative w-full flex flex-col gap-2">
        <label
          onClick={() => setShowRePass(!showRePass)}
          className={`cursor-pointer absolute top-2 right-0 ${
            showRePass ? "text-green-500" : ""
          }`}
        >
          <FaEye />
        </label>
        <label className="flex items-center gap-2" htmlFor="">
          <FaCheck /> Confirm Password
        </label>
        <input
          onChange={handleInput}
          className="border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type={showRePass ? "text" : "password"}
          placeholder="ยืนยันรหัสผ่าน"
          name="confirm_password"
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <label
          className={`text-[0.8rem] flex items-center gap-1 ${
            checkUsername ? "text-green-600" : "text-red-500"
          }`}
          htmlFor=""
        >
          {checkUsername ? <FaCheck /> : "*"}ชื่อผู้ใช้งานต้องมากกว่า 6 ตัวอักษร
          ประกอบด้วยตัวอักษร ตัวเลขและต้องไม่ตรงกับรหัสผ่าน
        </label>
        <label
          className={`text-[0.8rem] flex items-center gap-1 ${
            passwordLength ? "text-green-600" : "text-red-500"
          }`}
          htmlFor=""
        >
          {passwordLength ? <FaCheck /> : "*"}รหัสผ่านต้องมากกว่า 8 ตัวอักษร
        </label>
        <label
          className={`text-[0.8rem] flex items-center gap-1 ${
            correctFormat ? "text-green-600" : "text-red-500"
          }`}
          htmlFor=""
        >
          {correctFormat ? <FaCheck /> : "*"}รหัสผ่านต้องประกอบด้วยตัวอักษร
          ตัวเลขและอักขระพิเศษ
        </label>
        <label
          className={`text-[0.8rem] flex items-center gap-1 ${
            confirmCorrect ? "text-green-600" : "text-red-500"
          }`}
          htmlFor=""
        >
          {confirmCorrect ? <FaCheck /> : "*"}ยืนยันรหัสผ่านถูกต้อง
        </label>
      </div>
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 cursor-pointer rounded-md w-full text-white text-lg"
        style={{ padding: "0.5rem" }}
      >
        ยืนยัน
      </button>
    </form>
  );
};
export default FirstStep;
