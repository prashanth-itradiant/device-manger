import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUser, loginUser } from "../redux/authSlice";
import Toast from "../utlis/toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Get previous path before redirecting to login
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (data) {
      navigate("/", { replace: true });
    }
  }, [data, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Toast.fire({
        icon: "warning",
        title: "Please enter both email and password.",
      });
      return; // ⛔️ Prevent further execution if inputs are missing
    }

    const formData = { email, password }; // ✅ Define this after validation

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      Toast.fire({
        icon: "success",
        title: `Welcome, ${result.payload.name}!`,
      });

      await dispatch(fetchUser()); // Optional: fetch updated user info
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    } else {
      Toast.fire({
        icon: "error",
        title: result.payload || "Login failed!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-indigo-50">
          <img
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?ga=GA1.1.1801903693.1742473935&semt=ais_hybrid"
            className="w-full h-full object-cover"
            alt="Login Illustration"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Welcome Back!
          </h2>
          <h3 className="text-lg font-medium text-center text-gray-500 mt-2">
            Sign in to your account
          </h3>

          <form className="mt-6" onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold text-base mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold text-base mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <a
                href="#"
                className="text-indigo-500 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold text-base hover:bg-indigo-700 transition shadow-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-base">
            Don't have an account?
            <a
              href="#"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
