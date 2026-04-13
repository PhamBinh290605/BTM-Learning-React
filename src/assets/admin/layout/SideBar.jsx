import NavIcon from "../components/NavIcon";

const Sidebar = (props) => {
  const { active, handleNav, NAV_ITEMS } = props;

  return (
    <aside className="w-60 bg-[#1a3a5c] fixed top-0 left-0 h-screen overflow-y-auto z-50 flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="font-serif text-xl text-white font-bold tracking-tight">
          Edu<span className="text-amber-400">Bright</span>
        </div>
        <div className="text-xs text-white/40 mt-1">BTM-Learning Platform</div>
      </div>

      {NAV_ITEMS.map((section) => (
        <div key={section.label} className="px-3 pt-4 pb-1">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-2">
            {section.label}
          </div>
          {section.items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-all text-left ${
                active === item.id
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <NavIcon id={item.icon} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
