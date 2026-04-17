import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizSystem = () => {
  // --- 1. STATE: THÔNG TIN CƠ BẢN & CÀI ĐẶT ---
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 80,
  });

  // --- 2. STATE: KHO CÂU HỎI TỔNG (QUESTION BANK) ---
  const [questionBank, setQuestionBank] = useState([
    {
      id: "q1",
      text: "React là gì?",
      options: ["Library", "Framework"],
      correct: 0,
    },
    {
      id: "q2",
      text: "Thành phần nào dùng để quản lý State?",
      options: ["useState", "useEffect"],
      correct: 0,
    },
    {
      id: "q3",
      text: "Tailwind là gì?",
      options: ["CSS Framework", "JS Library"],
      correct: 0,
    },
    {
      id: "q4",
      text: "Next.js hỗ trợ SSR không?",
      options: ["Có", "Không"],
      correct: 0,
    },
    {
      id: "q5",
      text: "Hook nào chạy sau khi render?",
      options: ["useMemo", "useEffect"],
      correct: 1,
    },
  ]);

  // --- 3. STATE: ĐỀ THI ĐANG XÂY DỰNG ---
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [randomCount, setRandomCount] = useState(2);

  // --- CÁC HÀM XỬ LÝ ---
  const toggleSelect = (id) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qId) => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleRandomize = () => {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(
      0,
      Math.min(randomCount, questionBank.length),
    );
    setSelectedQuestionIds(selected.map((q) => q.id));
  };

  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Khóa học: React & Next.js</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Tạo bài kiểm tra</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {quizInfo.title || "Bài kiểm tra chưa có tên"}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button className="px-4 py-2 bg-white border border-[#1a2b4c] text-[#1a2b4c] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Lưu nháp
          </button>
          <button
            onClick={() => navigate("/admin/quiz/questions")}
            className="px-4 py-2 bg-white border border-[#335aa8] text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Tạo câu hỏi
          </button>
          <button className="px-5 py-2 bg-[#421974] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
            Xuất bản
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-8">
        {/* SECTION 1: THÔNG TIN & CÀI ĐẶT */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex gap-8">
          {/* Cột trái: Form chữ */}
          <div className="flex-2 w-2/3 space-y-4 border-r border-gray-100 pr-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Thông tin cơ bản
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề bài kiểm tra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tiêu đề (VD: Bài thi giữa kỳ...)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={quizInfo.title}
                onChange={(e) =>
                  setQuizInfo({ ...quizInfo, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả / Hướng dẫn
              </label>
              <textarea
                rows="3"
                placeholder="Nhập hướng dẫn làm bài cho học viên..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                value={quizInfo.description}
                onChange={(e) =>
                  setQuizInfo({ ...quizInfo, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Cột phải: Cài đặt số */}
          <div className="flex-1 w-1/3 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cài đặt</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (Phút)
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={quizInfo.duration}
                  onChange={(e) =>
                    setQuizInfo({
                      ...quizInfo,
                      duration: Number(e.target.value),
                    })
                  }
                />
                <span className="absolute right-3 top-2 text-gray-400">
                  phút
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm đạt (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={quizInfo.passingScore}
                  onChange={(e) =>
                    setQuizInfo({
                      ...quizInfo,
                      passingScore: Number(e.target.value),
                    })
                  }
                />
                <span className="absolute right-3 top-2 text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: QUẢN LÝ CÂU HỎI (2 CỘT) */}
        <div className="flex gap-8">
          {/* BÊN TRÁI: NGÂN HÀNG CÂU HỎI */}
          <div className="w-1/2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Ngân hàng câu hỏi
              </h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                Kho: {questionBank.length} câu
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 max-h-[500px]">
              {questionBank.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedQuestionIds.includes(q.id)
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-gray-700 text-sm leading-relaxed">
                      {q.text}
                    </span>
                    {selectedQuestionIds.includes(q.id) && (
                      <span className="text-blue-600 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BÊN PHẢI: CẤU TRÚC ĐỀ THI */}
          <div className="w-1/2 space-y-6">
            {/* Box Random */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">Lấy ngẫu nhiên</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tự động chọn nhanh từ kho
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min="1"
                  max={questionBank.length}
                  value={randomCount}
                  onChange={(e) => setRandomCount(parseInt(e.target.value))}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-center outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleRandomize}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                >
                  Trộn đề
                </button>
              </div>
            </div>

            {/* Box Danh sách đã chọn */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  Câu hỏi trong đề
                </h2>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                  Đã chọn: {selectedQuestionIds.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {selectedQuestionIds.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-sm">Chưa có câu hỏi nào được chọn</p>
                  </div>
                ) : (
                  selectedQuestionIds.map((id, index) => {
                    const q = questionBank.find((item) => item.id === id);
                    return (
                      <div
                        key={id}
                        className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100 group"
                      >
                        <span className="text-gray-400 font-bold mt-0.5">
                          #{index + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium text-gray-700 mt-0.5">
                          {q?.text}
                        </span>
                        <button
                          onClick={() => toggleSelect(id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                          title="Bỏ chọn"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSystem;
