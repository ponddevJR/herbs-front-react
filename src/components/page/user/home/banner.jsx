import { useEffect, useState, useRef } from "react";

const Banner = () => {
  const [index, setIndex] = useState(0);
  const slideInterVal = useRef(null);

  const updateSlide = () => {
    clearInterval(slideInterVal.current);
    slideInterVal.current = setInterval(() => {
      setIndex((prev) => (prev >= 6 ? 0 : prev + 1));
    }, 6000);
  };

  useEffect(() => {
    updateSlide();
    return () => clearInterval(slideInterVal);
  }, [index]);

  const nextSlide = () => {
    clearInterval(slideInterVal.current);
    setIndex((prev) => (prev >= 6 ? 0 : prev + 1));
    updateSlide();
  };

  const prevSlide = () => {
    clearInterval(slideInterVal.current);
    setIndex((prev) => (prev <= 0 ? 6 : prev - 1));
    updateSlide();
  };
  return (
    <div
      className="w-screen h-[40vh] flex gap-4 items-center justify-center"
      style={{ marginTop: "6.5rem" }}
    >
      <div className="border border-gray-500 shadow relative overflow-hidden w-[950px] h-full bg-red-500">
        <button
          onClick={prevSlide}
          className="z-5 cursor-pointer hover:bg-[rgba(0,0,0,0.5)] active:scale-95 border border-gray-300 bg-[rgba(0,0,0,0.2)] text-white shadow absolute top-[40%] left-2 text-xl transition-all duration-200"
          style={{ padding: "1.5rem 0.5rem" }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          onClick={nextSlide}
          className="z-5 cursor-pointer hover:bg-[rgba(0,0,0,0.5)] active:scale-95 border border-gray-300 bg-[rgba(0,0,0,0.2)] text-white shadow absolute top-[40%] right-2 text-xl transition-all duration-200"
          style={{ padding: "1.5rem 0.5rem" }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        <div
          style={{ transform: `translateX(-${950 * index}px)` }}
          className="transition-all duration-500 flex absolute top-0 left-0 w-auto h-full w-auto"
        >
          <div className="w-[950px] h-full">
            <img
              src="https://inwfile.com/s-cg/jt8req.jpg"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="w-[950px] h-full">
            <img
              src="https://inwfile.com/s-cg/12x5jp.jpg"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="w-[950px] h-full">
            <img
              src="https://inwfile.com/s-cg/ayzfna.jpg"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="w-[950px] h-full">
            <img
              src="https://cg.lnwfile.com/_/cg/_raw/7o/b7/73.jpg"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="w-[950px] h-full">
            <img
              src="https://cg.lnwfile.com/_/cg/_raw/6z/ij/47.png"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="w-[950px] h-full">
            <img
              src="https://cg.lnwfile.com/_/cg/_raw/zk/au/kz.jpg"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="w-[950px] h-full">
            <img
              src="https://cg.lnwfile.com/_/cg/_raw/ge/oy/ds.jpg"
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="w-[18%] flex flex-col gap-4 h-full bg-white">
        <div className="border border-[#0c2d1a] w-full h-[47.25%]">
          <img src="/img/banner_1.png" className="w-full h-full" alt="" />
        </div>
        <div className="border border-[#0c2d1a] w-full h-[47.25%]">
          <img src="/img/banner_2.png" className="w-full h-full" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
