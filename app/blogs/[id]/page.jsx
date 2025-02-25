import { fetchSingleBlog } from "@/actions/actions";
import CommentAddForm from "@/app/components/forms/CommentAddForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogDetails = async ({ params }) => {
  const id = params?.id;
  const blog = await fetchSingleBlog(id);
  return (
    <>
      <div className="text-center bg-gray-800 rounded-md border-2 border-green-600 shadow-md px-4 py-2 mx-3 my-3">
        {blog?.imageUrl ? (
          <Image
            blurDataURL={blog?.imageUrl}
            placeholder="blur"
            loading="lazy"
            quality={100}
            src={blog?.imageUrl}
            alt={blog?.title}
            width="600"
            height="400"
            className="w-full h-[600px] mt-2 px-2 py-2 object-cover mb-2 rounded-sm shadow-sm"
          />
        ) : null}

        <h3 className="mb-2 max-w-md mt-5 text-green-500 inline-block border-2 p-2 border-green-300 rounded-full">
          {blog?.category}
        </h3>
        <h3 className="font-semibold text-center text-2xl text-gray-200 my-2 mx-2 px-2 py-2">
          {blog?.title}
        </h3>

        <p className="text-center text-gray-300 my-5 mx-2 px-2 py-5">
          {blog?.description}
        </p>
        <Link
          className="text-gray-700 bg-gray-200 my-4 border-2 py-2 text-center  rounded-lg border-gray-400 shadow-sm mx-2  px-2"
          href={`/blogs/update-blog/${blog?.id}`}
        >
          Update Blog
        </Link>
      </div>
      <CommentAddForm />
    </>
  );
};

export default BlogDetails;
