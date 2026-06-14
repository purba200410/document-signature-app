import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res =
        await API.post("/auth/login", {
          email,
          password,
        });

      login(res.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-2">
          Sign In
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-1"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}