import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }

    const emailRegex = /\S+@\S+\.\S+/;

if (!emailRegex.test(formData.email)) {
  return alert("Invalid email");
}

    if (formData.password.length < 6) {
  return alert("Password must be at least 6 characters");
}
  };

  return (
    <div className="min-h-screen bg-[#070817] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_35%)]" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-400 mt-2">
            Join DocuMind AI and start chatting with your documents
          </p>
        </div>

        {error && (
          <p className="text-red-400 mb-4 text-center">{error}</p>
        )}

        <input
          className="w-full mb-4 p-4 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          type="text"
          placeholder="Full Name"
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <input
          className="w-full mb-4 p-4 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          type="email"
          placeholder="Email Address"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <input
          className="w-full mb-4 p-4 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <button className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 p-4 rounded-xl font-semibold transition">
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center mt-6 text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-300 hover:text-cyan-200"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;