import Badge from "./Badge";

const SprintCard = ({ tasks }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-800">
          Task Progress — Sprint
        </span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {tasks.map((t) => (
          <div key={t.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-700 font-medium">
                {t.id} {t.name}
              </span>
              <Badge className={t.badgeClass}>{t.status}</Badge>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${t.progress === 100 ? "bg-green-500" : "bg-amber-400"}`}
                style={{ width: `${t.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintCard;
