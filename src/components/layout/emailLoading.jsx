import "../style/emailLoading.css";

const EmailLoading = () => {
    return(
        <div className="w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.8)] z-10 flex flex-col items-center justify-center">
            <div className="loader">
            </div> 
        </div>
    )
}
export default EmailLoading;