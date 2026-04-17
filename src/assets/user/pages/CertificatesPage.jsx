import { useNavigate } from "react-router-dom";

// import { getMyCertificates } from "../../../api/courses";

const CertificatesPage = () => {
  const navigate = useNavigate();

  // ─── MOCK DATA ───
  const certificates = [
    {
      id: 1,
      courseName: "Digital Marketing A-Z cho người mới",
      instructor: "Thanh Tùng",
      issueDate: "10/04/2026",
      certificateId: "CERT-2026-DM-0234",
      grade: "Xuất sắc",
      color: "from-orange-400 to-red-500",
    },
    {
      id: 2,
      courseName: "Tiếng Anh giao tiếp chuyên ngành IT",
      instructor: "Ngọc Anh",
      issueDate: "01/04/2026",
      certificateId: "CERT-2026-EN-0189",
      grade: "Giỏi",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: 3,
      courseName: "HTML & CSS cơ bản",
      instructor: "Minh Hoàng",
      issueDate: "01/03/2026",
      certificateId: "CERT-2026-HC-0102",
      grade: "Xuất sắc",
      color: "from-pink-400 to-rose-500",
    },
    {
      id: 4,
      courseName: "JavaScript ES6+",
      instructor: "Minh Hoàng",
      issueDate: "20/02/2026",
      certificateId: "CERT-2026-JS-0078",
      grade: "Giỏi",
      color: "from-yellow-400 to-amber-500",
    },
  ];

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
              ⭐
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {certificates.filter((c) => c.grade === "Xuất sắc").length}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Loại xuất sắc
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cert.grade === "Xuất sắc"
                          ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                          : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {cert.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4">
                    <span>📅 {cert.issueDate}</span>
                    <span>🔑 {cert.certificateId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Tải xuống
                    </button>
                    <button className="flex-1 py-2.5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5">
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
      </div>
    </div>
  );
};

export default CertificatesPage;
