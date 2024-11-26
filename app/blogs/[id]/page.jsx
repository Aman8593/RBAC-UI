import React from 'react'

const BlogDetails = ({params}) => {
    const id = params?.id
  return (
    <div>BlogDetails : {id}</div>
  )
}

export default BlogDetails