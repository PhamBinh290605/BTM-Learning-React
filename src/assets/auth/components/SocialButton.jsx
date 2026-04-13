import FacebookIcon from "./FacebookIcon";
import GoogleIcon from "./GoogleIcon";

const SocialButton = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] rounded-xl py-2.5 text-sm text-slate-300 font-medium transition-all">
        <GoogleIcon /> Google
      </button>
      <button className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] rounded-xl py-2.5 text-sm text-slate-300 font-medium transition-all">
        <FacebookIcon /> Facebook
      </button>
    </div>
  );
};

export default SocialButton;
