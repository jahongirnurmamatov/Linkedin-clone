import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { axiosInstanse } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
  const querClient = useQueryClient();

  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId) => axiosInstanse.post(`/connection/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connectiion request accepted");
      querClient.invalidateQueries({ queryKey: "connectionRequests" });
    },
    onError: (error) =>
      toast.error(error.response.data.message || "Something went wrong"),
  });
  const { mutate: rejectConnectionRequest } = useMutation({
    mutationFn: (requestId) => {
      axiosInstanse.post(`connection/reject/${requestId}`);
    },
    onSuccess: () => {
      toast.success("Connectiion request rejected");
      querClient.invalidateQueries({ queryKey: "connectionRequests" });
    },
    onError: (error) =>
      toast.error(error.response.data.message || "Something went wrong"),
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request?.sender.username}`}>
          <img
            src={request?.sender.profilePicture || "/avatar.png"}
            alt={request?.sender.name}
            className="size-16 rounded-full object-cover"
          />
        </Link>
        <div className="">
          <Link to={`/profile/${request?.sender.username}`}>
            {request?.sender.name}
          </Link>
          <p className="text-gray-600"> {request?.sender.headline}</p>
        </div>
      </div>
      <div className="space-x-2">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          Accept
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          Reject
        </button>
        
      </div>
    </div>
  );
};

export default FriendRequest;
