import React, { useEffect, useState } from "react";
import { FaImage, FaNewspaper, FaPlus, FaTimes } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminLoading from "../../../layout/admin/adminloading";
import { getHerbs } from "../../../function/herbs";
import { v4 as uuid } from "uuid";
import { addNews } from "../../../function/news";

const AddNews = ({ onclose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [herbsId, setHerbIds] = useState([]);
  const [originalHerbs, setOriginalHerbs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [herbs, setHerbs] = useState([]);
  const [previewMain, setPreviewMain] = useState("");
  const [filesInput, setFilesInput] = useState([]);
  const [otherImgs, setOtherImgs] = useState([]);
  const [mainImgFile,setMainImgFile] = useState({});

  const fetchHerb = () => {
    getHerbs().then((res) => {
      if (!res?.data) return;
      setOriginalHerbs(res?.data?.herbs);
      setHerbs(res?.data?.herbs);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchHerb();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchHerbs = (e) => {
    const value = e.target.value;

    if (value.length < 1 || value === "") {
      setHerbs(
        originalHerbs.filter(
          (item) => !herbsId.map((item) => item.id).includes(item._id)
        )
      );
    } else {
      setHerbs((prev) =>
        prev
          .filter((item) => !herbsId.includes(item._id))
          .filter((item) => item.name_th.includes(value))
      );
    }
  };

  const selectHerb = (id, name) => {
    setHerbIds((prev) => [{ id, name }, ...prev]);
    const newHerbs = originalHerbs.filter((item) => item._id !== id);
    setHerbs(newHerbs);
  };

  const deleteHerbId = async (id) => {
    setHerbIds((prev) => prev.filter((item) => item.id !== id));
    const newHerbs = originalHerbs.filter((item) => item._id === id);
    setHerbs((prev) => [...newHerbs, ...prev]);
  };

  const uploadMainImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = uuid();
        setPreviewMain({ id, src: e.target.result,file:file });
        setMainImgFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const addOtherImgs = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10)
      return Swal.fire(
        "แจ้งเตือน",
        "ไม่สามารถอัปโหลดได้มากกว่า 10 รูปภาพ",
        "error"
      );
    const newFile = files.map((f) => {
      const id = uuid();
      return {
        imgObj: { id, src: URL.createObjectURL(f) },
        fileObj: { id, file: f },
      };
    });
    const filePreview = newFile.map((f) => f.imgObj);
    const fileObj = newFile.map((f) => f.fileObj);

    setOtherImgs((prev) => [...filePreview, ...prev]);
    setFilesInput((prev) => [...fileObj, ...prev]);
  };

  const deleteOtherImgs = (id) => {
    setFilesInput((prev) => prev.filter((item) => item.id !== id));
    setOtherImgs((prev) => prev.filter((item) => item.id !== id));
  };

  const sendAddNews = async () => {
    if (title === "" || title.trim().length < 15)
      return Swal.fire(
        "แจ้งเตือน",
        "พาดขัวข่าวต้องมากกว่า 15 ตัวอักษร",
        "error"
      );

    const plainText = content.replace(/<[^>]+>/g, "").trim();
    if (plainText.length < 30)
      return Swal.fire(
        "แจ้งเตือน",
        "เนื้อหาข่าวต้องมีมากกว่า 30 ตัวอักษร",
        "error"
      );

    if (previewMain === "")
      return Swal.fire("แจ้งเตือน", "กรุณาอัปโหลดภาพพาดหัวข่าว", "error");
    if (otherImgs.length < 3)
      return Swal.fire(
        "แจ้งเตือน",
        "ต้องมีรูปภาพข่าวเพิ่มเติมอย่างน้อย 3 รูปภาพ",
        "error"
      );

    if (herbsId.length < 1)
      return Swal.fire(
        "แจ้งเตือน",
        "โปรดระบุสมุนไพรที่เกี่ยวข้องอย่างน้อย 1 สมุนไพร",
        "error"
      );

    const { isConfirmed } = await Swal.fire({
      title: "แจ้งเตือน",
      text: "ต้องการโพสต์ข่าวนี้หรือไม่?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "โพสต์ข่าว",
    });
    if (!isConfirmed) return;

    // เข้ารหัสไฟล์
    const files = [,mainImgFile,...filesInput.map((item) => item.file)];
    let sendForm = {
      title,
      content,
      herbsId: herbsId.map((item) => item.id),
    };
    const formEncyp = new FormData();
    for (const key in sendForm) {
      formEncyp.append(key, sendForm[key]);
    }
    for (let i = 0; i < files.length; i++) {
      formEncyp.append("images", files[i]);
    }
    setIsLoading(true);
    try {
      const req = await addNews(formEncyp);
      if (req?.data?.err)
        return Swal.fire("แจ้งเตือน", req?.data?.err, "error");

      Swal.fire("สำเร็จ", req?.data?.mes, "success");
      setTitle("");
      setContent("");
      setFilesInput([]);
      setPreviewMain("");
      setHerbIds([]);
      setOtherImgs([]);
      onclose();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "เกิดข้อผิดลาด",
        "ไม่สาารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <AdminLoading />}
      <div
        className="overflow-auto z-50 w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center"
        style={{ padding: "2rem 0" }}
      >
        <div
          className="relative flex flex-col gap-10 bg-white border w-[45%] h-auto overflow-auto rounded-lg"
          style={{ padding: "2rem", marginTop: "65rem" }}
        >
          <button
            onClick={onclose}
            className="absolute top-2 right-2 rounded-full hover:bg-red-500 hover:text-white cursor-pointer"
            style={{ padding: "0.3rem" }}
          >
            <FaTimes />
          </button>
          <div className="w-full items-center flex flex-col gap-1">
            <label
              htmlFor=""
              className="text-2xl flex items-center gap-2 font-bold"
            >
              <FaNewspaper /> เพิ่มข่าวใหม่
            </label>
            <label htmlFor="" className="text-[0.9rem] text-gray-700">
              เพิ่มข่าวสารที่เกี่ยวกับสมุนไพร
            </label>
          </div>

          <div
            style={{ marginTop: "0.5rem" }}
            className="w-full flex flex-col gap-3"
          >
            <label htmlFor="" className="border-b text-lg font-bold">
              พาดหัวข่าว
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.trim())}
              type="text"
              placeholder="พาดหัวข่าวให้น่าสนใจ"
              className="outline-none w-full border rounded-lg focus:ring-2 focus:ring-[#050a44]"
              style={{ padding: "0.5rem" }}
              name=""
              id=""
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <label htmlFor="" className="border-b text-lg font-bold">
              เนื้อหา/รายละเอียดของข่าว{" "}
              <small className="font-normal text-[0.8rem] text-gray-700">
                (สามารถวางรูปภาพได้)
              </small>
            </label>
            <ReactQuill
              value={content}
              onChange={(e) => setContent(e)}
              className="w-full h-[30vh]"
              theme="snow"
              placeholder="เนื้อหาข่าว(สามารถจัดการตัวอักษรเล็กใหญ่ หนาบาง และใส่ลิงค์ได้ ผ่านเมนูด้านบน)..."
            />
          </div>
          <div
            style={{ marginTop: "2.5rem" }}
            className="w-full flex flex-col gap-3"
          >
            <label
              htmlFor=""
              className="w-full flex items-center justify-between border-b text-lg font-bold"
            >
              ภาพพาดหัวข่าว
              <span
                className={`${
                  previewMain !== "" ? "z-10 visible" : "z-[-1] unvisible"
                }`}
                style={{ paddingBottom: "0.5rem" }}
              >
                <input
                  onChange={uploadMainImg}
                  type="file"
                  className="hidden"
                  id="change-main"
                />
                <label
                  className="flex items-center gap-1 font-normal text-[0.9rem] hover:text-white rounded-lg cursor-pointer hover:bg-[#050a44] transition-all duration-200"
                  style={{ padding: "0.3rem 0.5rem" }}
                  htmlFor="change-main"
                >
                  <FaImage /> เปลี่ยนรูป
                </label>
              </span>
            </label>
            <div className="relative w-full h-[40vh] border">
              <div
                className={`${
                  previewMain === "" ? "z-10 visible" : "z-[-1] unvisible"
                } absolute top-0 left-0 w-full h-full`}
              >
                <input
                  onChange={uploadMainImg}
                  type="file"
                  className="hidden"
                  id="main-img"
                />
                <label
                  htmlFor="main-img"
                  className="text-xl gap-3 absolute top-0 left-0 w-full h-full cursor-pointer flex items-center justify-center"
                >
                  <FaImage /> อัปโหลดรูปภาพ
                </label>
              </div>
              <div
                className={`${
                  previewMain === " " ? "z-[-1] unvisible" : "z-10 visible"
                }absolute top-0 left-0 w-full h-full`}
              >
                <img
                  src={previewMain?.src}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <label
              htmlFor=""
              className="w-full flex items-center justify-between border-b text-lg font-bold"
            >
              รูปภาพข่าวเพิ่มเติม
              <span className={``} style={{ paddingBottom: "0.5rem" }}>
                <input
                  onChange={addOtherImgs}
                  multiple
                  type="file"
                  className="hidden"
                  id="add-other"
                />
                <label
                  className="flex items-center gap-1 font-normal text-[0.9rem] text-white rounded-lg cursor-pointer bg-[#050a44] transition-all duration-200"
                  style={{ padding: "0.3rem 0.5rem" }}
                  htmlFor="add-other"
                >
                  <FaPlus /> อัปโหลด
                </label>
              </span>
            </label>
            <div className="w-full h-[20vh] overflow-auto relative">
              <div
                style={{ paddingBottom: "0.5rem" }}
                className="w-auto h-full flex items-end gap-3 absolute top-0 left-0"
              >
                {otherImgs.length > 0 ? (
                  otherImgs?.map((item) => {
                    return (
                      <div
                        key={item?.id}
                        className="w-[8vw] h-[15vh] relative border"
                      >
                        <button
                          onClick={() => deleteOtherImgs(item?.id)}
                          className="absolute top-[-0.8rem] right-[-0.8rem] rounded-full bg-red-600 text-white cursor-pointer"
                          style={{ padding: "0.2rem" }}
                        >
                          <FaTimes />
                        </button>
                        <img
                          src={item?.src}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                    );
                  })
                ) : (
                  <label
                    htmlFor=""
                    className="text-gray-700"
                    style={{ marginBottom: "5rem" }}
                  >
                    ยังไม่มีรูปภาพเพิ่ม
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <label htmlFor="" className="border-b text-lg font-bold">
              ข่าวนี้เกี่ยวข้องกับสมุนไพรใดบ้าง
            </label>
            <div className="relative w-full flex flex-col h-[35vh] border overflow-auto">
              <input
                onChange={searchHerbs}
                type="text"
                placeholder="พิมพ์ค้นหาสมุนไพร"
                className="sticky top-0 z-20 bg-white text-[0.9rem] outline-none w-full border-b focus:ring-2 focus:ring-[#050a44]"
                style={{ padding: "0.35rem" }}
                name=""
                id=""
              />
              {herbs.length > 0 ? (
                herbs.map((item) => {
                  return (
                    <button
                      onClick={() => selectHerb(item._id, item.name_th)}
                      key={item._id}
                      value={item._id}
                      style={{ padding: "0.5rem" }}
                      className="w-full text-left cursor-pointer hover:bg-gray-200"
                    >
                      {item.name_th}
                    </button>
                  );
                })
              ) : (
                <label
                  htmlFor=""
                  className="text-xl text-gray-700 absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
                >
                  {herbsId.length > 0
                    ? "สมุนไพรอาจถูกเลือกแล้ว"
                    : "ไม่พบสมุนไพร"}
                </label>
              )}
            </div>
            <div className="w-full relative overflow-auto h-[8vh]">
              <div className="absolute top-0 left-0 w-auto h-full flex gap-3">
                {herbsId?.map((item) => {
                  return (
                    <label
                      key={item.id}
                      style={{ padding: "0 0.5rem" }}
                      htmlFor=""
                      className="w-[8vw] h-[5vh] flex items-center justify-between bg-gray-200 rounded-lg cursor-pointer"
                    >
                      {item.name}{" "}
                      <FaTimes onClick={() => deleteHerbId(item.id)} />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            onClick={sendAddNews}
            className="text-lg text-white bg-blue-900 cursor-pointer rounded-md hover:bg-[#050a44]"
            style={{ padding: "0.8rem" }}
          >
            บันทึกข่าวใหม่
          </button>
        </div>
      </div>
    </>
  );
};

export default AddNews;
