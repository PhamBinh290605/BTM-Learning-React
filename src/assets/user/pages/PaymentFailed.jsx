import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PENDING_PAYMENT_COURSE_KEY = "btm_pending_payment_course_id";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const txnRef = searchParams.get("txnRef") || "";
  const reason = searchParams.get("reason") || "";
  const courseIdFromQuery = searchParams.get("courseId") || "";
  const pendingCourseId = localStorage.getItem(PENDING_PAYMENT_COURSE_KEY);
  const targetCourseId = pendingCourseId || courseIdFromQuery;

  return (
    <div className="min-h-[70vh] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-amber-500/20 bg-slate-900/90 p-6 text-center sm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
          !
        </div>
        <h1 className="text-xl font-bold text-white">Thanh toán chưa thành công</h1>
        <p className="mt-2 text-sm text-slate-300">
          Bạn có thể thử lại thanh toán hoặc quay về trang khóa học để đăng ký lại.
        </p>

        {!!txnRef && <p className="mt-3 text-xs text-slate-400">Mã giao dịch: {txnRef}</p>}
        {!!reason && <p className="mt-1 text-xs text-slate-500">Lý do: {reason}</p>}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {!!targetCourseId && (
            <button
              type="button"
              onClick={() => navigate(`/course/${targetCourseId}`)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Quay lại khóa học
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
          >
            Xem khóa học khác
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
          >
            Về trang chính
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
