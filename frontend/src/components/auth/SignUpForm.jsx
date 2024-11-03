import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstanse } from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const queryClient = useQueryClient();

  const { mutate: signupMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstanse.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      queryClient.invalidateQueries(["authUser"]); 
    },
    onError: (err) => {
      console.log(err.response.data.message);
      toast.error(err.response.data.message || "Something went wrong!");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signupMutation({ name, username, email, password });

    console.log(name, email, password, username);
  };
  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input input-bordered w-full"
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="input input-bordered w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input input-bordered w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="input input-bordered w-full"
      />
      <button className="btn btn-primary text-white w-full">
        {isLoading ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
