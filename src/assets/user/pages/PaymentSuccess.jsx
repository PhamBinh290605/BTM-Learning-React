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
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, targetCourseId]);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full">
        {/* Success Card */}
        <div className="relative rounded-3xl border border-emerald-500/20 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 text-center overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />

          {/* Animated checkmark */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Thanh toán thành công! 🎉
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            Giao dịch của bạn đã được xác nhận. Bạn có thể bắt đầu học ngay bây giờ.
          </p>

          {/* Transaction info */}
          {!!txnRef && (
            <div className="mt-5 inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5">
              <span className="text-xs text-slate-400">Mã giao dịch:</span>
              <span className="text-sm font-mono font-semibold text-emerald-400">{txnRef}</span>
            </div>
          )}

          {/* Auto redirect countdown */}
          <p className="mt-5 text-xs text-slate-500">
            Tự động chuyển hướng sau 5 giây...
          </p>

          {/* Action buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!!targetCourseId && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(PENDING_PAYMENT_COURSE_KEY);
                  navigate(`/learning/${targetCourseId}`);
                }}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-bold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Vào học ngay
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/my-learning")}
              className="w-full sm:w-auto rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Khóa học của tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
