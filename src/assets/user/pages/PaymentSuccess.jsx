import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PENDING_PAYMENT_COURSE_KEY = "btm_pending_payment_course_id";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const txnRef = searchParams.get("txnRef") || "";
  const courseIdFromQuery = searchParams.get("courseId") || "";
  const pendingCourseId = localStorage.getItem(PENDING_PAYMENT_COURSE_KEY);
  const targetCourseId = pendingCourseId || courseIdFromQuery;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (targetCourseId) {
        localStorage.removeItem(PENDING_PAYMENT_COURSE_KEY);
        navigate(`/learning/${targetCourseId}`, { replace: true });
        return;
      }

      navigate("/my-learning", { replace: true });
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, targetCourseId]);

  return (
    <div className="min-h-[70vh] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-500/20 bg-slate-900/90 p-6 text-center sm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          OK
        </div>
        <h1 className="text-xl font-bold text-white">Thanh toán thành công</h1>
        <p className="mt-2 text-sm text-slate-300">Hệ thống đang đưa bạn tới khóa học vừa đăng ký.</p>

        {!!txnRef && <p className="mt-3 text-xs text-slate-400">Mã giao dịch: {txnRef}</p>}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {!!targetCourseId && (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(PENDING_PAYMENT_COURSE_KEY);
                navigate(`/learning/${targetCourseId}`);
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Vào học ngay
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/my-learning")}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
          >
            Đến khóa học của tôi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
