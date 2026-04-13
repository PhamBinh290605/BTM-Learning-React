const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        {children}
      </div>
    </div>
  );
};

export default InputField;
