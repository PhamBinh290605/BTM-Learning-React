import { useState } from "react";
import certificateApi from "../../../api/certificateApi";

const CertificateVerify = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    try {
      setIsLoading(true);
      setResult(null);
      setHasSearched(true);
      const response = await certificateApi.verifyCertificate(trimmedCode);
      setResult(response?.data?.result || null);
    } catch {
      setResult({ valid: false, message: "Mã chứng chỉ không hợp lệ hoặc không tồn tại." });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 shadow-lg shadow-indigo-500/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Xác minh Chứng chỉ
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Nhập mã chứng chỉ để kiểm tra tính hợp lệ
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleVerify} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã chứng chỉ, VD: CERT-xxxx-xxxx"
              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? "Đang kiểm tra..." : "Xác minh"}
            </button>
          </div>
        </form>

        {/* Result */}
        {hasSearched && !isLoading && result && (
          <div className="animate-fade-in-up">
            {result.valid ? (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg">
                      Chứng chỉ hợp lệ
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      {result.message || "Chứng chỉ này đã được xác minh thành công."}
                    </p>
                  </div>
                </div>

                {result.certificate && (
                  <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Mã chứng chỉ</span>
                      <span className="text-sm font-mono font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1 rounded-lg">
                        {result.certificate.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Ngày cấp</span>
                      <span className="text-sm text-emerald-900 dark:text-emerald-200">
                        {formatDate(result.certificate.issuedAt)}
                      </span>
                    </div>
                    {result.certificate.userId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Học viên ID</span>
                        <span className="text-sm text-emerald-900 dark:text-emerald-200">
                          #{result.certificate.userId}
                        </span>
                      </div>
                    )}
                    {result.certificate.courseId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Khóa học ID</span>
                        <span className="text-sm text-emerald-900 dark:text-emerald-200">
                          #{result.certificate.courseId}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-800 dark:text-red-300 text-lg">
                      Không hợp lệ
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {result.message || "Mã chứng chỉ không tồn tại hoặc đã bị thu hồi."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          Trang này cho phép nhà tuyển dụng xác minh tính hợp lệ của chứng chỉ BTM Learning.
        </div>
      </div>
    </div>
  );
};

export default CertificateVerify;
