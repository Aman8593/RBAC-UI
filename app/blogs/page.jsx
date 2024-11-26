import { fetchBlogs } from "@/actions/actions";
import { Prisma, PrismaClient } from "@prisma/client";
import React from "react";
import BlogItem from "../components/BlogItem";

const prisma = new PrismaClient();
const Blogs = async () => {
  const blogs = await fetchBlogs();
  console.log("new", blogs);
  return (
    <div>
      <h2 className="text-center mt-4 px-2 text-2xl py-2 font-bold">
        All Blogs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 mb-5 px-4 py-5">
        {blogs?.length > 0 &&
          blogs.map((blog) => <BlogItem key={blog?.id} blog={blog} />)}
      </div>
    </div>
  );
};

export default Blogs;
