import Comment from '@/components/layout/comment'
import React from 'react'
import { FaTimes } from 'react-icons/fa'

const CommentsBlog = ({fetchComment,blogs,onclose}) => {
  return (
    <div className='w-full h-full fixed top-0 ledt-0 z-40 bg-[rgba(255,255,255,0.8)] flex items-center justify-center'>
        <div className="w-[40%] h-[80vh] overflow-auto relative bg-white rounded-lg border shadow-md shadow-gray-700 flex flex-col" style={{padding:" 1rem 1.5rem",marginTop:"4rem"}}>
            <button onClick={onclose} className='text-lg absolute top-2 right-2 rounded-full hover:bg-red-600 hover:text-white' style={{padding:"0.35rem"}}>
                <FaTimes/>
            </button>
            <Comment type={"blogs"} updateData={fetchComment} mainId={blogs?._id}  commentList={blogs.comment_id}/>
        </div>
    </div>
  )
}

export default CommentsBlog