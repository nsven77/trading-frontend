"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.email === "admin@example.com" && data.password === "admin123") {
      // Cookie setzen (Wichtig: Pfad / und SameSite=Lax für HTTP)
      document.cookie = "token=true; path=/; max-age=86400; SameSite=Lax";
      router.push("/");
      router.refresh();
    } else {
      setError("Falsche Zugangsdaten! (Test: admin@example.com / admin123)");
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full max-w-md p-8">
        <div className="mb-8">
          <h3 className="mb-2.5 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Sign In
          </h3>
          <p className="font-medium text-bodydark dark:text-bodydark6">
            Enter your email and password to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="admin123"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="text-meta-1 mb-4 text-sm">{error}</p>}

          <div className="mb-5">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="font-medium text-bodydark dark:text-bodydark6">
              Don't have an account?{" "}
              {/* WICHTIG: Link auf sign-up mit Bindestrich */}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
