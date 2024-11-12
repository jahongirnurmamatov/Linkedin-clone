import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { axiosInstanse } from "../lib/axios";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const PostPage = () => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      try {
        const res = await axiosInstanse.get(`/posts/${postId}`);
        return res.data;
      } catch (error) {
        toast.error("Failed to fetch post");
        return null;
      }
    },
  });

  console.log(post)
  if (postLoading) {
    return <div>Loading post...</div>;
  }
  if (!post) return <div>Post not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <Post post={post} />
      </div>
    </div>
  );
};

export default PostPage;
