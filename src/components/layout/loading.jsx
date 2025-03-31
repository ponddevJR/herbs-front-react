
import "../style/Loading.css";

const Loading = () => {
    return(
        <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.8)] z-50">
            <div className="flex flex-col items-center gap-5 bg-gray-100 rounded-lg " style={{padding:'1.5rem 2rem'}}>
                <label htmlFor="" className="spinner"></label>
                <label className="text-xl" htmlFor="">กำลังดำเนินการ...</label>
            </div>
        </div>
    )
}
export default Loading;