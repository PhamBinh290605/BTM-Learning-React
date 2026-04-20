import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import certificateApi from "../../../api/certificateApi";

const CERT_COLOR_POOL = [
  "from-orange-400 to-red-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-yellow-400 to-amber-500",
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-blue-600",
  "from-cyan-500 to-blue-500",
];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CertificatesPage = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCertificates = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await certificateApi.getAllCertificates();
        const result = response?.data?.result;

        if (!isMounted) return;

        const certList = Array.isArray(result) ? result : [];

        const mappedCerts = certList.map((cert, index) => ({
          id: cert.id,
          courseName: cert.courseTitle || cert.courseName || `Khóa học #${cert.courseId || ""}`,
          courseId: cert.courseId,
          instructor: cert.instructorName || "BTM Learning",
          issueDate: formatDate(cert.issuedAt || cert.createdAt),
          certificateId: cert.code || `CERT-${cert.id}`,
          pdfUrl: cert.pdfUrl || cert.certificateUrl || "",
          grade: "Hoàn thành",
          color: CERT_COLOR_POOL[index % CERT_COLOR_POOL.length],
        }));

        setCertificates(mappedCerts);
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không tải được danh sách chứng chỉ. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCertificates();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = (cert) => {
    if (cert.pdfUrl) {
      window.open(cert.pdfUrl, "_blank");
    } else {
      toast.error("Chưa có file chứng chỉ PDF.");
    }
  };

  const handleShare = (cert) => {
    const verifyUrl = `${window.location.origin}/verify-certificate?code=${encodeURIComponent(cert.certificateId)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl).then(
        () => toast.success("Đã sao chép link xác minh!"),
        () => toast.error("Không sao chép được link.")
      );
    } else {
      toast("Link xác minh: " + verifyUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Chứng chỉ của tôi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Các chứng chỉ bạn đã đạt được sau khi hoàn thành khóa học
          </p>
        </div>

        {/* Error Message */}
        {!!errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`cert-stat-skeleton-${index}`}
                  className="h-24 rounded-2xl border border-slate-200 bg-white animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`cert-skeleton-${index}`}
                  className="h-80 rounded-2xl border border-slate-200 bg-white animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xl">
                  🏆
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {certificates.length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Tổng chứng chỉ
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl">
                  ✅
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {certificates.filter((c) => c.pdfUrl).length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Có file PDF
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl">
                  📅
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {certificates[0]?.issueDate || "—"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Gần nhất
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Grid */}
            {certificates.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Chưa có chứng chỉ nào
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Hoàn thành khóa học để nhận chứng chỉ
                </p>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Khám phá khóa học
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Certificate Preview */}
                    <div
                      className={`relative bg-gradient-to-br ${cert.color} p-8 flex flex-col items-center justify-center min-h-[200px]`}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full" />
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full" />
                      <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/10" style={{ transform: "rotate(45deg)" }} />

                      <div className="relative text-center">
                        <div className="text-4xl mb-3">🏆</div>
                        <div className="text-xs uppercase tracking-widest text-white/60 font-bold mb-2">
                          Chứng chỉ hoàn thành
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight max-w-xs">
                          {cert.courseName}
                        </h3>
                      </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {cert.courseName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Giảng viên: {cert.instructor}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          {cert.grade}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4">
                        <span>📅 {cert.issueDate}</span>
                        <span>🔑 {cert.certificateId}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(cert)}
                          className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Tải xuống
                        </button>
                        <button
                          onClick={() => handleShare(cert)}
                          className="flex-1 py-2.5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Chia sẻ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;
