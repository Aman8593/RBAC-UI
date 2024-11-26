import React from 'react'

const CommentDetails = ({params}) => {
    console.log(params);
    console.log("blog Id :",params?.id);
    console.log("Comment Id:",params?.commentId);

  return (
    <div>CommentDetails: { }</div>
  )
}

export default CommentDetails