import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { axiosInstanse } from "../lib/axios";
import toast from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstanse.get("/notifications"),
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (id) => axiosInstanse.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstanse.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="text-blue-500" />;
      case "comment":
        return <MessageSquare className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" />;
      default:
        return null;
    }
  };
  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.relatedUser.name}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
            <Link
              className="font-bold"
              to={`/profile/${notification.relatedUser.username}`}
            >
              {notification.relatedUser.name}
            </Link>{" "}
            a accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };
  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">
            {relatedPost.content}
          </p>
        </div>
        <ExternalLink size={14} className="text-gray-400" />
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          {isLoading ? (
            <p>Loading notifications...</p>
          ) : notifications && notifications.data.length > 0 ? (
            <ul className="flex flex-col gap-5">
              {notifications.data.map((notification) => (
                <li
                  key={notification._id}
                  className={`bg-white border rounded-lg p-4 transition-all hover:shadow-md ${
                    !notification.read ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4 ">
                      <Link
                        to={`/profile/${notification.relatedUser.username}`}
                      >
                        <img
                          src={
                            notification.relatedUser.profilePicture ||
                            "/avatar.png"
                          }
                          alt={notification.relatedUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </Link>
                      <div className="">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gray-100 rounded-full">
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className="text-sm">
                            {renderNotificationContent(notification)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt),{
                                addSuffix:true
                            })}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                        {!notification.read && (
                            <button className="p-1 text-blue-600 hover:bg-blue-200 transition-colors"
                            onClick={()=>markAsRead(notification._id)}
                            aria-label="Mark as read"
                            >
                                <Eye size={16}/>
                            </button>
                        )}    
                        <button
                            className="p-1 text-red-600 hover:bg-red-200 transition-colors"
                            onClick={()=>deleteNotificationMutation(notification._id)}
                            aria-label="Delete notification"
                        ><Trash2 size={16} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notications at the moment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
