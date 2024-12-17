"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  // State for inputs and errors
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard"); // Redirect after successful sign-in
      }
    } catch (err: any) {
      setError(err.errors[0]?.message || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-4"
      >
        {/* Logo and heading */}
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={24} height={24} />
          SchooLama
        </h1>
        <h2 className="text-gray-400">Sign in to your account</h2>

        {/* Error message */}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* Username Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="p-2 rounded-md ring-1 ring-gray-300"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded-md ring-1 ring-gray-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md text-sm p-[10px]"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
