import Badge from "./Badge";

const PendingCoursesCard = ({ courses, onApprove, onReject }) => {
  const hasActions = typeof onApprove === "function" && typeof onReject === "function";

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-800">
          Khóa học đang chờ duyệt
        </span>
        <Badge className="bg-yellow-100 text-yellow-800">
          {courses.length} pending
        </Badge>
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
            {courses.length === 0 ? (
              <tr className="border-t border-slate-50">
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                  Không có khóa học nào đang chờ duyệt.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-800">
                      {course.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{course.sub}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {course.instructor}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{course.date}</td>
                  <td className="px-4 py-3">
                    {hasActions ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(course.id)}
                          className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => onReject(course.id)}
                          className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-500">
                        Chỉ quản trị viên mới có thể duyệt
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingCoursesCard;
