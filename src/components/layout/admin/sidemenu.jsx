import { useState } from "react";
import {FaBookMedical, FaCommentAlt, FaLeaf, FaNewspaper, FaResearchgate, FaUser} from "react-icons/fa";
import {Link} from "react-router-dom";

const SideMenu = ({getPageActive,logoutBtn,user}) => {

    const [menuActive,setMenuActive] = useState(0);

    const sendPageActive = (e) => {
        setMenuActive(e.target.value);
        getPageActive(e.target.value);
    }

    return(
        <aside className="fixed top-0 left-0 w-[20%] flex flex-col gap-1 items-center h-full bg-[#050a44] text-white">
            <div className="w-full h-[20%] gap-5 flex items-center justify-between border-b-2 border-white" style={{padding:"1.5rem"}}>
                <div className="w-[33%] h-[90%] rounded-full border-2 border-white overflow-hidden">
                    <img src={user?.profile?.profile_img?.startsWith('h') ? user?.profile?.profile_img : `${import.meta.env.VITE_IMG_URL}${user?.profile?.profile_img}`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="w-[60%] flex flex-col gap-1">
                    <Link style={{padding:"0.35rem"}} className="transition-all duration-200 font-bold cursor-pointer justify-center bg-white text-[#050a44] rounded-lg transtion-all duraiton-200 flex items-center gap-1 hover:scale-105" to="/profile">แก้ไขข้อมูล</Link>
                    <button onClick={logoutBtn} style={{marginTop:"0.5rem",padding:"0.35rem"}} className="cursor-pointer justify-center bg-red-600 rounded-lg transtion-all duraiton-200 flex items-center gap-1 hover:scale-105"><i className="fa-solid fa-right-from-bracket"></i> ออกจากระบบ</button>
                </div>
            </div>
            <label style={{margin:"0.6rem 0"}} htmlFor="" className="w-[90%] text-[0.8rem] text-gray-300">เมนู</label>
            <button style={{padding:"0.8rem 1rem"}} onClick={sendPageActive} value={0} className={`${menuActive == 0 ? 'bg-white text-black' : ''} hover:shadow-lg rounded-xl hover:bg-white hover:text-black transition-all duration-200 w-[90%] text-lg flex items-center justify-start gap-3 cursor-pointer`}>
                <i className="fa-solid fa-table-columns"></i>Over view
            </button>
            <button style={{padding:"0.8rem 1rem"}} onClick={sendPageActive} value={1} className={`${menuActive == 1 ? 'bg-white text-black' : ''} hover:shadow-lg rounded-xl hover:bg-white hover:text-black transition-all duration-200 w-[90%] text-lg flex items-center justify-start gap-3 cursor-pointer`}>
                <FaUser/>จัดการผู้ใช้งาน
            </button>
            <button style={{padding:"0.8rem 1rem"}} onClick={sendPageActive} value={2} className={`${menuActive == 2 ? 'bg-white text-black' : ''} hover:shadow-lg rounded-xl hover:bg-white hover:text-black transition-all duration-200 w-[90%] text-lg flex items-center justify-start gap-3 cursor-pointer`}>
                <FaLeaf/>จัดการสมุนไพร
            </button>
            <button style={{padding:"0.8rem 1rem"}} onClick={sendPageActive} value={3} className={`${menuActive == 3 ? 'bg-white text-black' : ''} hover:shadow-lg rounded-xl hover:bg-white hover:text-black transition-all duration-200 w-[90%] text-lg flex items-center justify-start gap-3 cursor-pointer`}>
                <FaNewspaper/>จัดการข่าวสาร
            </button>
            <button style={{padding:"0.8rem 1rem"}} onClick={sendPageActive} value={4} className={`${menuActive == 4 ? 'bg-white text-black' : ''} hover:shadow-lg rounded-xl hover:bg-white hover:text-black transition-all duration-200 w-[90%] text-lg flex items-center justify-start gap-3 cursor-pointer`}>
                <FaBookMedical/>จัดการงานวิจัย
            </button>
            <button style={{padding:"0.8rem 1rem"}} onClick={sendPageActive} value={5} className={`${menuActive == 5 ? 'bg-white text-black' : ''} hover:shadow-lg rounded-xl hover:bg-white hover:text-black transition-all duration-200 w-[90%] text-lg flex items-center justify-start gap-3 cursor-pointer`}>
                <FaCommentAlt/>จัดการความคิดเห็น
            </button>
        </aside>
    )
}

export default SideMenu;