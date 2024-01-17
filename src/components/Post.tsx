import React from "react";

interface PostProps {
  post: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    created_at: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    // Container for the  post
    <div className="container mx-auto mt-8" key={post.id}>
      {/* Card-like container for the  post */}
      <div className="relative max-w-full rounded overflow-hidden shadow-lg">
        {/* Post image */}
        <img
          src={post.thumbnail_url}
          alt={post.title}
          className="w-full h-64 object-cover object-center"
        />
        {/* Shaded line with Created Date on top of the image */}
        <div className="absolute top-0 left-0 w-full bg-black bg-opacity-40 text-white text-center py-2">
          {/* Display the formatted created date */}
          <span className="text-sm font-semibold">
            Created at: {post.created_at}
          </span>
        </div>
        {/* Post content area */}
        <div className="px-6 py-4">
          {/* Post title */}
          <div className="font-bold text-xl mb-2">{post.title}</div>
          {/* Post description */}
          <p className="text-gray-700 text-base">{post.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
