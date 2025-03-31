import { useEffect, useState } from "react";
import {
  FaCheck,
  FaListUl,
  FaPencilAlt,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import AdminLoading from "../../../layout/admin/adminloading";
import {
  addCategory,
  deleteCtg,
  getAllCategories,
  updateCtg,
} from "../../../function/category";

const AddCategory = ({ active, onClose }) => {
  const [originCategories, setOriginCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ctgForm, setCtgForm] = useState({ ctg_name: "", ctg_description: "" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [editCtg, setEditCtg] = useState({ change_name: "", change_des: "" });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAllCategories();
      if (!res.data.categories) return;

      setCategories(res?.data?.categories);
      setOriginCategories(res?.data?.categories);
    } catch (error) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถทำรายการได้", "error");
    } finally {
      setIsLoading(false);
    }
  };
  // โหลดข้อมูลหมวดหมู่ตอนเริ่มต้น
  useEffect(() => {
    fetchCategories();
  }, []);

  // input new category
  const inputNew = (e) => {
    setCtgForm({ ...ctgForm, [e.target.name]: e.target.value.trim() });
  };
  // add new ctg
  const addNewCtg = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await addCategory(ctgForm);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
      setCtgForm({ ctg_name: "", ctg_description: "" });
      fetchCategories();
    } catch (err) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มหมวดหมู่ได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // search
  const searchTyping = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setCategories(originCategories);
    } else {
      setCategories(
        originCategories.filter((item) => {
          return (
            item.ctg_name.includes(value) ||
            item.ctg_description.includes(value) ||
            new Date(item.createdAt)
              .toLocaleDateString("th-TH")
              .includes(value) ||
            item._id.toString().includes(value) ||
            new Date(item.updatedAt).toLocaleDateString("th-TH").includes(value)
          );
        })
      );
    }
  };

  // input edit
  const inputEdit = (e) => {
    setEditCtg({ ...editCtg, [e.target.name]: e.target.value.trim() });
  };

  // active edit
  const activeEdit = (id, index) => {
    const data = originCategories.filter((item) => item._id === id);
    setEditCtg({
      change_name: data[0].ctg_name,
      change_des: data[0].ctg_description,
    });
    setActiveIndex((prev) => (prev === index ? 0 : index));
  };

  // updateCategory
  const updateCategory = async (id) => {
    setIsLoading(true);
    try {
      const data = {
        _id: id,
        change_name: editCtg.change_name,
        change_des: editCtg.change_des,
      };
      const res = await updateCtg(data);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
      setEditCtg({});
      setActiveIndex(0);
      fetchCategories();
    } catch (err) {
      console.error(err);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // delete category
  const deleteCategory = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "แจ้งเตือน",
      text: "ต้องการลบหมวดหมู่นี้หรือไม่?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "ลบหมวดหมู่",
      denyButtonText: "ยกเลิก",
    });
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      const res = await deleteCtg(id);
      if (res.data.err)
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");

      await Swal.fire("สำเร็จ", res.data.mes, "success");
      fetchCategories();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`${
        active
          ? "z-60 visible translate-y-0 opacity-100"
          : "opacity-0 translate-y-[-80rem] invisble z-[-1]"
      }transition-all duration-400 absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.9)] flex`}
    >
      {isLoading && <AdminLoading />}
      <div
        className="bg-white relative w-full h-full flex justify-between"
        style={{ padding: "2rem" }}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-2 text-xl hover:bg-red-600 hover:text-white cursor-poniter"
          style={{ padding: "0.3rem 0.5rem" }}
        >
          <FaTimes />
        </button>
        <div
          className="w-[39%] flex flex-col gap-10"
          style={{ paddingRight: "5rem" }}
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor=""
              className="flex items-center gap-4 text-3xl font-bold"
            >
              <FaListUl className="text-green-800" /> จัดการหมวดหมู่สมุนไพร
            </label>
            <label
              htmlFor=""
              style={{ marginLeft: "3rem" }}
              className="text-[0.9rem]"
            >
              Herbs's Categories Management
            </label>
          </div>
          <form onSubmit={addNewCtg} className="w-full flex flex-col">
            <label
              htmlFor=""
              style={{ paddingBottom: "0.5rem" }}
              className="text-2xl border-b-4 border-green-900"
            >
              เพิ่มหมวดหมู่สมุนไพร
            </label>
            <input
              value={ctgForm.ctg_name}
              onChange={inputNew}
              style={{ padding: "0.5rem", marginTop: "2rem" }}
              className="bg-white outline-none border-2"
              type="text"
              name="ctg_name"
              id=""
              placeholder="ชื่อหมวดหมู่สมุนไพร"
            />
            <textarea
              value={ctgForm.ctg_description}
              onChange={inputNew}
              name="ctg_description"
              id=""
              className="bg-white w-full outline-none border-2 h-[38vh] resize-none"
              style={{ padding: "0.5rem", marginTop: "2rem" }}
              placeholder="คำอธิบายหมวดหมู่สมุนไพร"
            ></textarea>
            <button
              disabled={
                ctgForm.ctg_name !== "" || ctgForm.ctg_description !== ""
                  ? false
                  : true
              }
              style={{ padding: "0.8rem", marginTop: "2rem" }}
              className={`cursor-pointer text-xl text-white ${
                ctgForm.ctg_name !== "" && ctgForm.ctg_description !== ""
                  ? "bg-green-800"
                  : "bg-gray-400"
              }`}
            >
              เพิ่ม
            </button>
          </form>
        </div>

        {/* table */}
        <div
          style={{ paddingTop: "3rem" }}
          className="relative w-[61%] h-full flex flex-col gap-5 items-end"
        >
          <div className="w-full flex justify-between items-end">
            <label htmlFor="" className="font-bold">
              พบหมวดหมู่ในระบบ {categories.length} หมวดหมู่
            </label>
            <div
              style={{ padding: "0.5rem 1rem" }}
              className="w-[60%] border-2 border-green-700 flex items-center gap-3 bg-white"
            >
              <FaSearch className="text-green-900 text-xl" />
              <input
                onChange={searchTyping}
                type="text"
                name="search"
                className="outline-none w-full"
                id=""
                placeholder="พิมพ์ค้นหาหมวดหมู่"
              />
            </div>
          </div>
          <div className="w-full h-[70vh] overflow-auto border-b-4">
            <table className="w-full bg-white">
              <thead className="sticky top-0 z-10 text-white bg-green-950 text-[0.9rem]">
                <tr>
                  <th style={{ padding: "0.5rem" }}>รหัส</th>
                  <th>หมวดหมู่สมุนไพร</th>
                  <th>คำอธิบาย</th>
                  <th>วันที่เพิ่ม</th>
                  <th>แก้ไขล่าสุด</th>
                  <th>แอคชั่น</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories
                    .slice()
                    .reverse()
                    .map((item, index) => {
                      return (
                        <tr
                          key={item?._id}
                          className={`${
                            activeIndex === index + 1
                              ? "bg-orange-200 hover:bg-orange-200"
                              : "hover:bg-gray-100"
                          }relative text-[0.9rem] transition-all duration-150 `}
                        >
                          <td
                            className="border border-gray-400 text-center"
                            style={{ padding: "0.3rem" }}
                          >
                            {index + 1}
                          </td>
                          <td
                            className="border border-gray-400"
                            style={{ padding: "0.3rem 0.5rem" }}
                          >
                            {activeIndex === index + 1 ? (
                              <textarea
                                value={editCtg.change_name}
                                disabled={activeIndex !== index + 1}
                                type="text"
                                name="change_name"
                                onChange={inputEdit}
                                className={`break-words w-[11rem] ${
                                  activeIndex === index + 1
                                    ? "border-2 bg-white"
                                    : ""
                                } h-auto outline-none resize-none`}
                                style={{ padding: "0.3rem" }}
                              ></textarea>
                            ) : (
                              item.ctg_name
                            )}
                          </td>
                          <td
                            className="border border-gray-400"
                            style={{ padding: "0.3rem 0.5rem" }}
                          >
                            {activeIndex === index + 1 ? (
                              <textarea
                                value={editCtg.change_des}
                                disabled={activeIndex !== index + 1}
                                type="text"
                                name="change_des"
                                onChange={inputEdit}
                                className={`break-words w-[11rem] ${
                                  activeIndex === index + 1
                                    ? "border-2 bg-white"
                                    : ""
                                } h-auto outline-none resize-none`}
                                style={{ padding: "0.3rem" }}
                              ></textarea>
                            ) : (
                              item.ctg_description
                            )}
                          </td>
                          <td
                            className="border border-gray-400"
                            style={{ padding: "0.3rem 0.5rem" }}
                          >
                            {new Date(item?.createdAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </td>
                          <td
                            className="border border-gray-400"
                            style={{ padding: "0.3rem 0.5rem" }}
                          >
                            {new Date(item?.updatedAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </td>
                          <td
                            className="border border-gray-400"
                            style={{ padding: "0.3rem 0.5rem" }}
                          >
                            <div className="flex flex-col gap-1">
                              <button>
                                {activeIndex === index + 1 ? (
                                  <FaCheck
                                    onClick={() => updateCategory(item?._id)}
                                    className={`text-3xl bg-white hover:text-white hover:bg-green-600 cursor-pointer shadow border border-gray-300 flex justify-center `}
                                    style={{ padding: "0.3rem" }}
                                  />
                                ) : (
                                  <FaPencilAlt
                                    className={`text-3xl bg-white hover:text-white hover:bg-yellow-600 cursor-pointer shadow border border-gray-300 flex justify-center`}
                                    style={{ padding: "0.3rem" }}
                                    onClick={() =>
                                      activeEdit(item?._id, index + 1)
                                    }
                                  />
                                )}
                              </button>
                              <button
                                className="bg-white hover:text-white hover:bg-red-600 cursor-pointer shadow border border-gray-300 flex justify-center text-lg"
                                style={{ padding: "0.3rem" }}
                              >
                                {activeIndex === index + 1 ? (
                                  <FaTimes
                                    onClick={() => {
                                      setActiveIndex(0), setEditCtg({});
                                    }}
                                  />
                                ) : (
                                  <FaTrash
                                    onClick={() => deleteCategory(item?._id)}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
