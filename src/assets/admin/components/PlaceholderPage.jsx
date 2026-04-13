// ─── PLACEHOLDER for other screens ───
const PlaceholderPage = ({ title }) => {
  return (
    <div className="p-7 flex items-center justify-center h-96">
      <div className="text-center text-slate-400">
        <div className="text-4xl mb-3">🚧</div>
        <div className="text-lg font-semibold text-slate-600">{title}</div>
        <div className="text-sm mt-1">Trang này chưa được triển khai</div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
