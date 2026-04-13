// ─── TOPBAR ───
const Topbar = () => {
  return (
    <header
      className="h-15 bg-white border-b border-slate-200 flex items-center px-7 gap-4 sticky top-0 z-40"
      style={{ height: 60 }}
    >
      <div className="flex-1 max-w-sm relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Tìm khóa học, bài học..."
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-slate-50 outline-none focus:border-[#1a3a5c] transition-colors"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center relative hover:bg-slate-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2a4 4 0 00-4 4v3l-1.5 2h11L12 9V6a4 4 0 00-4-4z"
              stroke="#6b7a90"
              strokeWidth="1.5"
            />
            <path
              d="M6.5 13.5a1.5 1.5 0 003 0"
              stroke="#6b7a90"
              strokeWidth="1.5"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800 cursor-pointer">
          BP
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800 leading-none">
            Bình Phạm
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Admin</div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
