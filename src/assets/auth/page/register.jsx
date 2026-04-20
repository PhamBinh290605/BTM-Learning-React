import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerApi, googleLoginUrl } from "../../../api/auth";
import SocialButton from "../components/SocialButton";
import Divider from "../components/Divider";
import InputField from "../components/InputField";
import EyeIcon from "../components/EyeIcon";
import PasswordStrength from "../components/PasswordStrength";
import { getRoleFromToken } from "../../../utils/jwt";
import { getDefaultRouteByRole, saveSession } from "../../../utils/session";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false); // Mặc định nên để false để ép người dùng tích vào
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Bạn phải đồng ý với điều khoản dịch vụ");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        email: form.email,
        password: form.password,
        fullName: `${form.firstName} ${form.lastName}`.trim() // Gộp họ và tên
      };

      const response = await registerApi(requestData);
      const data = response.data;
      if (data.code === 1000) {
        const { accessToken, refreshToken, user } = data.result;

        saveSession({ accessToken, refreshToken, user });

        toast.success("Đăng ký thành công! Chào mừng " + user.fullName);

        const role = getRoleFromToken(accessToken);

        setTimeout(() => {
          navigate(getDefaultRouteByRole(role));
        }, 1000);
      } else {
        toast.error(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Email đã tồn tại hoặc dữ liệu không hợp lệ";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Bọc toàn bộ vào thẻ <form> để xử lý submit dễ dàng
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">
          Tạo tài khoản ✨
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Bắt đầu hành trình học tập hôm nay — miễn phí
        </p>
      </div>

      <SocialButton onClick={() => window.location.href = googleLoginUrl} />
      <Divider />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Họ"
          placeholder="Nguyễn"
          value={form.firstName}
          onChange={setField("firstName")}
          required
        />
        <InputField
          label="Tên"
          placeholder="Văn A"
          value={form.lastName}
          onChange={setField("lastName")}
          required
        />
      </div>

      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={setField("email")}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Ít nhất 8 ký tự"
            value={form.password}
            onChange={setField("password")}
            required
            className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <EyeIcon open={showPass} />
          </button>
        </div>
        {form.password && <PasswordStrength password={form.password} />}
      </div>

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-all ${agreed
            ? "bg-indigo-600 border-indigo-600"
            : "bg-transparent border-white/20"
            }`}
        >
          {agreed && (
            <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4l3 3 5-6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <span className="text-xs text-slate-400 leading-relaxed">
          Tôi đồng ý với{" "}
          <a href="#" className="text-indigo-400 hover:underline">Điều khoản dịch vụ</a> và{" "}
          <a href="#" className="text-indigo-400 hover:underline">Chính sách bảo mật</a>
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 
          ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-500 active:scale-[0.98]'}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
            Đang tạo tài khoản...
          </span>
        ) : "Tạo tài khoản miễn phí"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
};

export default RegisterPage;