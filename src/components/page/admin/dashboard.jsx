import { useEffect, useState } from "react";
import SideMenu from "../../layout/admin/sidemenu";
import ManageUser from "./manageuser";
import { FaUserSecret } from "react-icons/fa";
import AdminLoading from "../../layout/admin/adminloading";
import { getAll, getSingle } from "../../function/user";
import {useNavigate} from "react-router-dom";
import { logout } from "../../function/user";
import OverView from "./overview";
import ManageHerbs from "./manageherb";
import ManageNews from "./managenews";
import ManageResearch from "./manageresearch";
import ManageComments from "./managecomments";

const Dashboard = () => {
    const navigate = useNavigate();
    const [pageActive,setPageActive] = useState(0);
    const [user,setUser] = useState({});
    const [isLoading,setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        try {
            getSingle().then((res) => {
                if(!res || res.role !== 'admin')
                    return navigate('/');
                setUser(res);
            })
        } catch (error) {
            console.error(error);
        }finally{
            setIsLoading(false);
        }
        
    },[]);

    const getPageActive = (page) => {
        setPageActive(page);
    }

    // ออกจากระบบ
    const logoutBtn = async () => {
        const {isConfirmed} = await Swal.fire({
            title:"แจ้งเตือน",
            icon:"question",
            text:"ต้องการออกจากระบบหรือไม่",
            showDenyButton:true,
            confirmButtonText:"ออกจากระบบ",
            denyButtonText:"ไม่ต้องการ"
        })
        if(!isConfirmed)return;
        setIsLoading(true);
        try {
            const res = await logout();
            if (res.data.err) {
                return Swal.fire("เกิดข้อผิดพลาด", res.data.err, "error");
            }
            await Swal.fire("แจ้งเตือน", res.data.mes, "success");
            navigate("/");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const setCommentUserid = (id) => {
        setUserIdFromComment(id);
        getPageActive(1);
    }


    return(
        <div className="w-screen h-screen flex justify-end overflow-hidden">
            {isLoading && <AdminLoading/>}
            <SideMenu user={user} logoutBtn={logoutBtn} getPageActive={getPageActive}/>
            <div className="relative w-[80%] h-full flex flex-col gap-5 bg-gray-50" style={{padding:"0.8rem 2rem"}}>
                <div className="w-full flex items-start justify-between border-b-5" style={{paddingBottom:'1.2rem'}}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="" className="">WELCOME BACK,</label>
                        <label className="text-4xl font-bold text-[#050a44]">{user?.profile?.fname} {user?.profile?.lname}</label>
                    </div>
                    <label htmlFor="" className="text-[#050a44] font-bold flex gap-2 items-center"><FaUserSecret/>ADMIN</label>
                </div>
                {
                    pageActive == 1 ?
                    <ManageUser user={user}/> 
                    : 
                    pageActive == 0 ?
                    <OverView/>
                    : 
                    pageActive == 2 ?
                    <ManageHerbs/>
                    : 
                    pageActive == 3 ? 
                    <ManageNews/>
                    : 
                    pageActive == 4 ?
                    <ManageResearch/>
                    : 
                    pageActive == 5 ?
                    <ManageComments getUserIdFromComment={setCommentUserid}/>
                    : ''

                }
            </div>
            
        </div>
    )
}

export default Dashboard;