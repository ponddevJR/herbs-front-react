import React from 'react'

const HerbsComponents = ({herbs,categories}) => {
  return (
    <>
    <div className="w-full flex flex-col gap-5">
    <div className="w-full flex flex-col items-center border-b-2 border-t-2 bg-green-950  border-green-600" style={{padding:"1rem"}}>
      <label htmlFor="" className='text-lg font-bold text-white'>สมุนไพรทั้งหมด</label>
    </div>
     <div className='bg-gray-50 w-full grid grid-cols-4 gap-[0.85rem] gap-y-[2.2rem]'>
      {
        herbs.length > 0 ?
        herbs.slice().reverse().slice(0,40).map((h) => {
          return <a href={`/herbdetail/${h?._id}`}className='bg-white cursor-pointer shadow transition-all duration-400 hover:-translate-y-5 hover:shadow-lg hover:shadow-gray-400 border-b-4 border-green-600 w-[18vw] h-[45vh] flex flex-col gap-1'>
                  <div className="w-full h-[42%] overflow-hidden rounded-tr-lg rounded-tl-lg">
                    <img src={h?.imgs[0].startsWith("i") ? import.meta.env.VITE_IMG_URL+h?.imgs[0] : h?.imgs[0]} className='w-full h-full object-cover' alt="" />
                  </div>
                  <div className="flex flex-col gap-1" style={{padding:"0.35rem"}}>
                    <label htmlFor="" className='text-xl font-bold'>{h?.name_th}</label>
                    <label htmlFor="" className='text-[0.8rem] text-gray-600'>
                      {
                        categories?.filter((c) => h?.categories?.includes(c._id)).map((c) => c.ctg_name).join(", ").slice(0,38) +'...'
                      }
                    </label>
                    <p className='w-full leading-relaxed text-[0.85rem]'>
                      {
                        h?.benefits?.length > 150 
                        ? h?.benefits?.slice(0,155)+'...' : h?.benefits
                      }
                    </p>
                    <label htmlFor="" className='text-[0.8rem] text-gray-600'>
                      แก้ไขล่าสุด {new Date(h?.updatedAt).toLocaleDateString("th-TH")} {new Date(h?.updatedAt).toLocaleTimeString("th-TH")}
                    </label>
                  </div>
                </a>
        })
        : <div className=""></div>
      }
        
    </div>
    </div>
    </>
  )
}

export default HerbsComponents