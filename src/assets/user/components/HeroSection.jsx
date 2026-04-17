import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "12K+", label: "Khóa học" },
    { value: "500K+", label: "Học viên" },
    { value: "1.2K+", label: "Giảng viên" },
    { value: "98%", label: "Hài lòng" },
  ];

  const quickTags = ["ReactJS", "UI/UX Design", "Python", "Marketing", "AI"];

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-[#0a0f1e] dark:via-[#0f1629] dark:to-[#0a0f1e]" />

      {/* Decorative floating orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-white/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-violet-400/10 dark:bg-violet-600/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="hidden dark:block absolute top-10 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Platform badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full text-sm font-medium text-white/90 dark:text-indigo-300 mb-8 border border-white/20 dark:border-indigo-500/20 animate-fade-in-up">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Nền tảng học trực tuyến #1 Việt Nam
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Khám phá tiềm năng
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              không giới hạn
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/70 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hàng nghìn khóa học chất lượng cao từ các giảng viên hàng đầu. Học
            mọi lúc, mọi nơi với lộ trình được cá nhân hóa.
          </p>

          {/* Search bar */}
          <div className="mb-6">
            <SearchBar
              variant="hero"
              onSearch={(term) => navigate(`/courses?search=${term}`)}
            />
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            <span className="text-sm text-white/40 dark:text-slate-500 py-1.5">
              Phổ biến:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/courses?search=${tag}`)}
                className="px-3 py-1.5 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg text-sm text-white/80 dark:text-slate-400 dark:hover:text-slate-300 transition-colors border border-white/10 dark:border-white/5"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-white/10 dark:border-white/5">
            {stats.map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 group-hover:scale-110 transition-transform origin-center">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 dark:text-slate-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 69.3C960 69.3 1056 58.7 1152 48C1248 37.3 1344 26.7 1392 21.3L1440 16V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
            className="fill-white dark:fill-slate-950"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
