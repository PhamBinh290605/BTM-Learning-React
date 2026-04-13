// ─── SUB-COMPONENTS ───
const StatCard = (props) => {
  const { label, value, change, up, iconBg, icon } = props;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-[#1a3a5c]">{value}</div>
      <div
        className={`text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}
      >
        {change}
      </div>
    </div>
  );
};

export default StatCard;
