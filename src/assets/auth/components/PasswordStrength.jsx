const PasswordStrength = ({ password }) => {
  const levels = [
    { min: 0, color: "bg-red-500", label: "Yếu" },
    { min: 4, color: "bg-orange-400", label: "Trung bình" },
    { min: 7, color: "bg-yellow-400", label: "Khá" },
    { min: 10, color: "bg-green-400", label: "Mạnh" },
  ];
  const level = levels.reduce(
    (acc, l) => (password.length >= l.min ? l : acc),
    levels[0],
  );
  const filled = levels.findIndex((l) => l === level) + 1;

  return (
    <div className="flex items-center gap-2 mt-1.5">
      {levels.map((l, i) => (
        <div
          key={i}
          className={`flex-1 h-1 rounded-full transition-all ${i < filled ? level.color : "bg-white/10"}`}
        />
      ))}
      <span className="text-xs text-slate-400 w-16">{level.label}</span>
    </div>
  );
};

export default PasswordStrength;
