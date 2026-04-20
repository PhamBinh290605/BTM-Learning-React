import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const PENDING_PAYMENT_COURSE_KEY = "btm_pending_payment_course_id";

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const status = String(searchParams.get("status") || "").toLowerCase();
  const txnRef = searchParams.get("txnRef") || "";
  const pendingCourseId = localStorage.getItem(PENDING_PAYMENT_COURSE_KEY);
  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess) {
      toast.success("Thanh toán thành công. Đang chuyển đến màn hình học...");

      const timeoutId = window.setTimeout(() => {
        if (pendingCourseId) {
          navigate(`/learning/${pendingCourseId}`, { replace: true });
          return;
        }

        navigate("/my-learning", { replace: true });
      }, 900);

      localStorage.removeItem(PENDING_PAYMENT_COURSE_KEY);

      return () => window.clearTimeout(timeoutId);
    }

    if (status === "failed") {
      toast.error("Thanh toán thất bại hoặc đã bị hủy.");
      return undefined;
    }

    if (status === "invalid_signature") {
      toast.error("Xác thực thanh toán không hợp lệ.");
      return undefined;
    }

    toast.error("Không thể xác định trạng thái thanh toán.");
    return undefined;
  }, [isSuccess, navigate, pendingCourseId, status]);

  const title = isSuccess ? "Thanh toán thành công" : "Thanh toán chưa thành công";
  const subtitle = isSuccess
    ? "Hệ thống đang hoàn tất đăng ký và đưa bạn vào khóa học."
    : "Bạn có thể thử lại thanh toán hoặc quay về danh sách khóa học.";

  return (
    <div className="min-h-[70vh] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 text-center">
        <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${isSuccess ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
          {isSuccess ? "✓" : "!"}
        </div>

        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-300">{subtitle}</p>

        {!!txnRef && (
          <p className="mt-3 text-xs text-slate-400">
            Mã giao dịch: {txnRef}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {!isSuccess && !!pendingCourseId && (
            <button
              type="button"
              onClick={() => navigate(`/course/${pendingCourseId}`)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Quay lại khóa học
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/my-learning")}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
          >
            Đến khóa học của tôi
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

export default PaymentReturn;
