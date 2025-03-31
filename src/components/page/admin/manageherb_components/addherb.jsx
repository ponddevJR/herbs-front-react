import { useEffect, useState } from "react";
import {
  FaCaretDown,
  FaFileDownload,
  FaLeaf,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { getAllCategories } from "../../../function/category";
import AdminLoading from "../../../layout/admin/adminloading";
import { v4 as uuid } from "uuid";
import { addHerb } from "../../../function/herbs";

const AddHerb = ({ active, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [imgArr, setImgArr] = useState([]);
  const [originalCtg, setOriginalCtg] = useState([]);
  const [categories, setCateories] = useState([]);
  const [herb, setHerb] = useState({});
  const [selectCtg, setSelectCtg] = useState([]);
  const [activeSelect, setActiveSelect] = useState(false);
  const [getfiles, setFiles] = useState([]);
  const [isNameTh, setIsNameTh] = useState(true);
  const [engSciName, setEngSciName] = useState(true);
  const [normalEngName, setNormalEngName] = useState(true);

  function isOnlyThaiOrEnglish(input) {
    const thaiRegex = /^[ก-๙]+$/; // ภาษาไทยล้วน (ห้ามมีช่องว่าง, ตัวเลข หรืออักขระพิเศษ)
    const englishRegex = /^[a-zA-Z .\/()]+$/;

    return { isTH: thaiRegex.test(input), isEn: englishRegex.test(input) };
  }

  const fetchCategories = () => {
    setIsLoading(true);
    try {
      getAllCategories().then((res) => {
        if (!res?.data) return;
        setCateories(res?.data?.categories);
        setOriginalCtg(res?.data?.categories);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const uploadsFiles = (e) => {
    const files = Array.from(e.target.files);
    // สร้าง array ของอ็อบเจ็กต์ที่มี id เดียวกันทั้ง imgArr และ files
    const newFiles = files.map((f) => {
      const id = uuid(); // สร้าง id เดียวกันสำหรับทั้ง imgArr และ files
      return {
        imgObj: { id, name: URL.createObjectURL(f) }, // สำหรับ imgArr
        fileObj: { id, file: f }, // สำหรับไฟล์จริง
      };
    });
    // แยกข้อมูลสำหรับ setState
    const fileObjArr = newFiles.map((f) => f.imgObj);
    const objFileArr = newFiles.map((f) => f.fileObj);

    setImgArr((prevImgArr) => [...fileObjArr, ...prevImgArr]);
    setFiles((prevFiles) => [...prevFiles, ...objFileArr]);
  };

  const delImg = (number, id) => {
    setImgArr((prev) => {
      return prev.filter((item, index) => index !== number);
    });
    setFiles((prev) => prev.filter((o) => o.id !== id));
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "name_th":
        const { isTH } = isOnlyThaiOrEnglish(value);
        if (!isTH) {
          setIsNameTh(false);
        } else {
          setIsNameTh(true);
        }
        break;
      case "name_science":
        const { isEn } = isOnlyThaiOrEnglish(value);
        if (!isEn) {
          setEngSciName(false);
        } else {
          setEngSciName(true);
        }
        break;
      case "name_normal":
        if (!/^(?=.*[a-zA-Z])[a-zA-Z, ]+$/.test(value)) {
          setNormalEngName(false);
        } else {
          setNormalEngName(true);
        }
        break;
      default:
        break;
    }
    setHerb({ ...herb, [name]: value });
  };

  const selectCategories = (name, id) => {
    const ctg = { id, name };
    setSelectCtg([ctg, ...selectCtg]);
    setCateories((prev) => prev.filter((old) => old._id !== id));
  };

  const deleteSelectCtg = (id) => {
    setSelectCtg((prev) => prev.filter((old) => old.id !== id));
    const ctg = originalCtg.filter((item) => item._id === id);
    setCateories([...ctg, ...categories]);
  };

  const searchCtg = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setCateories(
        selectCtg.length < 1
          ? [...originalCtg]
          : originalCtg.filter(
              (item1) => !selectCtg.some((item2) => item1._id === item2.id)
            )
      );
    } else {
      setCateories((prev) =>
        prev.filter((item) => {
          return item.ctg_name.includes(value);
        })
      );
    }
  };

  const submitHerb = async (e) => {
    e.preventDefault();
    if (!isNameTh || !engSciName || !normalEngName)
      return Swal.fire("เกิดข้อผิดพลาด", "รูปแบบข้อมูลไม่ถูกต้อง", "error");

    if (
      herb.herbs_look.length < 25 ||
      herb.usage.length < 25 ||
      herb.benefits.length < 25
    )
      return Swal.fire("เกิดข้อผิดพลาด", "รูปแบบข้อมูลไม่ถูกต้อง", "error");

    if (selectCtg.length < 1)
      return Swal.fire(
        "แจ้งเตือน",
        "เลือกหมวดหมู่อย่างน้อย 1 หมวดหมู่",
        "error"
      );
    if (imgArr.length < 1)
      return Swal.fire("แจ้งเตือน", "ต้องมีอย่างน้อย 1 รูปภาพ", "error");
    //
    if (inputUrl !== "")
      return Swal.fire("แจ้งเตือน", "มีรูปภาพยังไม่ถูกเพิ่ม", "warning");

    const { isConfirmed } = await Swal.fire({
      title: "แจ้งเตือน",
      text: "ต้องการเพิ่มสมุนไพรนี้หรือไม่?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "เพิ่ม",
    });
    if (!isConfirmed) return;

    const finalForm = {
      ...herb,
      categories: selectCtg.map((item) => item.id),
      imgs: imgArr
        .filter((item) => item.name.startsWith("h"))
        .map((item) => item.name),
    };
    let sendForm;
    if (getfiles.length > 0) {
      const formEncryp = new FormData();
      for (let i = 0; i < getfiles.length; i++) {
        formEncryp.append("images", getfiles[i].file);
      }
      for (const key in finalForm) {
        formEncryp.append(key, finalForm[key]);
      }
      sendForm = formEncryp;
    } else {
      sendForm = finalForm;
    }

    setIsLoading(true);
    try {
      const res = await addHerb(sendForm);
      if (res?.data?.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
      // resetค่า
      e.target.reset();
      resetToDefault();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "โปรดลองใหม่อีกครั้ง", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    setHerb({});
    setImgArr([]);
    setFiles([]);
    setSelectCtg([]);
    setCateories(originalCtg);
    setActiveSelect(false);
  };

  return (
    <div
      className={`${
        active ? "z-60 visible opacity-100" : "opacity-0 invisible z-[-1]"
      } transition-all duration-300 absolute top-0 left-0 w-full h-full bg-white flex`}
      style={{ padding: "0rem" }}
    >
      {isLoading && <AdminLoading />}
      <form
        encType="multipart/form-data"
        onSubmit={submitHerb}
        style={{ padding: "1.5rem" }}
        className="relative bg-white w-full h-full flex flex-col gap-5"
      >
        <label
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-2 text-xl hover:bg-red-600 hover:text-white cursor-poniter"
          style={{ padding: "0.3rem 0.5rem" }}
        >
          <FaTimes />
        </label>
        <div className="flex flex-col gap-1">
          <label
            htmlFor=""
            className="text-3xl font-bold text-[#0c2d1a] flex gap-2"
          >
            <FaLeaf className="text-green-600" /> เพิ่มข้อมูลสมุนไพร
          </label>
          <label
            htmlFor=""
            style={{ marginLeft: "2.5rem" }}
            className="font-bold text-green-950 text-[0.85rem]"
          >
            Add's new herb
          </label>
        </div>
        <div className="w-full flex justify-between gap-8">
          <div
            className="w-[50%] flex flex-col gap-8 border-r-3 "
            style={{ paddingRight: "3rem" }}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                ชื่อสมุนไพร :
                {!isNameTh && (
                  <small className="text-[0.8rem] text-red-600">
                    ตัวอักษรภาษาไทยเท่านั้นและห้ามมีตัวเลขหรืออักขระพิเศษ
                  </small>
                )}
              </label>
              <input
                required
                onChange={handleInput}
                type="text"
                placeholder="กรอกชื่อสมุนไพร(ภาษาไทย)"
                name="name_th"
                className="outline-none border-b-2"
                style={{ padding: "0.5rem" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                ชื่อทางวิทยาศาตร์ :{" "}
                {!engSciName && (
                  <small className="text-[0.8rem] text-red-600">
                    ตัวอักษรภาษาอังกฤษเท่านั้นและห้ามมีตัวเลขหรืออักขระพิเศษ
                  </small>
                )}
              </label>
              <input
                required
                onChange={handleInput}
                type="text"
                placeholder="กรอกชื่อสมุนไพรทางวิทยาศาสตร์(ภาษาอังกฤษ)"
                name="name_science"
                className="outline-none border-b-2"
                style={{ padding: "0.5rem" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                ชื่อสามัญ :
                {!normalEngName && (
                  <small className="text-[0.8rem] text-red-600">
                    ตัวอักษรภาษาอังกฤษเท่านั้นและห้ามมีตัวเลขหรืออักขระพิเศษ
                  </small>
                )}
              </label>
              <input
                required
                onChange={handleInput}
                type="text"
                placeholder="กรอกชื่อสามัญของสมุนไพร(ภาษาอังกฤษ)"
                name="name_normal"
                className="outline-none border-b-2"
                style={{ padding: "0.5rem" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                ลักษณะทางพฤกษศาสตร์ :
              </label>
              <textarea
                required
                onChange={handleInput}
                type="text"
                placeholder="อธิบายลักษณะของสมุนไพร"
                name="herbs_look"
                className="outline-none border-2"
                style={{ padding: "0.5rem" }}
              ></textarea>
            </div>
            <div className="relative flex flex-col gap-2">
              <label
                htmlFor=""
                className="flex items-center gap-2 text-lg text-black"
              >
                หมวดหมู่สมุนไพร :{" "}
                <small className="text-[0.9rem] text-gray-700">
                  (เลือกได้มากกว่า 1 หมวดหมู่)
                </small>
              </label>
              <span
                onClick={() => setActiveSelect(!activeSelect)}
                className="border-2 flex items-center justify-between cursor-pointer transition-all duration-150 hover:bg-green-900 hover:text-white"
                style={{ padding: "0.3rem" }}
              >
                <label htmlFor="">-- เลือกหมวดหมู่ --</label>
                {activeSelect ? <FaTimes /> : <FaCaretDown />}
              </span>
              <span
                className={`${
                  activeSelect ? "opacity-100 z-50" : "opacity-0 z-[-1]"
                } transiton-all duration-300 absolute top-[-8rem] left-0 w-full h-[23vh] flex flex-col border-2 bg-white`}
                style={{ padding: "0.2ren" }}
              >
                <input
                  onChange={searchCtg}
                  type="text"
                  placeholder="ค้นหาหมวดหมู่"
                  className="border-b-2"
                  style={{ padding: "0.3rem" }}
                />
                <span
                  onClick={() => {
                    setSelectCtg([]), fetchCategories();
                  }}
                  className="cursor-pointer rounded-full hover:text-red-600 transition-all duration-200 active:scale-95 absolute top-1 right-1"
                  style={{ padding: "0.2rem" }}
                >
                  <i className="fas fa-rotate-right"></i>
                </span>
                <div className="w-full h-[95%] overflow-hidden overflow-y-auto">
                  {categories.map((item, index) => {
                    return (
                      <option
                        onClick={() =>
                          selectCategories(item.ctg_name, item._id)
                        }
                        key={index}
                        style={{ padding: "0.3rem" }}
                        className="w-full transition-all duration-200 hover:bg-gray-200 cursor-pointer"
                      >
                        {item.ctg_name}
                      </option>
                    );
                  })}
                </div>
              </span>
              <label htmlFor="" className="text-[0.9rem] text-gray-700">
                จำนวนหมวดหมู่ที่เลือก {selectCtg.length} หมวดหมู่
              </label>
              <div
                className="relative overflow-auto overflow-y-hidden w-[540px] h-[8vh]"
                style={{ padding: "0.2rem 0" }}
              >
                <div className="w-auto flex gap-2 absolute top-0 left-0">
                  {
                    new Set(
                      selectCtg.map((item, index) => {
                        return (
                          <label
                            key={index}
                            htmlFor=""
                            className="w-[15rem] bg-gray-300 flex justify-between items-center gap-1 rounded-full"
                            style={{ padding: "0.2rem 0.4rem" }}
                          >
                            {item.name.length < 25
                              ? item.name
                              : item.name.substring(0, 20) + "..."}
                            <FaTimes
                              onClick={() => deleteSelectCtg(item.id)}
                              className="cursor-pointer"
                            />
                          </label>
                        );
                      })
                    )
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="w-[50%] flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                การนำไปใช้:
              </label>
              <textarea
                required
                onChange={handleInput}
                type="text"
                placeholder="ส่วนใหญ่สมุนไพรมักนำไปใช้ทำอะไร?"
                name="usage"
                className="outline-none border-2"
                style={{ padding: "0.5rem" }}
              ></textarea>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                สรรพคุณ :
              </label>
              <textarea
                required
                onChange={handleInput}
                type="text"
                placeholder="อธิบายสรรพคุณหรือประโยชน์"
                name="benefits"
                className="outline-none border-2 h-[15vh]"
                style={{ padding: "0.5rem" }}
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="flex items-center gap-2 text-lg">
                อัปโหลดรูปภาพสมุนไพร
                <span className="text-[0.9rem] text-gray-700">
                  (อัปโหลดได้มากกว่า 1 รูป)
                </span>{" "}
                :
              </label>
              <div className="relative flex w-full gap-8">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  multiple
                  onChange={uploadsFiles}
                  name="files"
                />
                <label
                  htmlFor="file-upload"
                  style={{ padding: "0.3rem" }}
                  className=" transition-all duration-200 hover:bg-[#0c2a1d] hover:text-white cursor-pointer flex gap-3 items-center border-2"
                >
                  <FaFileDownload /> อัปโหลดรูปภาพด้วยไฟล์
                </label>
                <input
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value.trim())}
                  type="text"
                  placeholder="หรืออัปโหลดผ่าน url"
                  name="url"
                  className="border-b-2 outline-none w-[50%]"
                  style={{ padding: "0 0.3rem" }}
                />
                <label
                  style={{ padding: "0.3rem" }}
                  onClick={() => {
                    setImgArr([{ id: uuid(), name: inputUrl }, ...imgArr]),
                      setInputUrl("");
                  }}
                  className={`${
                    inputUrl === "" ? "opacity-0 z-[-1]" : "opacity-100 z-2"
                  }transtion-all duration-200 bg-blue-900 text-white cursor-pointer absolute top-1 right-3`}
                >
                  <FaPlus />
                </label>
              </div>
              <label htmlFor="" style={{ marginTop: "1rem" }}>
                จำนวนรูปภาพที่อัปโหลด {imgArr.length} รูป
              </label>
              <div className="w-[570px] h-[21vh] relative  overflow-auto overflow-y-hidden">
                <div
                  className="absolute w-auto top-0 left-0 flex gap-3"
                  style={{ padding: "1rem" }}
                >
                  {imgArr.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative w-[130px] h-[15vh] bg-gray-400 border"
                      >
                        <label
                          onClick={() => delImg(index, item.id)}
                          style={{ padding: "0.3rem" }}
                          className="cursor-pointer rounded-full absolute top-[-0.8rem] right-[-0.8rem] text-white bg-red-600"
                        >
                          <FaTimes />
                        </label>
                        <img src={item.name} className="w-full h-full" alt="" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end gap-5">
              <button
                type="reset"
                onClick={resetToDefault}
                style={{ padding: "0.5rem" }}
                className="hover:scale-110 flex items-center gap-2 cursor-pointer bg-red-600 text-white"
              >
                รีเซ็ต(ล้างข้อมูล) <i className="fas fa-rotate-right"></i>
              </button>
              <button
                type="submit"
                style={{ padding: "0.5rem 2.5rem" }}
                className="hover:scale-110 flex items-center gap-2 cursor-pointer bg-green-700 text-white"
              >
                <FaPlus />
                เพิ่มสมุนไพรใหม่
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHerb;
