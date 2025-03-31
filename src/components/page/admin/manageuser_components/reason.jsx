import { useState } from "react";

export default function ReasonModal({ onClose, onSubmit }) {
  const [reasons, setReasons] = useState([]);
  const [otherActive, setOtherActive] = useState(false);
  const [inputReason, setInputReason] = useState("");

  const toggleReason = (reason, index) => {
    index === 4 ? setOtherActive(!otherActive) : "";
    index !== 4
      ? setReasons(
          (prev) =>
            prev.includes(reason)
              ? prev.filter((r) => r !== reason) // ลบออกถ้ามีอยู่แล้ว
              : [...prev, reason] // เพิ่มเข้าไปถ้ายังไม่มี
        )
      : "";
  };

  const resetClose = () => {
    setReasons([]);
    setOtherActive(false);
    setInputReason(false);
    onClose();
  };

  const sendReason = async () => {
    if (reasons.length <= 0)
      return Swal.fire(
        "เกิดข้อผิดพลาด",
        "กรุณาระบุเหตุผลในการลบบัญชี",
        "error"
      );
    setReasons((prev) => [...prev, inputReason]);
    await onSubmit(reasons);
    resetClose();
  };

  return (
    <div className="z-50 flex items-center justify-center fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]">
      <div
        className="relative w-[40%] bg-white flex flex-col items-center gap-5 border-2 rounded-2xl shadow-lg"
        style={{ padding: "2rem" }}
      >
        <button
          onClick={resetClose}
          className="absolute top-2 right-2 text-xl rounded-full font-bold transtion-all duration-200 hover:bg-red-600 hover:text-white cursor-pointer"
          style={{ padding: "0.2rem 0.6rem" }}
        >
          <i className="fas fa-close"></i>
        </button>
        <div className="flex flex-col items-center gap-1">
          <label className="text-4xl font-bold ">โปรดระบุเหตุผล</label>
          <label htmlFor="" className="text-[0.85rem] text-gray-600">
            สามารถเลือกได้มากกว่า 1 เหตุผล
          </label>
        </div>

        <form className="w-full flex flex-col gap-3">
          {[
            "ผู้ใช้ละเมิดกฎเกณฑ์ของเว็บไซต์",
            "เกิดปัญหาที่ระบบและเซิร์ฟเวอร์",
            "เนื้อหาไม่เหมาะสมหรือผิดกฎหมาย",
            "บัญชีผู้ใช้น่าสงสัยหรือเป็นสแปม",
            "อื่นๆ (โปรดระบุในช่องความคิดเห็น)",
          ].map((reason, index) => (
            <div key={reason} className="w-full flex gap-2 items-center">
              <input
                type="checkbox"
                onChange={() => toggleReason(reason, index)}
                className="h-5 w-5 cursor-pointer"
              />
              <label className="text-lg">{reason}</label>
            </div>
          ))}
          <textarea
            value={inputReason}
            onChange={(e) => setInputReason(e.target.value.trim())}
            placeholder="ระบุเหตุที่ต้องลบบัญชีผู้ใช้รายนี้"
            name=""
            style={{ padding: "0.5rem" }}
            className={`transition-all duration-500 border-2 outline-none ${
              otherActive
                ? "w-full h-[8rem] opacity-100 z-2"
                : "w-0 h-0 opacity-0 z-[-1]"
            }`}
            id=""
          ></textarea>
        </form>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="" className="text-[0.9rem] text-red-600">
            *ระบบจะส่งข้อความแจ้งเตือนไปยังอีเมล์ของผู้ใช้รายนี้
          </label>
          <button
            style={{ marginTop: "0.5rem", padding: "0.8rem" }}
            className="cursor-pointer transition-all duration-200 hover:bg-red-700 w-full text-xl rounded-xl bg-red-600 text-white"
            onClick={sendReason}
          >
            ลบบัญชี
          </button>
        </div>
      </div>
    </div>
  );
}
