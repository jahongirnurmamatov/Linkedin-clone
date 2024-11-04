import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstanse } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader, MessageCircle, Share2, ThumbsUp, Trash2 } from "lucide-react";
import PostAction from "./PostAction";

const Post = ({ post }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComment, setShowComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstanse.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted succesfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });

  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: async (comment) => {
      await axiosInstanse.post(`/posts/${post._id}/comment`, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstanse.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Like added successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      return deletePost(post._id);
    }
  };
  const handleLikePost = async() => {
    if(isLikingPost){return}
    likePost();
  };

  return (
    <div className="bg-secondary rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center mb-4 justify-between">
          <div
            className="flex gap-2 items-center"
            to={`/profile/${post?.author?.username}/`}
          >
            <img
              src={post?.authUser?.profilePicture || "/avatar.png"}
              alt={post.author.name}
              className="size-10 rounded-full mr-3"
            />
            <Link to={`/profile/${post?.author?.username}`}>
              <h3 className="font-semibold">{post?.author.name}</h3>
              <p className="text-gray-500 font-xs">Linkedin user</p>
            </Link>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}
        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500 fill-blue-300" : ""}
              />
            }
            text={`Like ${post.likes.length}`}
            onClick={handleLikePost}
          />
          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment ${post.comments.length}`}
            onClick={() => setShowComment(!showComment)}
          />
          <PostAction icon={<Share2 size={18} />} text={`Share`} />
        </div>
      </div>
    </div>
  );
};

export default Post;
