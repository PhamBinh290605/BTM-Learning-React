import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const statusParam = String(searchParams.get("status") || "").toLowerCase();
  const vnpResponseCode = String(searchParams.get("vnp_ResponseCode") || "").trim();
  const txnRef = searchParams.get("txnRef") || searchParams.get("vnp_TxnRef") || "";
  const courseId = searchParams.get("courseId") || "";
  const reason = searchParams.get("reason") || "";

  const status = statusParam || (vnpResponseCode ? (vnpResponseCode === "00" ? "success" : "failed") : "");
  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess) {
      navigate(`/payment/success${buildQueryString({ txnRef, courseId })}`, {
        replace: true,
      });
      return;
    }

    if (status === "failed") {
      navigate(`/payment/failed${buildQueryString({ txnRef, courseId, reason: reason || (vnpResponseCode ? `vnp_${vnpResponseCode}` : "") })}`, {
        replace: true,
      });
      return;
    }

    if (status === "invalid_signature") {
      navigate(`/payment/failed${buildQueryString({ txnRef, courseId, reason: reason || "invalid_signature" })}`, {
        replace: true,
      });
      return;
    }

    navigate(`/payment/failed${buildQueryString({ txnRef, courseId, reason: reason || "unknown_status" })}`, {
      replace: true,
    });
  }, [courseId, isSuccess, navigate, reason, status, txnRef, vnpResponseCode]);

  return (
    <div className="min-h-[70vh] bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        <h1 className="text-xl font-bold text-white">Đang xử lý kết quả thanh toán</h1>
        <p className="mt-2 text-sm text-slate-300">Vui lòng chờ trong giây lát...</p>
      </div>
    </div>
  );
};

export default PaymentReturn;
