import { useState } from "react";
import SocialButton from "../components/SocialButton";
import Divider from "../components/Divider";
import InputField from "../components/InputField";
import EyeIcon from "../components/EyeIcon";
import { loginApi, googleLoginUrl } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getRoleFromToken } from "../../../utils/jwt";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleGoogleLogin = () => {
    window.location.href = googleLoginUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginApi(form.email, form.password);

      const { code, result, message } = response.data;

      if (code === 1000) {
        const { accessToken, refreshToken, user } = result;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // 🔥 decode role từ token
        const role = getRoleFromToken(accessToken);

        toast.success("Đăng ký thành công! Chào mừng " + user.fullName);

        // 🔥 redirect theo role
        if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "INSTRUCTOR") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(message || "Đăng nhập thất bại");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Email hoặc mật khẩu không đúng";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">
          Chào mừng trở lại 👋
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Đăng nhập để tiếp tục hành trình học tập
        </p>
      </div>

      <SocialButton onClick={handleGoogleLogin} />

      <Divider />

      {/* {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
          {error}
        </div>
      )} */}

      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set("email")}
        required
      />

      <InputField
        label="Mật khẩu"
        type={showPass ? "text" : "password"}
        placeholder="••••••••"
        value={form.password}
        onChange={set("password")}
        required
      >
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <EyeIcon open={showPass} />
        </button>
      </InputField>

      <div className="flex justify-end -mt-2">
        <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Quên mật khẩu?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 
          ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98]'}`}
      >
        {loading ? "Đang xác thực..." : "Đăng nhập"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          onClick={() => navigate("/auth/register")}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Đăng ký miễn phí
        </button>
      </p>
    </form>
  );
};

export default LoginPage;
