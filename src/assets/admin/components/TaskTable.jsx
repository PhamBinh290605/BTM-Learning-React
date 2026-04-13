import { useState } from "react";
import Badge from "./Badge";

const TaskTable = ({ tasks }) => {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Done", "In Progress", "Pending", "Not started"];
  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t[6] === filter);

  const statusStyle = {
    Done: "bg-green-100 text-green-700",
    "In Progress": "bg-indigo-100 text-indigo-700",
    Pending: "bg-yellow-100 text-yellow-800",
    "Not started": "bg-slate-100 text-slate-500",
  };
  const priorityStyle = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-wrap gap-3">
        <span className="text-sm font-semibold text-slate-800">
          Tất cả 30 tasks — Bảng tổng quan
        </span>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filter === s
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              {[
                "Task ID",
                "Tên task",
                "Ưu tiên",
                "Assignee",
                "Timeline",
                "Dependency",
                "Trạng thái",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(
              ([id, name, priority, assignee, timeline, dep, status]) => (
                <tr
                  key={id}
                  className="border-t border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-bold text-slate-700">
                    {id}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 max-w-50">
                    {name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={priorityStyle[priority]}>
                      {priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {assignee}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                    {timeline}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{dep}</td>
                  <td className="px-4 py-3">
                    <Badge className={statusStyle[status]}>{status}</Badge>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
