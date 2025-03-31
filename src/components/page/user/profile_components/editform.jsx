import { useEffect, useState } from "react";
import {
  FaPhone,
  FaMap,
  FaBuilding,
  FaAddressBook,
  FaBox,
  FaUpload,
  FaCheck,
  FaSave,
} from "react-icons/fa";
import { getProvince } from "../../../function/province";
import { isValidThaiPhoneNumber } from "../../../function/sendEmail";
import EmailLoading from "../../../layout/emailLoading";

const FormEdit = ({ user, updateUser }) => {
  const [form, setUser] = useState({ ...user });
  const [previewUrl, setPreviewUrl] = useState(
    user?.profile?.profile_img.startsWith("h") ? user?.profile?.profile_img : ""
  );
  const [previewFile, setPreviewFile] = useState(
    !user?.profile?.profile_img.startsWith("h")
      ? `http://localhost:8989/uploads/${user?.profile?.profile_img}`
      : ""
  );
  const [amphure, setAmphure] = useState([]);
  const [sub_dis, setSubDis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetch amphure and sub_dis
  const getAmpure = async (province) => {
    setIsLoading(true);
    if (province === "") return;
    const res = await getProvince(province);
    if (res) setAmphure(res.data.province.amphure);
    setSubDis([]);
    setIsLoading(false);
  };
  const getSubdiv = () => {
    if (form?.address && amphure.length > 0) {
      const foundAmphure = amphure.find(
        (item) => item.name_th === form?.address?.amphure
      );
      if (foundAmphure) {
        setSubDis(foundAmphure.tambon);
      }
    }
  };
  useEffect(() => {
    getAmpure(form?.address?.province);
  }, [form?.address?.province]);
  useEffect(() => {
    getSubdiv();
  }, [amphure]);

  // แก้ไขที่อยู่
  const selectProvince = (e) => {
    const value = e.target.value;
    setUser({
      ...form,
      address: {
        ...form.address,
        [e.target.name]: value,
        amphure: "start",
        sub_dis: "start",
        zip_code: "",
      },
    });
    getProvince(value);
  };
  const selectAmphure = (e) => {
    const value = e.target.value;
    setUser({
      ...form,
      address: {
        ...form.address,
        [e.target.name]: value,
        sub_dis: "start",
        zip_code: "",
      },
    });
    const foundAmphure = amphure.find((item) => item.name_th === value);
    if (foundAmphure) {
      setSubDis(foundAmphure.tambon);
    }
  };
  const selectTambon = (e) => {
    const value = e.target.value;
    const tambon = sub_dis.find((item) => item.name_th === value);
    setUser({
      ...form,
      address: {
        ...form.address,
        [e.target.name]: value,
        zip_code: tambon.zip_code,
      },
    });
  };
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value.trim();
    if (
      name === "fname" ||
      name === "lname" ||
      name === "phone" ||
      name === "email"
    ) {
      setUser({ ...form, profile: { ...form.profile, [name]: value } });
    } else if (name === "file") {
      fileImgInput(e);
    } else if (name === "url") {
      urlImgInput(e);
    } else if (name === "province") {
      selectProvince(e);
    } else if (name === "amphure") {
      selectAmphure(e);
    } else if (name === "sub_dis") {
      selectTambon(e);
    } else {
      setUser({ ...form, [name]: value });
    }
  };
  // อัปโหลดไฟล์รูปภาพ
  const fileImgInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (f) {
        setUser({
          ...form,
          profile: { ...form.profile, profile_img: "none" },
          file,
        });
        setPreviewUrl("");
        setPreviewFile(f.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const urlImgInput = (e) => {
    const { value } = e.target;
    setUser({
      ...form,
      profile: { ...form.profile, profile_img: value },
      file: {},
    });
    setPreviewFile(""); // ล้าง preview file
    setPreviewUrl(value); // ตั้งค่า preview จาก URL
  };

  const sendUpdate = async (e) => {
    e.preventDefault();
    const finalForm = { ...form };
    const { address } = finalForm;
    if (Object.values(address).some((data) => data === ""))
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดตรวจสอบความถูกต้อง", "error");
    // validate form
    if (form?.profile?.fname === "" || form?.profile?.lname === "")
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดตรวจสอบความถูกต้อง", "error");
    if (!previewFile && !previewUrl)
      return Swal.fire(
        "เกิดข้อผิดพลาด",
        "กรุณาอัปโหลดรูปภาพที่ต้องการแก้ไข",
        "error"
      );
    if (
      !isValidThaiPhoneNumber(finalForm.profile.phone) ||
      finalForm.profile.phone.length !== 10
    )
      return Swal.fire("เกิดข้อผิดพลาด", "เบอร์โทรศัพท์ไม่ถูกต้อง", "error");
    // ลบฟิลด์ไฟล์หาก รูปภาพเป็น url
    if (previewFile === "") {
      delete finalForm.file;
    }
    if (finalForm.file) {
      const formEncryp = new FormData();
      for (const key in form) {
        formEncryp.append(key, form[key]);
      }
      const { profile } = finalForm;
      const { address } = finalForm;
      for (const key in profile) {
        formEncryp.append(key, profile[key]);
      }
      for (const key in address) {
        formEncryp.append(key, address[key]);
      }
      const old = user?.profile?.profile_img;
      formEncryp.append("old", old);
      updateUser(formEncryp);
    } else {
      updateUser(finalForm);
    }
  };

  return (
    <form
      onSubmit={sendUpdate}
      encType="multipart/form-data"
      className="user_section relative w-full h-full flex flex-col items-center"
    >
      {isLoading && <EmailLoading />}
      <div
        className="w-full flex justify-between"
        style={{ padding: "1.3rem" }}
      >
        <div className="w-[40%] flex flex-col gap-5">
          <div className="w-full flex flex-col">
            <label htmlFor="" className="text-[1.3rem]">
              แบบฟอร์มแก้ไขข้อมูล
            </label>
            <label
              htmlFor=""
              className="text-[0.8rem] text-green-800 font-bold"
            >
              MEMBER'S UPDATE DATA
            </label>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="">ชื่อ</label>
              <input
                value={form?.profile?.fname}
                onChange={handleInput}
                type="text"
                name="fname"
                className="border-b-2 outline-none"
                style={{ padding: "0.3rem" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">นามสกุล</label>
              <input
                value={form?.profile?.lname}
                onChange={handleInput}
                type="text"
                name="lname"
                className="border-b-2 outline-none"
                style={{ padding: "0.3rem" }}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2">
                <FaMap /> จังหวัด
              </label>
              <select
                value={form?.address?.province}
                onChange={handleInput}
                type="text"
                name="province"
                className="cursor-pointer w-[12rem] border-2 outline-none"
                style={{ padding: "0.3rem" }}
              >
                <option value="start" disabled>
                  -- เลือกจังหวัด --
                </option>
                <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                <option value="สมุทรปราการ">สมุทรปราการ</option>
                <option value="นนทบุรี">นนทบุรี</option>
                <option value="ปทุมธานี">ปทุมธานี</option>
                <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
                <option value="อ่างทอง">อ่างทอง</option>
                <option value="ลพบุรี">ลพบุรี</option>
                <option value="สิงห์บุรี">สิงห์บุรี</option>
                <option value="ชัยนาท">ชัยนาท</option>
                <option value="สระบุรี">สระบุรี</option>
                <option value="ชลบุรี">ชลบุรี</option>
                <option value="ระยอง">ระยอง</option>
                <option value="จันทบุรี">จันทบุรี</option>
                <option value="ตราด">ตราด</option>
                <option value="ฉะเชิงเทรา">ฉะเชิงเทรา</option>
                <option value="ปราจีนบุรี">ปราจีนบุรี</option>
                <option value="นครนายก">นครนายก</option>
                <option value="สระแก้ว">สระแก้ว</option>
                <option value="นครราชสีมา">นครราชสีมา</option>
                <option value="บุรีรัมย์">บุรีรัมย์</option>
                <option value="สุรินทร์">สุรินทร์</option>
                <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                <option value="อุบลราชธานี">อุบลราชธานี</option>
                <option value="อำนาจเจริญ">อำนาจเจริญ</option>
                <option value="หนองบัวลำภู">หนองบัวลำภู</option>
                <option value="ขอนแก่น">ขอนแก่น</option>
                <option value="อุดรธานี">อุดรธานี</option>
                <option value="เลย">เลย</option>
                <option value="หนองคาย">หนองคาย</option>
                <option value="มหาสารคาม">มหาสารคาม</option>
                <option value="ร้อยเอ็ด">ร้อยเอ็ด</option>
                <option value="กาฬสินธุ์">กาฬสินธุ์</option>
                <option value="สกลนคร">สกลนคร</option>
                <option value="นครพนม">นครพนม</option>
                <option value="มุกดาหาร">มุกดาหาร</option>
                <option value="เชียงใหม่">เชียงใหม่</option>
                <option value="เชียงราย">เชียงราย</option>
                <option value="ลำปาง">ลำปาง</option>
                <option value="ลำพูน">ลำพูน</option>
                <option value="แม่ฮ่องสอน">แม่ฮ่องสอน</option>
                <option value="น่าน">น่าน</option>
                <option value="พะเยา">พะเยา</option>
                <option value="แพร่">แพร่</option>
                <option value="อุตรดิตถ์">อุตรดิตถ์</option>
                <option value="ตาก">ตาก</option>
                <option value="สุโขทัย">สุโขทัย</option>
                <option value="พิษณุโลก">พิษณุโลก</option>
                <option value="เพชรบูรณ์">เพชรบูรณ์</option>
                <option value="กำแพงเพชร">กำแพงเพชร</option>
                <option value="นครสวรรค์">นครสวรรค์</option>
                <option value="อุทัยธานี">อุทัยธานี</option>
                <option value="พิจิตร">พิจิตร</option>
                <option value="เพชรบุรี">เพชรบุรี</option>
                <option value="ประจวบคีรีขันธ์">ประจวบคีรีขันธ์</option>
                <option value="ราชบุรี">ราชบุรี</option>
                <option value="กาญจนบุรี">กาญจนบุรี</option>
                <option value="สุพรรณบุรี">สุพรรณบุรี</option>
                <option value="สมุทรสาคร">สมุทรสาคร</option>
                <option value="สมุทรสงคราม">สมุทรสงคราม</option>
                <option value="นครปฐม">นครปฐม</option>
                <option value="ภูเก็ต">ภูเก็ต</option>
                <option value="กระบี่">กระบี่</option>
                <option value="พังงา">พังงา</option>
                <option value="ระนอง">ระนอง</option>
                <option value="สุราษฎร์ธานี">สุราษฎร์ธานี</option>
                <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
                <option value="พัทลุง">พัทลุง</option>
                <option value="สงขลา">สงขลา</option>
                <option value="ปัตตานี">ปัตตานี</option>
                <option value="นราธิวาส">นราธิวาส</option>
                <option value="ยะลา">ยะลา</option>
                <option value="สตูล">สตูล</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2">
                <FaBuilding /> อำเภอ
              </label>
              <select
                type="text"
                name="amphure"
                value={form?.address?.amphure}
                onChange={handleInput}
                className="cursor-pointer w-[12rem] border-2 outline-none"
                style={{ padding: "0.3rem" }}
              >
                <option value="start">-- เลือกอำเภอ --</option>
                {amphure?.map((item, index) => {
                  return (
                    <option key={index} value={item.name_th}>
                      {item.name_th}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2">
                <FaAddressBook /> ตำบล
              </label>
              <select
                type="text"
                name="sub_dis"
                value={form?.address?.sub_dis}
                onChange={handleInput}
                className="cursor-pointer w-[12rem] border-2 outline-none"
                style={{ padding: "0.3rem" }}
              >
                <option value="start" disabled>
                  -- เลือกตำบล --
                </option>
                {sub_dis?.map((item, index) => {
                  return (
                    <option key={index} value={item.name_th}>
                      {item.name_th}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="flex items-center gap-2">
                <FaBox /> รหัสไปรษณีย์
              </label>
              <input
                type="text"
                disabled
                name="zip_code"
                value={form?.address?.zip_code}
                className="border-b-2 outline-none"
                style={{ padding: "0.3rem" }}
              />
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="" className="flex items-cenet gap-2">
              <FaPhone /> เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              name="phone"
              value={form?.profile?.phone}
              onChange={handleInput}
              className="w-[12rem] border-b-2 outline-none"
              style={{ padding: "0.3rem" }}
            />
          </div>
        </div>
        <div className="w-[40%] h-full flex flex-col items-center gap-5">
          <div
            style={{ marginTop: "1rem" }}
            className="w-[50%] h-[18vh] border-2 shadow-xl shadow-gray-300 rounded-full overflow-hidden"
          >
            <img
              className="w-full h-full object-cover"
              src={previewFile ? previewFile : previewUrl}
              alt=""
            />
          </div>
          <div className="flex flex-col gap-4 w-[60%]">
            {/* ซ่อน input file */}
            <input
              name="file"
              onChange={handleInput}
              id="file-upload"
              type="file"
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              style={{ padding: "0.5rem 1.2rem" }}
              className="flex items-center gap-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition"
            >
              <FaUpload />
              อัปโหลด
            </label>
            <input
              value={previewUrl !== "" ? previewUrl : ""}
              onChange={handleInput}
              name="url"
              style={{ paddingBottom: "0.3rem" }}
              className="border-b-2 outline-none pb-1"
              type="text"
              placeholder="หรืออัปโหลดผ่าน URL"
            />
          </div>
          <button
            type="submit"
            style={{ marginTop: "4rem", padding: "0.7rem" }}
            className="text-xl text-white bg-sky-500 w-full rounded-full cursor-pointer transition-all duration-200 hover:bg-sky-700 flex items-center gap-3 justify-center active:scale-90"
          >
            บันทึก <FaSave />
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormEdit;
