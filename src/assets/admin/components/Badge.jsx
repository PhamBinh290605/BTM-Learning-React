const Badge = (props) => {
  const { children, className } = props;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
