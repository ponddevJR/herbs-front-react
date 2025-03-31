import { useState } from "react";
import {
  FaAddressBook,
  FaBuilding,
  FaIdCardAlt,
  FaMap,
  FaBox,
} from "react-icons/fa";
import EmailLoading from "../../../layout/emailLoading";
import { getProvince } from "../../../function/province";
const LastStep = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    province: "start",
    amphure: "start",
    sub_dis: "start",
    zip_code: "",
  });
  const [amphures, setAmphures] = useState([]);
  const [tambon, setTambon] = useState([]);

  // เลือกจังหวัด
  const selectProvince = async (e) => {
    setIsLoading(true);
    const value = e.target.value.trim();
    setForm({
      amphure: "start",
      sub_dis: "start",
      zip_code: "",
      [e.target.name]: value,
    });
    setAmphures([]);
    setTambon([]);
    try {
      const res = await getProvince(value);
      setAmphures(res.data.province.amphure);
    } catch (error) {
      console.log(error);
      await Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // เลือกอำเภอ
  const selectAmphure = (e) => {
    setTambon([]);
    const value = e.target.value.trim();
    amphures.map((item) => {
      if (item.name_th === value) {
        setTambon(item.tambon);
        return;
      }
    });
    setForm({
      ...form,
      sub_dis: "start",
      zip_code: "",
      [e.target.name]: value,
    });
  };
  // เลือกตำบล
  const selectTambon = (e) => {
    const value = e.target.value.trim();
    tambon.map((item) => {
      if (item.name_th === value) {
        setForm({ ...form, [e.target.name]: value, zip_code: item.zip_code });
        return;
      }
    });
  };

  const subMitForm = (e) => {
    e.preventDefault();
    if (Object.values(form).some((data) => data === ""))
      return Swal.fire("เกิดข้อผิดพลาด", "โปรดทำรายการให้ครบถ้วน", "error");
    props.subMitRegister(form);
  };

  return (
    <form
      onSubmit={subMitForm}
      encType="multipart/form-data"
      className="relative w-[465px] h-[455px] flex flex-col justify-between"
      style={{ padding: "1.5rem 2.8rem" }}
    >
      {isLoading && <EmailLoading />}
      <div className="w-full flex flex-col gap-2">
        <label className="flex items-center gap-2" htmlFor="">
          <FaMap /> เลือกจังหวัด
        </label>
        <select
          value={form.province}
          onChange={selectProvince}
          className="border-2 outline-none cursor-pointer"
          style={{ paddingBottom: "0.3rem" }}
          name="province"
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
      <div
        className={`w-full flex flex-col gap-2 transition-all duration-300 ${
          amphures.length > 0
            ? "opacity-100 z-2 translate-y-[0px]"
            : "opacity-0 z-[-1] -translate-y-[15px]"
        }`}
      >
        <label className="flex items-center gap-2" htmlFor="">
          <FaBuilding /> อำเภอ
        </label>
        <select
          onChange={selectAmphure}
          className="border-2 outline-none cursor-pointer"
          style={{ paddingBottom: "0.3rem" }}
          name="amphure"
          value={form.amphure}
        >
          <option value="start" disabled>
            -- เลือกอำเภอ --
          </option>
          {amphures.map((item, index) => {
            return (
              <option key={index} value={item.name_th}>
                {item.name_th}
              </option>
            );
          })}
        </select>
      </div>
      <div
        className={`w-full flex flex-col gap-2 transition-all duration-300 ${
          tambon.length > 0
            ? "opacity-100 z-2 translate-y-[0px]"
            : "opacity-0 z-[-1] -translate-y-[15px]"
        }`}
      >
        <label className="flex items-center gap-2" htmlFor="">
          <FaAddressBook /> ตำบล
        </label>
        <select
          onChange={selectTambon}
          className="border-2 outline-none cursor-pointer"
          style={{ paddingBottom: "0.3rem" }}
          name="sub_dis"
          value={form.sub_dis}
        >
          <option value="start" disabled>
            -- เลือกตำบล --
          </option>
          {tambon.map((item, index) => {
            return (
              <option key={index} value={item.name_th}>
                {item.name_th}
              </option>
            );
          })}
        </select>
      </div>
      <div
        className={`w-full flex flex-col gap-2 transition-all duration-300 ${
          form.zip_code !== ""
            ? "opacity-100 z-2 translate-y-[0px]"
            : "opacity-0 z-[-1] -translate-y-[15px]"
        }`}
      >
        <label className="flex items-center gap-2" htmlFor="">
          <FaBox /> รหัสไปรษณีย์
        </label>
        <input
          className="border-b-2 outline-none"
          style={{ paddingBottom: "0.3rem" }}
          type="text"
          value={form.zip_code}
          name="zip_code"
          disabled={true}
        />
      </div>
      <button
        className="rounded-md cursor-pointer transition-all duration-150 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        style={{ padding: "0.8rem" }}
      >
        <FaIdCardAlt />
        สมัครสมาชิก
      </button>
    </form>
  );
};

export default LastStep;
