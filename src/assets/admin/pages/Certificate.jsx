import { useCallback, useEffect, useMemo, useState } from "react";
import certificateApi from "../../../api/certificateApi";
import { toast } from "react-hot-toast";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Certificate = () => {
  const [activeTab, setActiveTab] = useState("issued");
  const [searchTerm, setSearchTerm] = useState("");
  const [issuedCerts, setIssuedCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verify state
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchCertificates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await certificateApi.getAllCertificates();
      const list = Array.isArray(response?.data?.result) ? response.data.result : [];
      setIssuedCerts(
        list.map((cert) => ({
          id: cert.code || `CERT-${cert.id}`,
          certId: cert.id,
          userId: cert.userId,
          courseId: cert.courseId,
          student: `Học viên #${cert.userId}`,
          course: `Khóa học #${cert.courseId}`,
          date: formatDate(cert.issuedAt),
          status: "valid",
          code: cert.code,
        }))
      );
    } catch (error) {
      console.error("Failed to load certificates:", error);
      toast.error("Không tải được danh sách chứng chỉ.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const filteredCerts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return issuedCerts;
    return issuedCerts.filter(
      (cert) =>
        cert.id?.toLowerCase().includes(keyword) ||
        cert.student?.toLowerCase().includes(keyword) ||
        cert.course?.toLowerCase().includes(keyword)
    );
  }, [issuedCerts, searchTerm]);

  const handleVerify = async () => {
    const trimmedCode = verifyCode.trim();
    if (!trimmedCode) {
      toast.error("Vui lòng nhập mã chứng chỉ.");
      return;
    }

    try {
      setIsVerifying(true);
      setVerifyResult(null);
      const response = await certificateApi.verifyCertificate(trimmedCode);
      setVerifyResult(response?.data?.result || null);
    } catch {
      setVerifyResult({ valid: false, message: "Mã chứng chỉ không hợp lệ." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Quản lý Chứng chỉ</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi chứng chỉ đã cấp và xác minh chứng chỉ.
          </p>
        </div>
        <button
          onClick={fetchCertificates}
          className="bg-[#1a2b4c] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          Làm mới
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Tổng chứng chỉ đã cấp</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{issuedCerts.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Hợp lệ</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {issuedCerts.filter((c) => c.status === "valid").length}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Đã thu hồi</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {issuedCerts.filter((c) => c.status === "revoked").length}
            </h3>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("issued")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "issued"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Lịch sử cấp phát
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "verify"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Xác minh chứng chỉ
          </button>
        </div>

        {activeTab === "issued" ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <input
                type="text"
                placeholder="Tìm theo mã, học viên hoặc khóa học"
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Mã Chứng chỉ</th>
                    <th className="px-6 py-4">Học viên</th>
                    <th className="px-6 py-4">Khóa học</th>
                    <th className="px-6 py-4">Ngày cấp</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        Đang tải chứng chỉ...
                      </td>
                    </tr>
                  ) : filteredCerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        Chưa có chứng chỉ nào.
                      </td>
                    </tr>
                  ) : (
                    filteredCerts.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-indigo-700 bg-indigo-50/50">
                          {cert.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-bold text-gray-900 text-sm">{cert.student}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cert.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cert.status === "valid" ? (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-50 text-green-700 border border-green-200">
                              Hợp lệ
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 border border-red-200">
                              Đã thu hồi
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
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Xác minh chứng chỉ</h3>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã chứng chỉ..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-5 py-2.5 bg-[#1a2b4c] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 disabled:opacity-60"
              >
                {isVerifying ? "Đang kiểm tra..." : "Xác minh"}
              </button>
            </div>

            {verifyResult && (
              <div className={`rounded-xl p-5 ${verifyResult.valid ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-center gap-3">
                  {verifyResult.valid ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className={`font-bold ${verifyResult.valid ? "text-green-800" : "text-red-800"}`}>
                      {verifyResult.valid ? "Chứng chỉ hợp lệ" : "Không hợp lệ"}
                    </p>
                    <p className={`text-sm ${verifyResult.valid ? "text-green-600" : "text-red-600"}`}>
                      {verifyResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificate;
