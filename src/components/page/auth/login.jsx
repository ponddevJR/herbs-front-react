import { useState, useEffect } from "react";
import Loading from "../../layout/loading";
import Navbar from "../../layout/navbar";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getSingle, login } from "../../function/user";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  // checklogin
  useEffect(() => {
    getSingle().then((res) => {
      if (res) return navigate("/");
    });
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // login
  const submitLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const res = await login(form);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
      navigate("/");
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <Navbar />
      {isLoading && <Loading />}
      <form
        onSubmit={submitLogin}
        style={{
          padding: "1rem 3rem",
          paddingBottom: "2.5rem",
          marginTop: "2rem",
        }}
        className="w-[30%] border rounded-md shadow-xl flex flex-col bg-white"
      >
        <h1 className="text-5xl font-bold text-green-800 w-full">WELCOME</h1>
        <p className="w-full text-[0.9rem]">
          ยังไม่มีบัญชีหรอ?{" "}
          <Link
            className="text-sky-600"
            style={{ textDecoration: "underline" }}
            to="/register"
          >
            สมัครสมาชิก
          </Link>
        </p>
        <div
          style={{ marginTop: "1.5rem" }}
          className="flex flex-col w-full gap-2"
        >
          <label htmlFor="" className="flex gap-2 items-center font-bold">
            Username
          </label>
          <input
            value={form.username}
            onChange={handleInput}
            style={{ padding: "0.5rem" }}
            type="text"
            placeholder="ชื่อผู้ใช้งาน"
            className="border rounded-md"
            name="username"
          />
        </div>
        <div
          style={{ marginTop: "1.5rem" }}
          className="flex flex-col w-full gap-2"
        >
          <label
            htmlFor=""
            className="flex gap-2 items-center font-bold w-full justify-between"
          >
            {" "}
            Password{" "}
            <span
              onClick={() => setShowPass(!showPass)}
              className={`flex gap-2 items-center cursor-pointer ${
                showPass ? "text-green-600" : "text-black"
              }`}
            >
              <FaEye className="cursor-pointer" />
              show
            </span>
          </label>
          <input
            value={form.password}
            onChange={handleInput}
            style={{ padding: "0.5rem" }}
            type={`${showPass ? "text" : "password"}`}
            placeholder="รหัสผ่าน"
            className="border rounded-md"
            name="password"
          />
        </div>
        <button
          type="submit"
          className="w-[40%] transition-all duration-200 cursor-pointer hover:bg-green-600 rounded-full text-white bg-[#29443b]"
          style={{ padding: "0.65rem", marginTop: "2.2rem" }}
        >
          เข้าสู่ระบบ
        </button>
        <div style={{ marginTop: "1.5rem" }} className="flex justify-end">
          <Link
            to="/editpassword"
            className="text-[0.9rem] text-sky-600"
            style={{ textDecoration: "underline" }}
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
