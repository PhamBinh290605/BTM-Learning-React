import GoogleIcon from "./GoogleIcon";

const SocialButton = ({ onClick }) => {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] rounded-xl py-3 text-sm text-slate-200 font-medium transition-all active:scale-[0.99]"
      >
        <GoogleIcon />
        <span>Tiếp tục với Google</span>
      </button>
    </div>
  );
};

export default SocialButton;