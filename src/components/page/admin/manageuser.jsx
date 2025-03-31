import { FaFilter, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import Switch from "react-switch";
import AdminLoading from "../../layout/admin/adminloading";
import { lazy, useEffect, useState } from "react";
import { getAll, deleteUser, updateData } from "../../function/user";
import { sendEmail } from "../../function/sendEmail";
import Reason from "./manageuser_components/reason";
import SeeInfo from "./manageuser_components/seeinfo";
import FilterUser from "./manageuser_components/filteruser";

const ManageUser = ({ user}) => {
  const [allUser, setAllUsers] = useState([]);
  const [originUsers, setOriginUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(5);
  const [tablePage, setTablePage] = useState(1);
  const [reasonActive, setReasonActive] = useState(false);
  const [activeUser, setActiveUser] = useState({});
  const [dataActive, setDataActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchValue,setSearchValue] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAll();
      if (res?.data?.users) {
        setAllUsers(res.data.users);
        setOriginUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // คำนวนระยะห่างวัน
  const daysDifference = (inputDate) => {
    const input = new Date(inputDate);
    const today = new Date();

    // ทำให้เวลาเป็น 00:00:00 เพื่อนับเฉพาะวัน
    input.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // คำนวณความต่างใน milliseconds แล้วแปลงเป็นวัน
    const diffTime = today - input;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const delUser = async (item) => {
    setDataActive(false);
    setActiveUser(item);
    const { isConfirmed } = await Swal.fire({
      title: "ต้องการลบบัญชีนี้หรือไม่",
      text: "บัญชีที่ลบแล้วจะไม่สามารถกู้คืนได้",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "ลบบัญชี",
    });
    if (!isConfirmed) return;
    setReasonActive(true);
  };

  const sendDelete = async (reasons) => {
    try {
      const res = await deleteUser(activeUser?._id);
      if (res.data.err)
        return Swal.fire("้เกิดข้อผิดพลาด", res.data.err, "error");

      const send = await sendEmail(
        activeUser?.profile?.email,
        `คุณ${activeUser?.profile.fname} ${activeUser?.profile.lname}`,
        "บัญชีถูกลบ!",
        "ระบบสารสนเทศสมุนไพรไทย",
        `บัญชีของคุณถูกลบเนื่องจาก ${reasons.join(",")} โดย ผู้ดูแลระบบ:${
          user?.profile.fname
        } ${user?.profile.lname}`
      );
      if (!send)
        return Swal.fire("้เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");

      await Swal.fire("แจ้งเตือน", res.data.mes, "success");
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("้เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserRole = async (item, value) => {
    if (!item.status)
      return Swal.fire(
        "แจ้งเตือน",
        "กรุณาอนุมัติการใช้งานของผู้ใช้รายนี้ก่อนทำการแก้ไขข้อมูล",
        "error"
      );

    const oldRole =
      item.role === "admin"
        ? "ผู้ดูแลระบบ"
        : item.role === "normal"
        ? "สมาชิก"
        : item.role === "medic"
        ? "แพทย์"
        : "นักวิจัย";
    const { isConfirmed } = await Swal.fire({
      title: "แจ้งเตือน",
      text: "ต้องการเปลี่ยนบทบาทของผู้ใช้รายนี้หรือไม่?",
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    });
    if (!isConfirmed) return;
    item.role = value;
    setIsLoading(true);
    try {
      const res = await updateData(item);
      if (res.data.err)
        return Swal.fire("้เกิดข้อผิดพลาด", res.data.err, "error");

      const send = await sendEmail(
        item?.profile?.email,
        `คุณ${item?.profile.fname} ${item?.profile.lname}`,
        "แก้ไขบทบาท!",
        "ระบบสารสนเทศสมุนไพรไทย",
        `บทบาทในบัญชีของคุณได้รับการแก้ไข จากเดิม "${oldRole}" เป็น "${
          item.role === "admin"
            ? "ผู้ดูแลระบบ"
            : item.role === "normal"
            ? "สมาชิก"
            : item.role === "medic"
            ? "แพทย์"
            : "นักวิจัย"
        }" โดย ผู้ดูแลระบบ:${user?.profile.fname} ${user?.profile.lname}`
      );
      if (!send)
        return Swal.fire("้เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");

      await Swal.fire("แจ้งเตือน", res.data.mes, "success");
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("้เกิดข้อผิดพลาด", "ไม่สามารถแก้ข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const changeStatus = async (item) => {
    const isApproving = !item.status; // ตรวจสอบว่าเป็นการอนุมัติหรือระงับ
    const confirmText = isApproving
      ? "ต้องการอนุมัติบัญชีผู้ใช้นี้หรือไม่?"
      : "ต้องการระงับบัญชีผู้ใช้รายนี้หรือไม่?";
    const alertEmail = isApproving
      ? `บัญชีของคุณได้รับการอนุมัติแล้ว โดยผู้ดูแลระบบ: ${user?.profile?.fname} ${user?.profile?.lname}`
      : `บัญชีของคุณถูกระงับชั่วคราว โดยผู้ดูแลระบบ: ${user?.profile?.fname} ${user?.profile?.lname}`;
    const emailSubject = isApproving ? "อนุมัติบัญชีแล้ว!" : "บัญชีถูกระงับ!";
    const alertText = isApproving
      ? ""
      : "**บัญชีที่ถูกระงับเกิน 5 วัน ระบบจะลบออกอัตโนมัติ!";

    const { isConfirmed } = await Swal.fire({
      title: confirmText,
      text: alertText,
      icon: "question",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    });

    if (!isConfirmed) return;

    setIsLoading(true);

    try {
      // อัปเดตค่าผู้ใช้โดยไม่แก้ไขตัวแปรโดยตรง
      const updatedUser = { ...item, status: isApproving };

      const res = await updateData(updatedUser);
      if (res.data?.err) {
        return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
      }

      const send = await sendEmail(
        updatedUser?.profile?.email,
        `คุณ${updatedUser?.profile?.fname} ${updatedUser?.profile?.lname}`,
        emailSubject,
        "ระบบสารสนเทศสมุนไพรไทย",
        alertEmail
      );

      if (!send) {
        return Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งอีเมล์ได้", "error");
      }

      await Swal.fire(
        "แจ้งเตือน",
        "อนุมัติการเข้าใช้งานของผู้ใช้รายนี้แล้ว",
        "success"
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const forwardPage = () => {
    if (tablePage > allUser.length % 5 || allUser.length < 2)
      return Swal.fire(
        "ไม่พบข้อมูล",
        `ผู้ใช้งานที่พบมีจำนวน ${allUser.length} ผู้ใช้งาน`,
        "error"
      );
    setTablePage(tablePage + 1);
    setStartSlice(endSlice);
    setEndSlice(endSlice + 5);
  };

  const prevPage = () => {
    if (tablePage <= 1) return;
    setTablePage(tablePage - 1);
    setStartSlice(startSlice - 5);
    setEndSlice(endSlice - 5);
  };

  const inputSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchValue(value);
    if (value === "") {
      setAllUsers(originUsers);
    } else {
      setAllUsers(
        originUsers.filter((user) => {
          const userStatus = user.status ? "อนุมัติแล้ว" : "ยังไม่อนุมัติ";
          const userRole =
            user.role === "admin"
              ? "ผู้ดูแลระบบ"
              : user.role === "medic"
              ? "แพทย์"
              : user.role === "normal"
              ? "สมาชิก"
              : "นักวิจัย";
          return (
            user.profile.fname.toLowerCase().includes(value) ||
            user.profile.lname.toLowerCase().includes(value) ||
            user._id.toLowerCase().includes(value) ||
            user.profile.email.toLowerCase().includes(value) ||
            user.profile.phone.includes(value) ||
            new Date(user.createdAt)
              .toLocaleDateString("th-TH")
              .includes(value) ||
            userRole.includes(value) ||
            userStatus.includes(value)
          );
        })
      );
      setTablePage(1);
      setStartSlice(0);
      setEndSlice(5);
    }
  };

  const filterUser = (value) => {
    setAllUsers(value);
    setFilterActive(false);
    setTablePage(1);
  };

  const resetTable = () => {
    setAllUsers(originUsers);
    setTablePage(1);
    setStartSlice(0);
    setEndSlice(5);
    setSearchValue("");
  };

  return (
    <div className="relative w-full h-full flex flex-col gap-3">
      {isLoading && <AdminLoading />}
      <SeeInfo
        active={dataActive}
        onClose={() => setDataActive(false)}
        user={activeUser}
      />
      {reasonActive && (
        <Reason onClose={() => setReasonActive(false)} onSubmit={sendDelete} />
      )}
      <FilterUser
        users={originUsers}
        onClose={() => setFilterActive(false)}
        active={filterActive}
        filterUser={filterUser}
      />
      <div className="w-full flex items-center justify-between">
        <button
          className="transition-all duration-200 text-black flex text-md items-center gap-2 hover:text-white hover:bg-[#050a44] rounded-lg cursor-pointer shadow-md border border-gray-200"
          style={{ padding: "0.5rem 1rem" }}
        >
          <FaPlus />
          เพิ่มสมาชิก
        </button>
        <div
          className="relative rounded-full flex items-center w-[50%] gap-4 border-2 border-[#050a44] "
          style={{ padding: "0.5rem 1rem" }}
        >
          <i className="fas fa-magnifying-glass"></i>
          <input
            onChange={inputSearch}
            value={searchValue}
            type="text"
            placeholder="พิมพ์เพื่อค้นหา"
            className="text-[1rem] outline-none w-[93%]"
          />
          <button
            onClick={resetTable}
            style={{ padding: "0.3rem 0.5rem" }}
            className={`cursor-pointer transiton-all duration-150 rounded-full hover:bg-[#050a44] hover:text-white absolute top- right-[-2.5rem]`}
          >
            <i className="fas fa-rotate-right"></i>
          </button>
        </div>
        <button
          onClick={() => setFilterActive(true)}
          className="transition-all duration-200 text-black flex text-md items-center gap-2 hover:text-white hover:bg-[#050a44] rounded-lg cursor-pointer shadow-md border border-gray-200"
          style={{ padding: "0.5rem 1rem" }}
        >
          <FaFilter />
          ตัวกรอง
        </button>
      </div>
      <div
        className="relative w-full h-full flex gap-2 flex-col overflow-auto"
        style={{ marginTop: "0.1rem" }}
      >
        <table className="w-full text-black text-left rtl:text-right text-gray-600 dark:text-gray-400">
          <thead className="text-center sticky top-0 text-[1.1rem] text-gray-100 uppercase bg-[#050a44] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th style={{ padding: "0.5rem 0" }} scope="col">
                รหัสสมาชิก
              </th>
              <th scope="col">ชื่อ-นามสกุล</th>
              <th scope="col">อีเมล์</th>
              <th scope="col">สถานะ</th>
              <th scope="col">บทบาท</th>
              <th scope="col">แอคชั่น</th>
            </tr>
          </thead>
          <tbody className="relative">
            {allUser.length > 0 ? (
              allUser
                .slice(startSlice, endSlice)
                .reverse()
                .map((item, index) => {
                  return (
                    <tr
                      key={item._id}
                      className="text-black text-center cursor-pointer hover:bg-gray-200 transition-all text-[0.93rem] duration-200 bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    >
                      <td className="relative">
                        {daysDifference(item?.createdAt) < 3 ? (
                          <small
                            className="absolute top-1 left-1 text-white bg-green-600 text-[0.7rem]"
                            style={{ padding: "0.2rem" }}
                          >
                            สมาชิกใหม่
                          </small>
                        ) : (
                          ""
                        )}
                        {`${item?._id.substring(0, 10)}...`}
                      </td>
                      <td>
                        {item?.profile?.fname} {item?.profile?.lname}
                      </td>
                      <td>{item?.profile?.email}</td>
                      <td>
                        <Switch
                          disabled={user?._id === item?._id}
                          checked={item?.status}
                          offColor="#f22626"
                          onChange={() => changeStatus(item)}
                        />
                      </td>
                      <td>
                        <select
                          disabled={user?._id === item._id}
                          onChange={(e) => changeUserRole(item, e.target.value)}
                          value={item?.role}
                          name="role"
                          id=""
                          className="transition-all duration-200 hover:ring-2 hover:ring-[#050a44] cursor-pointer border rounded-xl bg-white"
                          style={{ padding: "0.3rem" }}
                        >
                          <option value="admin">ผู้ดูแลระบบ</option>
                          <option value="medic">แพทย์</option>
                          <option value="normal">สมาชิก</option>
                          <option value="researcher">นักวิจัย</option>
                        </select>
                      </td>
                      <td>
                        <div
                          style={{ padding: "0.35rem 0" }}
                          className="flex flex-col gap-1"
                        >
                          <button
                            onClick={() => {
                              setActiveUser(item), setDataActive(true);
                            }}
                            style={{ padding: "0.4rem", marginLeft: "0.65rem" }}
                            className="shadow border border-gray-100 cursor-pointer bg-white hover:bg-sky-500 transition-all hover:text-white duration-200 w-[80%] justify-center flex items-center gap-1"
                          >
                            <FaEye />
                            ตรวจสอบ
                          </button>
                          <button
                            disabled={user?._id === item._id}
                            onClick={() => delUser(item)}
                            style={{ padding: "0.4rem", marginLeft: "0.65rem" }}
                            className="cursor-pointer bg-white shadow border border-gray-100 hover:bg-red-500 transition-all hover:text-white duration-200 w-[80%] justify-center flex items-center gap-1"
                          >
                            <FaTrash />
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr className="absolute top-0 left-0 translate-x-[28rem]">
                <td className="text-2xl font-blod" style={{ padding: "2rem" }}>
                  <div className="flex flex-col gap-8 items-center">
                    <img src="/img/no_data.png" className="w-[15rem]" alt="" />{" "}
                    <label htmlFor="">ไม่พบข้อมูล</label>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div
          className="w-full flex items-center gap-8 justify-between text-white absolute bottom-0 left-0 border bg-[#050a44] text-lg"
          style={{ padding: "0.3rem 1.5rem" }}
        >
          <label htmlFor="" className="text-[1rem]">
            พบผู้ใช้งานทั้งหมดในระบบ {allUser.length} ผู้ใช้งาน
          </label>
          <div className="flex gap-12 items-center">
            <button
              onClick={prevPage}
              className="transition-all duration-200 rounded-lg cursor-pointer hover:bg-white hover:text-[#050a44] active:scale-90"
              style={{ padding: "0.2rem 0.8rem" }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <label htmlFor="" className="font-bold">
              {tablePage}
            </label>
            <button
              onClick={forwardPage}
              className="transition-all duration-200 rounded-lg cursor-pointer hover:bg-white hover:text-[#050a44] active:scale-90"
              style={{ padding: "0.2rem 0.8rem" }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
