import React, { useEffect, useState } from "react";
import { FaImage, FaPencilAlt, FaPlus, FaTimes } from "react-icons/fa";
import ReactQuill from "react-quill";
import { getHerbs } from "../../../function/herbs";
import { updateNews } from "../../../function/news";
import AdminLoading from "../../../layout/admin/adminloading";

const EditNews = ({ news, onclose, fetchNews }) => {
  const [gettitle, setTitle] = useState(news?.title);
  const [content, setContent] = useState(news?.content);
  const [herbsId, setHerbIds] = useState(news?.herbs_id);
  const [originalHerbs, setOriginalHerbs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [herbs, setHerbs] = useState([]);
  const [previewMain, setPreviewMain] = useState(news?.img_url[0]);
  const [filesInput, setFilesInput] = useState([]);
  const [otherImgs, setOtherImgs] = useState(
    news?.img_url?.filter((item, index) => index > 0)
  );
  const [mainFile, setMainFile] = useState({});
  const [deleteImgs, setDeleteImg] = useState([]);

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

  const uploadMainImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewMain(e.target.result);
        setMainFile(file);
        setFilesInput((prev) => [file, ...prev]);
        setDeleteImg((prev) =>
          previewMain.startsWith("i") ? [previewMain, ...prev] : prev
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadOtherImg = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10)
      return Swal.fire(
        "แจ้งเตือน",
        "ไม่สามารถอัปโหลดได้มากกว่า 10 รูปภาพ",
        "error"
      );
    if (files) {
      files.forEach((item) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setOtherImgs((prev) => [e.target.result, ...prev]);
          setFilesInput((prev) => [...prev, item]);
        };
        reader.readAsDataURL(item);
      });
    }
  };

  const deleteOtherImgs = async (num, src) => {
    setOtherImgs((prev) => prev.filter((item, index) => index !== num));
    setDeleteImg((prev) => [...prev, src]);
  };

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

  const selectHerb = (id) => {
    setHerbIds((prev) => [id, ...prev]);
  };

  const deleteHerbId = (id) => {
    setHerbIds((prev) => prev.filter((item) => item !== id));
  };

  const sendUpdateNews = async () => {
    if (gettitle === "" || gettitle.trim().length < 15)
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
      text: "ต้องการบันทึกข้อมูลหรือไม่?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "บันทึก",
    });
    if (!isConfirmed) return;

    // ลบไฟล์ที่ไม่ตรงกับ otherImgs
    const filterFiles = await Promise.all(
      filesInput.map(async (item, index) => {
        const url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(item);
        });
        return { file: item, keep: otherImgs.includes(url) };
      })
    );
    const updateSendFile =
      previewMain !== news?.img_url[0]
        ? [
            mainFile,
            ...filterFiles.filter((item) => item.keep).map((item) => item.file),
          ]
        : filterFiles.filter((item) => item.keep).map((item) => item.file);
    const oldImgs =
      previewMain !== news?.img_url[0]
        ? otherImgs.filter((item) => item.startsWith("i"))
        : [
            news?.img_url[0],
            ...otherImgs.filter((item) => item.startsWith("i")),
          ];
    let data = {
      herbsId,
      delImgs: deleteImgs.filter((item) => item.startsWith("i")),
      oldImgs,
      ...news,
    };
    const formEncryp = new FormData();
    for (const key in data) {
      formEncryp.append(key, data[key]);
    }
    for (let i = 0; i < updateSendFile.length; i++) {
      formEncryp.append("images", updateSendFile[i]);
    }
    formEncryp.append("title", gettitle);
    formEncryp.append("content", content);
    setIsLoading(true);
    try {
      const update = await updateNews(formEncryp);
      if (update?.data?.err)
        return Swal.fire("เกิดข้อผิดพลาด", update?.data?.err, "error");

      await Swal.fire("สำเร็จ", update?.data?.mes, "success");
      await fetchNews();
      onclose();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="overflow-auto z-50 w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center"
      style={{ padding: "2rem 0" }}
    >
      {isLoading && <AdminLoading />}
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
            <FaPencilAlt />
            แก้ไขข่าว
          </label>
        </div>

        <div
          style={{ marginTop: "0.5rem" }}
          className="w-full flex flex-col gap-3"
        >
          <label htmlFor="" className="border-b text-lg font-bold">
            แก้ไขพาดหัวข่าว
          </label>
          <input
            value={gettitle}
            onChange={(e) => setTitle(e.target.value)}
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
            แก้เนื้อหา/รายละเอียดของข่าว{" "}
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
            <div className={`absolute top-0 left-0 w-full h-full`}>
              <img
                src={
                  previewMain?.startsWith("i")
                    ? `${import.meta.env.VITE_IMG_URL}${previewMain}`
                    : previewMain
                }
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
                onChange={uploadOtherImg}
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
                otherImgs?.map((item, index) => {
                  return (
                    <div
                      key={item?.id}
                      className="w-[8vw] h-[15vh] relative border"
                    >
                      <button
                        onClick={() => deleteOtherImgs(index, item)}
                        className="absolute top-[-0.8rem] right-[-0.8rem] rounded-full bg-red-600 text-white cursor-pointer"
                        style={{ padding: "0.2rem" }}
                      >
                        <FaTimes />
                      </button>
                      <img
                        src={
                          item?.startsWith("i")
                            ? `${import.meta.env.VITE_IMG_URL}${item}`
                            : item
                        }
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
              herbs
                ?.filter((item) => !herbsId.includes(item._id))
                .map((item) => {
                  return (
                    <button
                      onClick={() => selectHerb(item._id, item.name_th)}
                      key={item?._id}
                      value={item?._id}
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
                {herbsId.length > 0 ? "สมุนไพรอาจถูกเลือกแล้ว" : "ไม่พบสมุนไพร"}
              </label>
            )}
          </div>
          <div className="w-full relative overflow-auto h-[8vh]">
            <div className="absolute top-0 left-0 w-auto h-full flex gap-3">
              {herbs
                ?.filter((item) => herbsId.includes(item._id))
                .map((item) => {
                  return (
                    <label
                      key={item?._id}
                      style={{ padding: "0 0.5rem" }}
                      htmlFor=""
                      className="w-[8vw] h-[5vh] flex items-center justify-between bg-gray-200 rounded-lg cursor-pointer"
                    >
                      {item?.name_th}{" "}
                      <FaTimes onClick={() => deleteHerbId(item._id)} />
                    </label>
                  );
                })}
            </div>
          </div>
        </div>
        <button
          onClick={sendUpdateNews}
          className="text-lg text-white bg-blue-900 cursor-pointer rounded-md hover:bg-[#050a44]"
          style={{ padding: "0.8rem" }}
        >
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
};

export default EditNews;
