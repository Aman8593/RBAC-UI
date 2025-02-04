import Image from "next/image";
import React from "react";
import Link from "next/link";
// import { useRouter } from 'next/navigation';

const BlogItem = ({ blog }) => {
  const { id, title, imageUrl, description, category } = blog || {};
  
  return (
    <div className="bg-gray-900 p-4 border-2 border-green-200 mx-2 my-2 rounded-lg shadow-md">
      <Link href={`/blogs/${id}`}>
        <img
          // blurDataURL={imageUrl}
          placeholder="blur"
          loading="lazy"
          width="600"
          height="400"
          quality={100}
          src={imageUrl}
          className="w-full h-[200px]  lg:h-[250px] object-cover mb-4 rounded-md"
        />
      </Link>
      <Link href={`/blogs/${id}`}>
        <h2 className="text-xl text-white font-semibold mb-2">{title}</h2>
      </Link>

      <h3 className="mb-2 max-w-md text-green-500 inline-block border-2 p-2 border-green-300 rounded-full">
        {category}
      </h3>

      <p className="text-gray-300">{description.slice(0, 100)}...</p>
    </div>
  );
};

export default BlogItem;
