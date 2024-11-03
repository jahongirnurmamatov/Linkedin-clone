import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstanse } from "../lib/axios";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstanse.get("/users/suggestions");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong!");
      }
    },
  });
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstanse.get("/posts");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong!");
      }
    },
  });

  console.log(" posts", posts);
  console.log("recommended", recommendedUsers);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar  user={authUser}/>
      </div>
    </div>
  );
};

export default HomePage;
