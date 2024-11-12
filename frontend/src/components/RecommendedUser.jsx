import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstanse } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";
const RecommendedUser = ({ user }) => {
  const queryClient = useQueryClient();
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connnectionStatus", user._id],
    queryFn: () => axiosInstanse.get(`/connection/status/${user._id}`),
  });

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) => axiosInstanse.post(`/connection/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent succesfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionRequests", user._id],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstanse.post(`/connection/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      queryClient.invalidateQueries({
        queryKey: ["connectionRequests", user._id],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
  const { mutate: rejectRequests } = useMutation({
    mutationFn: (requestId) =>
      axiosInstanse.post(`/connection/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      queryClient.invalidateQueries({
        queryKey: ["connectionRequests", user._id],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const renderButton = () => {
    if (isLoading) {
      return (
        <button
          className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500"
          disabled
        >
          Loading...
        </button>
      );
    }
    switch (connectionStatus?.data?.status) {
      case "pending":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1" /> Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() =>
                acceptConnectionRequest(connectionStatus?.data?.requestId)
              }
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectRequests(connectionStatus?.data?.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className="px-3 rounded-full bg-green-500 text-white flex items-center "
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionRequest(user._id)}
            className="px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary
           hover:text-white transition-colors duration-200 flex items-center"
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };

  const handleConnect = () => {
    if (connectionStatus?.data?.status === "not_connected") {
      sendConnectionRequest(user._id);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center flex-grow"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full mr-3"
        />
        <div className="">
          <h3 className="font-semibold text-sm">{user.name}</h3>
          <p className="text-info text-xs">{user.headline}</p>
        </div>
      </Link>
      {renderButton()}
    </div>
  );
};

export default RecommendedUser;
