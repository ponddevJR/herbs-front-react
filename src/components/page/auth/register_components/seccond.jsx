import { useState } from "react";
import { FaImage, FaUpload, FaUserCheck, FaUserEdit } from "react-icons/fa";

const Seccond = (props) => {
  const [form, setForm] = useState({
    file: "",
    fname: "",
    lname: "",
    url: "",
  });
  const [imgSrc, setImgSrc] = useState(
    "https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_640.png"
  );
  const [formatFname, setFormatFname] = useState(false);
  const [formatLname, setFormatLname] = useState(false);

  function isOnlyThaiOrEnglish(input) {
    const thaiRegex = /^[ก-๙]+$/; // ภาษาไทยล้วน (ห้ามมีช่องว่าง, ตัวเลข หรืออักขระพิเศษ)
    const englishRegex = /^[a-zA-Z]+$/; // ภาษาอังกฤษล้วน (ห้ามมีช่องว่าง, ตัวเลข หรืออักขระพิเศษ)

    return thaiRegex.test(input) || englishRegex.test(input);
  }

  // จัดการ input
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value.trim();
    switch (name) {
      case "file":
        setForm({ ...form, [name]: e.target.files[0], url: "" });
        inputFile(e);
        break;
      case "url":
        setForm({ ...form, [name]: value, file: "" });
        setImgSrc(value);
        break;
      case "fname":
        setForm({ ...form, [name]: value });
        const corect = isOnlyThaiOrEnglish(value);
        if (!corect) {
          setFormatFname(true);
        } else {
          setFormatFname(false);
        }
        break;
      case "lname":
        setForm({ ...form, [name]: value });
        const correct = isOnlyThaiOrEnglish(value);
        if (!correct) {
          setFormatLname(true);
        } else {
          setFormatLname(false);
        }
      default:
        setForm({ ...form, [name]: value });
        break;
    }
  };
  // อ่านไฟล์รูปภาพจากเครื่องเพื่อแสดงผลทางหน้าจอ
  const inputFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      (reader.onload = function (e) {
        setImgSrc(e.target.result);
      }),
        reader.readAsDataURL(file);
    }
  };
  // sendForm
  const submitData = async (e) => {
    e.preventDefault();
    // ตรวจสอบความถูกต้อง
    if (formatFname || formatLname || !form.fname || !form.lname)
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดตรวจสอบความถูกต้อง", "error");
    // สอบถามกรณีไม่ได้เลือกรูปโปรไฟล์
    if (!form.file && !form.url) {
      const { isConfirmed } = await Swal.fire({
        icon: "question",
        text: "คุณยังไม่ได้อัปโหลดรูปโปลไฟล์เลย!",
        cancelButtonText: "ภายหลัง",
        confirmButtonText: "อัปโหลดเลย",
        showCancelButton: true,
      });
      // ลบคีย์ว่างออก
      if (!isConfirmed) {
        const newForm = cleanForm(form);
        props.sendForm({ ...newForm, url: imgSrc });
      }
    } else {
      // ถ้ามีรูปแล้วก็ส่งไปเลย
      const newForm = cleanForm(form);
      props.sendForm(newForm);
    }
  };
  // clean the form
  const cleanForm = (form) => {
    return Object.fromEntries(
      Object.entries(form).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );
  };

  return (
    <form
      onSubmit={submitData}
      className="w-[465px] h-[440px] flex flex-col justify-between"
      style={{ padding: "1.5rem 2.8rem" }}
    >
      <div className="w-full flex items-center gap-6">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2" htmlFor="file-upload">
            <FaImage /> Profile
          </label>
          <img
            className="w-[5rem] h-[10.5vh] rounded-full border object-cover"
            src={imgSrc}
            alt="Profile Preview"
          />
        </div>
        <div className="flex flex-col gap-4 w-[75%]">
          {/* ซ่อน input file */}
          <input
            onChange={handleInput}
            name="file"
            id="file-upload"
            type="file"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            style={{ padding: "0.5rem 1.2rem" }}
            className="flex items-center gap-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition"
          >
            <FaUpload /> เลือกไฟล์รูปภาพจากเครื่อง
          </label>
          <input
            onChange={handleInput}
            value={form.url}
            name="url"
            style={{ paddingBottom: "0.3rem" }}
            className="border-b-2 outline-none pb-1"
            type="text"
            placeholder="หรืออัปโหลดผ่าน URL"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="flex items-center gap-2" htmlFor="">
          <FaUserEdit /> ชื่อ
        </label>
        <input
          onChange={handleInput}
          value={form.fname}
          className="border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type="text"
          placeholder="ชื่อจริงตามบัตรประชาชน"
          name="fname"
        />
        {formatFname && (
          <small className="text-red-500 text-[0.75rem]">
            *รูปแบบไม่ถูกต้อง
          </small>
        )}
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="flex items-center gap-2" htmlFor="">
          <FaUserCheck /> นามสกุล
        </label>
        <input
          onChange={handleInput}
          value={form.lname}
          className="border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type="text"
          placeholder="นามสกุลจริงตามบัตรประชาชน"
          name="lname"
        />
        {formatLname && (
          <small className="text-red-500 text-[0.75rem]">
            *รูปแบบไม่ถูกต้อง
          </small>
        )}
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

export default Seccond;
