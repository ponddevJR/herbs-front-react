import { FaUserSecret } from "react-icons/fa";
import "../../style/adminloading.css";

const AdminLoading = () => {
    return(
        <div className="flex flex-col items-center gap-3 justify-center z-100 fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)]">
            <span className="text-white text-5xl"><FaUserSecret/></span>
            <label htmlFor="" className="text-white text-xl">กำลังดำเนินการ...</label>
            <div className="loader-admin">

            </div>
        </div>
    )
}

export default AdminLoading;