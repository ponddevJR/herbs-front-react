import { useEffect, useState } from "react";
import { FaEye, FaLock, FaUserCheck, FaKey, FaCheck } from "react-icons/fa";
import EmailLoading from "../../../layout/emailLoading";
import { checkPassword } from "../../../function/user";
import { generatePassword } from "../../../function/randomPass";

const EditPassword = ({ user, sendNewPass }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authPass, setAuthPass] = useState(false);
  const [data, setdata] = useState({
    username: "",
    password: "",
    newPass: "",
    reNewPass: "",
  });
  const [showAuthPass, setShowAuthPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showReNew, setShowReNew] = useState(false);

  const [lengthCorrect, setlengCorrect] = useState(false);
  const [formatCorrect, setFormatCorrect] = useState(false);
  const [rePassCorreect, setRePassCorrecet] = useState(false);

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
        if (hasLetter && hasNumber && hasSpecialChar) {
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

  const authUser = async () => {
    if (data.username !== user?.username)
      return Swal.fire(
        "เกิดข้อผิดพลาด",
        "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
        "error"
      );
    setIsLoading(true);
    try {
      const isMatch = await checkPassword({
        _id: user?._id,
        password: data.password,
      });
      if (isMatch.data.err)
        return Swal.fire(
          "เกิดข้อผิดพลาด",
          "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
          "error"
        );

      await Swal.fire("ข้อมูลถูกต้อง", "", "success");
      setAuthPass(true);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "เกิดข้อผิดพลาด",
        "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetDefault = () => {
    setAuthPass(false);
    setdata({ username: "", password: "", newPass: "", reNewPass: "" });
    setFormatCorrect(false);
    setRePassCorrecet(false);
    setShowNewPass(false);
    setShowReNew(false);
    setlengCorrect(false);
    setShowAuthPass(false);
  };

  const updatePass = async () => {
    if (!lengthCorrect || !formatCorrect || !rePassCorreect)
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดตรวจสอบความถูกต้อง", "error");
    await sendNewPass({ username: user?.username, newPass: data.newPass });
  };

  const autoPassword = () => {
    setdata({ ...data, newPass: generatePassword() });
    setFormatCorrect(true);
    setlengCorrect(true);
  };
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-[50%] bg-green-900"></div>
      {!authPass ? (
        <div
          className="relative w-[50%] flex flex-col gap-8 items-center z-5 rounded-xl border-2 bg-white"
          style={{ padding: "1.5rem 2rem" }}
        >
          {isLoading && <EmailLoading />}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="" className="text-3xl font-bold">
              ยืนยันตัวตน
            </label>
            <label htmlFor="" className="text-[0.9rem] text-gray-600">
              โปรดทำการยืนยันตัวตน
            </label>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="" className="flex items-center gap-2">
              <FaUserCheck />
              Username :
            </label>
            <input
              value={data.username}
              onChange={handleInput}
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้งาน"
              style={{ padding: "0.3rem" }}
              className="border-b-2 "
            />
          </div>
          <div className="relative w-full flex flex-col gap-2">
            <button
              onClick={() => setShowAuthPass(!showAuthPass)}
              className={`absolute top-2 right-0 cursor-pointer ${
                showAuthPass ? "text-green-500" : " "
              }`}
            >
              <FaEye />
            </button>
            <label htmlFor="" className="flex items-center gap-2">
              <FaLock />
              Password :
            </label>
            <input
              value={data.password}
              onChange={handleInput}
              type={showAuthPass ? "text" : "password"}
              name="password"
              placeholder="ชื่อผู้ใช้งาน"
              style={{ padding: "0.3rem" }}
              className="border-b-2 "
            />
          </div>
          <button
            onClick={authUser}
            className="text-lg text-white bg-green-600 w-full rounded-md cursor-pointer active:scale-90"
            style={{ padding: "0.6rem" }}
          >
            ยืนยัน
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex justify-between z-5 bg-green-900">
          <div
            className="w-[40%] relative bg-white h-full items-center justify-evenly flex flex-col gap-1"
            style={{ padding: "2rem" }}
          >
            <button
              onClick={resetDefault}
              className="absolute top-2 left-2 cursor-pointer transition-all duration-500 rounded-full hover:bg-red-600 hover:text-white"
              style={{ padding: "0.3rem 0.5rem" }}
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
            <div className="w-full h-[45%]">
              <img src="/img/password.png" className="w-full h-full" alt="" />
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
          <div
            className="w-[58%] relative h-full bg-white flex flex-col gap-7 items-center"
            style={{ marginRight: "0.4rem", padding: "1.5rem" }}
          >
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="" className="font-bold text-4xl">
                Change Password
              </label>
              <label htmlFor="" className="text-[1rem] text-gray-600">
                สร้างรหัสผ่านใหม่ด้วยตัวคุณเอง
              </label>
            </div>
            <div className="relative w-[90%] flex flex-col gap-2">
              <label
                onClick={() => setShowNewPass(!showNewPass)}
                className={`absolute top-2 right-0 cursor-pointer ${
                  showNewPass ? "text-green-500" : " "
                }`}
              >
                <FaEye />
              </label>
              <label htmlFor="" className="flex gap-2 items-center">
                <FaKey />
                Password :
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
            <div className="relative w-[90%] flex flex-col gap-2">
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
                Confirm Password :
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
              onClick={updatePass}
              style={{ padding: "0.8rem" }}
              className="rounded-xl text-xl w-[90%] bg-green-900 cursor-pointer transition-all deraution-200 text-white hover:bg-green-700 active:scale-95"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}

      <div></div>
    </div>
  );
};

export default EditPassword;
