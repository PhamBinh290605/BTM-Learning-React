import Badge from "./Badge";

const PendingCoursesCard = ({ courses, onApprove, onReject }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-800">
          Khóa học đang chờ duyệt
        </span>
        <Badge className="bg-yellow-100 text-yellow-800">3 pending</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                Khóa học
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                Giảng viên
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                Ngày gửi
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr
                key={i}
                className="border-t border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-slate-800">
                    {c.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.sub}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {c.instructor}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{c.date}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(i)}
                      className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => onReject(i)}
                      className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingCoursesCard;
