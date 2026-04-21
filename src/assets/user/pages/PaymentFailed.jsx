import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PENDING_PAYMENT_COURSE_KEY = "btm_pending_payment_course_id";

const REASON_MESSAGES = {
  invalid_signature: "Chữ ký giao dịch không hợp lệ. Vui lòng liên hệ hỗ trợ.",
  unknown_status: "Không xác định được trạng thái thanh toán.",
  vnp_24: "Giao dịch đã bị hủy bởi khách hàng.",
  vnp_11: "Giao dịch hết hạn chờ thanh toán.",
  vnp_12: "Tài khoản bị khóa.",
  vnp_75: "Ngân hàng thanh toán đang bảo trì.",
  vnp_99: "Lỗi không xác định từ cổng thanh toán.",
};

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const txnRef = searchParams.get("txnRef") || "";
  const reason = searchParams.get("reason") || "";
  const courseIdFromQuery = searchParams.get("courseId") || "";
  const pendingCourseId = localStorage.getItem(PENDING_PAYMENT_COURSE_KEY);
  const targetCourseId = pendingCourseId || courseIdFromQuery;

  const reasonMessage = REASON_MESSAGES[reason] || (reason ? `Mã lỗi: ${reason}` : "Giao dịch không thành công.");

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/30 px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full">
        {/* Failed Card */}
        <div className="relative rounded-3xl border border-red-500/15 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 text-center overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />

          {/* Error icon */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" style={{ animationDuration: "3s" }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Thanh toán chưa thành công
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            {reasonMessage}
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Bạn có thể thử lại thanh toán hoặc chọn phương thức khác.
          </p>

          {/* Transaction info */}
          {(!!txnRef || !!reason) && (
            <div className="mt-5 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 space-y-1.5">
              {!!txnRef && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400">Mã giao dịch:</span>
                  <span className="text-sm font-mono font-semibold text-slate-300">{txnRef}</span>
                </div>
              )}
              {!!reason && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-400">Mã lỗi:</span>
                  <span className="text-xs font-mono text-red-400">{reason}</span>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!!targetCourseId && (
              <button
                type="button"
                onClick={() => navigate(`/course/${targetCourseId}`)}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Thử thanh toán lại
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="w-full sm:w-auto rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Xem khóa học khác
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Về trang chủ
            </button>
          </div>

          {/* Help text */}
          <p className="mt-6 text-xs text-slate-500">
            Nếu số tiền đã bị trừ nhưng không nhận được khóa học, vui lòng liên hệ{" "}
            <span className="text-indigo-400 font-medium">support@btmlearning.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
