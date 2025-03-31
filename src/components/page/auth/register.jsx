import { useEffect, useState } from "react";
import Navbar from "../../layout/navbar";
import "../../style/register.css";
import FirstStep from "./register_components/firstep";
import Seccond from "./register_components/seccond";
import Loading from "../../layout/loading";
import Thirst from "./register_components/thirst";
import LastStep from "./register_components/laststep";
import { getSingle, register } from "../../function/user";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navagate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slide, setSlide] = useState(0);
  const [form, setForm] = useState({});

  // checklogin
  useEffect(() => {
    getSingle().then((res) => {
      if (res) return navagate("/");
    });
  });

  // slide container
  const slideContainer = () => {
    setSlideIndex((prev) => {
      const newIndex = prev + 1;
      setSlide(465 * newIndex);
      return newIndex;
    });
  };

  // checkNextStep
  const checkNextStep = (value) => {
    if (!value) return;
    // เพิ่มข้อมูลให้ form
    setForm({ ...form, ...value });
    slideContainer();
  };

  // register
  const subMitRegister = async (value) => {
    setIsLoading(true);
    try {
      const finalForm = { ...form, ...value };
      const formEncryp = new FormData();
      for (const key in finalForm) {
        formEncryp.append(key, finalForm[key]);
      }
      const res = await register(formEncryp);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
      await Swal.fire(
        "สำเร็จ",
        res.data.mes + " ระบบจะส่งผลการลงทะเบียนไปยังอีเมล์ของคุณ",
        "success"
      );

      setForm({});
      setSlide(0);
      setSlideIndex(0);
      navagate("/login");
    } catch (error) {
      await Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลงทะเบียนได้", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      {isLoading && <Loading />}
      <Navbar />
      <h1
        className="text-5xl text-green-800 font-bold w-[55%] border-b-3 justify-between flex items-end"
        style={{ paddingBottom: "0.4rem", marginTop: "2.5rem" }}
      >
        <span>REGISTER</span>{" "}
        <span className="text-[1rem] text-black font-normal">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            to="/login"
            className="text-sky-600"
            style={{ textDecoration: "underline" }}
          >
            เข้าสู่ระบบ
          </Link>
        </span>
      </h1>
      <div className="flex w-[55%] h-[62%] border shadow-xl rounded-xl overflow-hidden bg-white">
        <div className="w-[45%] h-full">
          <img className="w-full h-full" src="/img/hersb_logo.png" alt="" />
        </div>
        <div className="relative overflow-hidden w-[55%] h-full">
          <div
            className="absolute w-auto top-0 left-0 flex"
            style={{
              transform: `translateX(-${slide}px)`,
              transition: "0.8s all ease",
            }}
          >
            {/* username password */}
            <FirstStep sendForm={checkNextStep} />
            {/* profile fullname */}
            <Seccond sendForm={checkNextStep} />
            {/* email and role */}
            <Thirst sendForm={checkNextStep} />
            {/* adddress section */}
            <LastStep subMitRegister={subMitRegister} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
