import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstanse } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
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
    mutationFn: async (newComment) => {
      await axiosInstanse.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
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
  const handleLikePost = async () => {
    if (isLikingPost) {
      return;
    }
    likePost();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...post.comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
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
              <p className="text-info font-xs">{post?.author.headline}</p>
              <p className="text-info font-xs">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
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
      {showComment && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-2 rounded flex items-start"
              >
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="size-8 rounded-full mr-2 flex-shrink-0"
                />

                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                      <span className="ml-2 text-info text-xs">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </span>
                    <p>{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form className="flex items-center " onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Add a comment ..."
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              disabled={isCreatingComment}
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
            >
              {isCreatingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
