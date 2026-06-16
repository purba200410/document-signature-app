import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const passwordChecks = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special:
      /[@$!%*?&]/.test(password),
  };

  const isPasswordValid =
    Object.values(passwordChecks).every(
      Boolean
    );

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert(
        "Please satisfy all password requirements."
      );
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      navigate("/");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-[420px]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-3 mb-4 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 mb-4 rounded"
          required
        />

        <div className="relative">
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border p-3 rounded"
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-3 top-3 text-blue-600 text-sm"
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        <div className="mt-3 mb-4 text-sm">
          <p
            className={
              passwordChecks.minLength
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordChecks.minLength
              ? "✅"
              : "❌"}{" "}
            Minimum 8 characters
          </p>

          <p
            className={
              passwordChecks.uppercase
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordChecks.uppercase
              ? "✅"
              : "❌"}{" "}
            One uppercase letter
          </p>

          <p
            className={
              passwordChecks.lowercase
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordChecks.lowercase
              ? "✅"
              : "❌"}{" "}
            One lowercase letter
          </p>

          <p
            className={
              passwordChecks.number
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordChecks.number
              ? "✅"
              : "❌"}{" "}
            One number
          </p>

          <p
            className={
              passwordChecks.special
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordChecks.special
              ? "✅"
              : "❌"}{" "}
            One special character
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;