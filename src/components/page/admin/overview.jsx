import { useEffect, useState } from "react";
import { FaBullseye, FaEnvelope } from "react-icons/fa";
import AdminLoading from "../../layout/admin/adminloading";
import { getAll } from "../../function/user";


const OverView = () => {
    const [isLoading,setIsLoading] = useState(false);
    const [users,setUsers] = useState([]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await getAll();
            if(res?.data?.users){ 
                setUsers((res?.data?.users?.filter((item) => item.role === 'admin')))
            }
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    },[]);
    return(
        <div className="w-full h-full flex gap-10">
            {isLoading && <AdminLoading/>}
            <div className="w-[65%] h-full flex-col gap-7 flex">
                {/*  */}
                <div style={{padding:"1.5rem"}} className="flex w-full h-[39vh] justify-between items-center rounded-3xl bg-[#1c266e]">
                    <div className="flex flex-col items-start justify-between w-[55%] h-full">
                        <label className="text-3xl font-bold text-white" htmlFor="">จัดการหลังบ้าน<br/>ระบบจัดการสารสนเทศสมุนไพรไทย</label>
                        <p className="text-white leading-relaxed ">
                            ยกระดับการจัดการข้อมูลสมุนไพรไทย
                            ด้วยระบบหลังบ้านที่ปลอดภัย ใช้งานง่าย และทรงประสิทธิภาพ
                        </p>
                        <button style={{padding:"0.5rem 4rem"}} className="cursor-pointer hover:scale-105 text-xl rounded-3xl bg-white">เริ่มเลย!</button>
                    </div>
                    <div className="w-[42%] h-[90%]">
                        <img src="/img/dashboard.png" className="w-full h-full" alt="" />
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div className=" w-[48%] h-full gap-2 justify-between flex flex-col border border-gray-400 shadow-lg shadow-gray-300 rounded-xl" style={{padding:"1.5rem"}}>
                        <label htmlFor="" className="flex items-center text-xl gap-3"><i className="fas fa-person"></i> จำนวนผู้เข้าชมเว็บไซต์วันนี้</label>
                        <div className="w-full flex items-center gap-7 justify-center">
                            <span className="text-4xl font-bold">1,000 คน</span>
                            <img src="/img/chart_up.png" className="w-[9rem]" alt="" />
                        </div>
                        <label htmlFor="" className="font-bold text-green-600 text-lg">+10% จากเมื่อวาน</label>
                    </div>
                    <div className="w-[48%] h-full gap-2 justify-between flex flex-col border border-gray-400 shadow-lg shadow-gray-300 rounded-xl" style={{padding:"1.5rem"}}>
                        <label htmlFor="" className="flex items-center text-xl gap-3"><i className="fas fa-share-nodes"></i> จำนวนการแชร์วันนี้</label>
                        <div className="w-full flex items-center gap-7 justify-center">
                            <span className="text-4xl font-bold">500 คน</span>
                            <img src="/img/chart_down.png" className="w-[9rem]" alt="" />
                        </div>
                        <label htmlFor="" className="font-bold text-red-600 text-lg">-10% จากเมื่อวาน</label>
                    </div>
                </div>
            </div>

            {/* admins */}
            <div className="w-[35%] h-full flex flex-col">
                <div style={{padding:"0 1.5rem"}} className="relative flex flex-col gap-6 w-full h-[50vh] rounded-xl shadow-lg border border-gray-400">
                    <button style={{padding:"0.5rem 1rem"}} className="transition-all duration-150 cursor-pointer absolute bottom-[-1.2rem] left-[40%] text-white bg-[#1c266e] hover:bg-[#050a44] rounded-lg">ดูทั้งหมด</button>
                    <label style={{marginBottom:"0.2rem",padding:"1rem 0"}} htmlFor="" className="sticky top-0 bg-white border-b-2 flex items-center gap-3"><FaBullseye/> รายชื่อผู้ดูแลระบบ</label>
                    <div className="relative w-full flex flex-col gap-6 overflow-auto">
                        {
                            users.length > 0 ?
                            users.map((item,index) => {
                                return <div key={index} className="w-full flex justify-between">
                                    <div className="border w-[20%] h-full">
                                        <img src={item?.profile?.profile_img.startsWith("h") ? item?.profile?.profile_img : `${import.meta.env.VITE_IMG_URL}${item?.profile?.profile_img}`} className="w-full h-full" alt="" />
                                    </div>
                                    <div className="w-[75%] flex flex-col gap-1">
                                        <label htmlFor="">Pathomporn Wongsuwan</label>
                                        <label htmlFor="" className="text-[0.75rem] text-gray-500 flex gap-2 items-center"><FaEnvelope/> : gold012021@gmail.com</label>
                                    </div>
                                </div>
                            })
                            : 
                            <div>
                                ไม่พบข้อมูลผู้ใช้งาน
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OverView;