import React, { useState } from "react";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();

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
        onChange={(e) => setName(e.target.value)}
        required
        className="input input-bordered w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setName(e.target.value)}
        required
        className="input input-bordered w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setName(e.target.value)}
        required
        className="input input-bordered w-full"
      />
      <button className="btn btn-primary text-white w-full">Agree & Join</button>
    </form>
  );
};

export default SignUpForm;
