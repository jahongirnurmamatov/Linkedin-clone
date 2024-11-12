import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/layout/Layout";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstanse } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworksPage from "./pages/NetworksPage";
import PostPage from "./pages/PostPage";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstanse.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong!");
      }
    },
  });

  if (isLoading) {
    return null;
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/network"
          element={authUser ? <NetworksPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
