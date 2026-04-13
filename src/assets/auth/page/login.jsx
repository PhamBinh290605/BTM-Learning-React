import { useState } from "react";
import SocialButton from "../components/SocialButton";
import Divider from "../components/Divider";
import InputField from "../components/InputField";
import EyeIcon from "../components/EyeIcon";

const LoginPage = (props) => {
  const onSwitch = props.onSwitch;
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-white text-2xl font-bold tracking-tight">
          Chào mừng trở lại 👋
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Đăng nhập để tiếp tục hành trình học tập
        </p>
      </div>

      <SocialButton />
      <Divider />

      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set("email")}
      />

      <InputField
        label="Mật khẩu"
        type={showPass ? "text" : "password"}
        placeholder="••••••••"
        value={form.password}
        onChange={set("password")}
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
        <a
          href="#"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Quên mật khẩu?
        </a>
      </div>

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20">
        Đăng nhập
      </button>

      <p className="text-center text-sm text-slate-400">
        Chưa có tài khoản?{" "}
        <button
          onClick={onSwitch}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Đăng ký miễn phí
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
