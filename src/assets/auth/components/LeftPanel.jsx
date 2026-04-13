const LeftPanel = (props) => {
  const courses = props.courses;
  const stats = props.stats;
  return (
    <div className="relative hidden lg:flex flex-col gap-7 bg-[#0f172a] p-9 overflow-hidden border-r border-white/[0.07]">
      {/* Orbs */}
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

      {/* Brand */}
      <div className="relative flex items-center gap-2.5 z-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9" />
            <path
              d="M2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="text-white text-[17px] font-bold tracking-tight">
          BTM<span className="text-indigo-400">.</span>learning
        </span>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/30 rounded-full px-3 py-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-indigo-300 text-xs font-medium">
            Nền tảng học trực tuyến
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold leading-snug tracking-tight">
          Nâng tầm kỹ năng
          <br />
          của bạn <span className="text-sky-400">mỗi ngày</span>
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed">
          Khám phá hàng nghìn khóa học từ chuyên gia hàng đầu. Học theo tiến độ
          của bạn, bất cứ lúc nào, bất cứ nơi đâu.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-1">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-3"
            >
              <div className="text-white text-lg font-bold">{s.num}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Course preview */}
      <div className="relative z-10 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 mt-auto">
        <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-3">
          Khóa học phổ biến
        </div>
        <div className="flex flex-col gap-0">
          {courses.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-3 ${i < courses.length - 1 ? "border-b border-white/[0.06]" : ""}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm shrink-0">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 text-[13px] font-medium truncate">
                  {c.name}
                </div>
                <div className="text-slate-500 text-[11px]">{c.meta}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <span className="text-slate-400 text-[11px] w-7 text-right">
                  {c.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
