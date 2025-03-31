import { Link} from "react-router-dom";
import "../style/navbar.css";
import { useEffect, useState } from "react";
import { getSingle, logout } from "../function/user";
import Loading from "./loading";
import {FaUserSecret} from "react-icons/fa";

const Navbar = () => {
    const [isLoading,setIsLoading] = useState(false);
    const [isLogin,setIsLogin] = useState(false);
    const [user,setUser] = useState({});

    const checkLogin = async () => {
        setIsLoading(true);
         try {
            const res = await getSingle();
            if(res){
                setIsLogin(true);
                setUser(res);
            }
         } catch (error) {
            console.error(error);
         }finally{
            setIsLoading(false);
         }
    }
    // fetch login
    useEffect(() => {
        checkLogin();
    },[])

    // ออกจากระบบ
    const logoutBtn = async () => {
        setIsLoading(true);
        try {
            const res = await logout();
            if(res.data.err)return Swal.fire("เกิดข้อผิดพลาด",res.data.err,"error");

            await Swal.fire("แจ้งเตือน",res.data.mes,"success");
            location.reload();
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
    }
    return(
        <>
        {isLoading && <Loading/>}
         <nav className=" z-50 w-full fixed top-0 left-0 border flex items-center justify-between bg-[#0c2d1a]" style={{padding:'0.5rem 1.5rem'}}>
            <Link to="/" className="w-[40%] flex items-center gap-2">
                <div className="w-[15%]">
                    <img className="w-full h-[10vh]" src="https://www.rmu.ac.th/images/logo_rmu.png" alt="" />
                </div>
                <label className="text-2xl text-white" htmlFor="">ระบบจัดการสารสนเทศสมุนไพรไทย</label>
            </Link>
            <div className="flex gap-5 items-center">
                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="/">หน้าแรก</Link>
                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="/allherbs">สมุนไพร</Link>
                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="">ข่าว</Link>
                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="">งานวิจัย</Link>
                <a className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" href="/communities">ชุมชน</a>
                {
                    !isLogin && <>
                                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="/register">ลงทะเบียน</Link>
                                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="/login">เข้าสู่ระบบ</Link>
                                </>
                }
                {
                    isLogin && <>
                                <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="/profile">
                                    <div className="flex gap-1 items-center">
                                        <label htmlFor="">{user?.profile.fname}</label>
                                        <img className="w-[2rem] h-[2rem] rounded-full object-cover border-2 border-white bg-white" src={user.profile.profile_img.split("")[0] === 'h' ? user.profile.profile_img : `http://localhost:8989/uploads/${user.profile.profile_img}`} alt="" />
                                    </div>
                                </Link>
                                {
                                    user?.role === 'admin' ? <Link className="link relative transition-all duration-200 hover:text-white text-lg text-gray-200" to="/admin/dashboard"><FaUserSecret/></Link> : ''
                                }
                                <button onClick={logoutBtn} className="link relative transition-all duration-200 hover:text-red-400 text-lg text-white cursor-pointer">ออกจากระบบ</button>
                                </>
                }
                </div>
            </nav>
        </>
       
    )
}
export default Navbar;