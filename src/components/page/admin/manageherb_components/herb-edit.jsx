import { useEffect, useState } from "react";
import AdminLoading from "../../../layout/admin/adminloading";
import {
  FaCaretDown,
  FaFileDownload,
  FaPencilAlt,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { getAllCategories } from "../../../function/category";
import { updateHerb } from "../../../function/herbs";

const HerbEdit = ({ herb, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNameTh, setIsNameTh] = useState(true);
  const [engSciName, setEngSciName] = useState(true);
  const [normalEngName, setNormalEngName] = useState(true);
  const [originalCtg, setOriginalCtg] = useState([]);
  const [categories, setCateories] = useState([]);
  const [newHerb, setNewHerb] = useState(herb);
  const [activeSelect, setActiveSelect] = useState(false);
  const [selectCtg, setSelectCtg] = useState([]);
  const [imgArr, setImgArr] = useState(herb?.imgs);
  const [inputUrl, setInputUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [oldImgs, setOldImgs] = useState([]);

  function isOnlyThaiOrEnglish(input) {
    const thaiRegex = /^[ก-๙]+$/; // ภาษาไทยล้วน (ห้ามมีช่องว่าง, ตัวเลข หรืออักขระพิเศษ)
    const englishRegex = /^[a-zA-Z]+$/; // ภาษาอังกฤษล้วน (ห้ามมีช่องว่าง, ตัวเลข หรืออักขระพิเศษ)

    return { isTH: thaiRegex.test(input), isEn: englishRegex.test(input) };
  }

  const fetchCategories = () => {
    setIsLoading(true);
    try {
      getAllCategories().then((res) => {
        if (!res?.data) return;
        setCateories(res?.data?.categories);
        setOriginalCtg(res?.data?.categories);

        setSelectCtg([
          ...herb?.categories
            .map((ctg) => [
              ...res?.data?.categories.filter((real) => real._id === ctg),
            ])
            .flat(),
        ]);
        setCateories(
          res?.data?.categories.filter(
            (ctg) => !herb?.categories.includes(ctg._id)
          )
        );
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

  const searchCtg = (e) => {
    const value = e.target.value.trim();

    if (value.length < 1) {
      setCateories(
        originalCtg.filter(
          (ctg) => !selectCtg.map((item) => item._id).includes(ctg._id)
        )
      );
    } else {
      setCateories((prev) =>
        prev.filter((ctg) => {
          return (
            ctg.ctg_name.includes(value) || ctg.ctg_description.includes(value)
          );
        })
      );
    }
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value.trim();
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
        const { isEn: normal_en } = isOnlyThaiOrEnglish(value);
        if (!normal_en) {
          setNormalEngName(false);
        } else {
          setNormalEngName(true);
        }
        break;
      default:
        break;
    }
    setNewHerb({ ...newHerb, [name]: value });
  };

  const addSelectCtg = (ctg) => {
    const newSelect = [ctg, ...selectCtg];
    setSelectCtg(newSelect);
    setCateories(
      originalCtg.filter(
        (ctg) => !newSelect.map((item) => item._id).includes(ctg._id)
      )
    );
  };

  const deleteSelectCtg = (id) => {
    const newSelect = selectCtg.filter((ctg) => ctg._id !== id);
    setSelectCtg(newSelect);
    setCateories(
      originalCtg.filter(
        (ctg) => !newSelect.map((item) => item._id).includes(ctg._id)
      )
    );
  };

  const delImg = (num, item) => {
    setImgArr((prev) => prev.filter((item, index) => index !== num));
    setOldImgs((prev) => (item.startsWith("i") ? [...prev, item] : [...prev]));
  };

  const imgFilesInput = (e) => {
    const thisfiles = Array.from(e.target.files);
    thisfiles.forEach((item) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImgArr((prev) => [e.target.result, ...prev]);
      };
      reader.readAsDataURL(item);
    });
    setFiles((prev) => [...thisfiles, ...prev]);
  };

  const sendUpdate = async (e) => {
    e.preventDefault();
    if (!isNameTh || !engSciName || !normalEngName)
      return Swal.fire("เกิดข้อผิดพลาด", "รูปแบบข้อมูลไม่ถูกต้อง", "error");

    if (
      newHerb.herbs_look.length < 25 ||
      newHerb.usage.length < 25 ||
      newHerb.benefits.length < 25
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
      text: "ต้องการบันทึกการแก้ไขสมุนไพรนี้หรือไม่?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "บันทึก",
    });
    if (!isConfirmed) return;

    let { imgs, categories, ...final } = newHerb;
    final.oldimgs = oldImgs;
    final.imgs = imgArr.filter((item) => !item.startsWith("d"));
    final.categories = selectCtg.map((item) => item._id);

    let sendForm;
    if (files.length > 0) {
      const fileForArr = imgArr.filter((item) => item.startsWith("d"));
      const filteredFiles = await Promise.all(
        files.map(async (item) => {
          const url = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(item);
          });

          return { file: item, keep: fileForArr.includes(url) };
        })
      );
      const newFile = filteredFiles
        .filter((item) => item.keep)
        .map((item) => item.file);

      const formEncryp = new FormData();
      for (let i = 0; i < newFile.length; i++) {
        formEncryp.append("images", newFile[i]);
      }
      for (const key in final) {
        formEncryp.append(key, final[key]);
      }
      sendForm = formEncryp;
    } else {
      sendForm = final;
    }
    setIsLoading(true);
    try {
      const req = await updateHerb(sendForm);
      if (req?.data?.err)
        return Swal.fire("เกิดข้อผิดพลาด", req?.data?.err, "error");

      await Swal.fire("สำเร็จ", req?.data?.mes, "success");
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "server ไม่ตอบสนอง", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAllValues = () => {
    setNewHerb({ name_th: "", name_normal: "", name_science: "",herbs_look:"",usage:"",benefits:"" });
    setFiles([]);
    setImgArr([]);
    setInputUrl("");
    setSelectCtg([]);
    setCateories(originalCtg);
  };

  return (
    <div
      className={`transition-all duration-300 absolute top-0 left-0 w-full h-full bg-white flex z-50`}
      style={{ padding: "0rem" }}
    >
      {isLoading && <AdminLoading />}
      <form
        onSubmit={sendUpdate}
        encType="multipart/form-data"
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
            <FaPencilAlt className="text-green-600" /> แก้ไขข้อมูลสมุนไพร
          </label>
          <label
            htmlFor=""
            style={{ marginLeft: "2.5rem" }}
            className="font-bold text-green-950 text-[0.85rem]"
          >
            Edit's herb
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
                value={newHerb?.name_th}
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
                value={newHerb?.name_science}
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
                value={newHerb?.name_normal}
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
                value={newHerb?.herbs_look}
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
                <label htmlFor="">-- แก้ไขหมวดหมู่ --</label>
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
                    setSelectCtg([]),
                      setCateories(
                        originalCtg.filter(
                          (ctg) =>
                            !selectCtg.map((item) => item._id).includes(ctg._id)
                        )
                      );
                  }}
                  className="cursor-pointer rounded-full hover:text-red-600 transition-all duration-200 active:scale-95 absolute top-1 right-1"
                  style={{ padding: "0.2rem" }}
                >
                  <i className="fas fa-rotate-right"></i>
                </span>
                <div className="relative w-full h-[95%] overflow-hidden overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((item, index) => {
                      return (
                        <option
                          onClick={() => addSelectCtg(item)}
                          key={index}
                          style={{ padding: "0.3rem" }}
                          className="w-full transition-all duration-200 hover:bg-gray-200 cursor-pointer"
                        >
                          {item.ctg_name}
                        </option>
                      );
                    })
                  ) : (
                    <label className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-lg text-gray-500">
                      {selectCtg.length > 0
                        ? "ไม่มีหมวดหมู่เหลืออยู่"
                        : "ไม่มีหมวดหมู่ในระบบ"}
                    </label>
                  )}
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
                  {selectCtg.map((item, index) => {
                    return (
                      <label
                        key={index}
                        htmlFor=""
                        className="w-[15rem] bg-gray-300 flex justify-between items-center gap-1 rounded-full"
                        style={{ padding: "0.2rem 0.4rem" }}
                      >
                        {item.ctg_name.length < 25
                          ? item.ctg_name
                          : item.ctg_name.substring(0, 20) + "..."}
                        <FaTimes
                          onClick={() => deleteSelectCtg(item._id)}
                          className="cursor-pointer"
                        />
                      </label>
                    );
                  })}
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
                value={newHerb?.usage}
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
                value={newHerb?.benefits}
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
                  onChange={imgFilesInput}
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
                  onChange={(e) => setInputUrl(e.target.value)}
                  type="text"
                  placeholder="หรืออัปโหลดผ่าน url"
                  name="url"
                  className="border-b-2 outline-none w-[50%]"
                  style={{ padding: "0 0.3rem" }}
                />
                <label
                  style={{ padding: "0.3rem" }}
                  onClick={() => {
                    setImgArr([inputUrl, ...imgArr]), setInputUrl("");
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
                          onClick={() => delImg(index, item)}
                          style={{ padding: "0.3rem" }}
                          className="cursor-pointer rounded-full absolute top-[-0.8rem] right-[-0.8rem] text-white bg-red-600"
                        >
                          <FaTimes />
                        </label>
                        <img
                          src={
                            item.startsWith("i")
                              ? `${import.meta.env.VITE_IMG_URL}${item}`
                              : item
                          }
                          className="w-full h-full"
                          alt=""
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end gap-5">
              <button
                type="reset"
                onClick={resetAllValues}
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
                <FaSave />
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default HerbEdit;
