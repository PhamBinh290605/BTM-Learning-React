import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import questionApi from "../../../api/questionApi";

const QuestionEditor = () => {
  const setCorrectAnswer = (id) => {
    setFormData({
      ...formData,
      answers: formData.answers.map((answer) => {
        if (formData.questionType === "SINGLE_CHOICE") {
          return { ...answer, correct: answer.orderIndex === id };
        } else {
          // Chỉ thay đổi đáp án được click
          return answer.orderIndex === id
            ? { ...answer, correct: !answer.correct }
            : answer;
        }
      }),
    });
  };

  // Hàm thay đổi loại câu hỏi
  const handleTypeChange = (newType) => {
    let newAnswers = [...formData.answers];

    if (newType === "SINGLE_CHOICE") {
      newAnswers = newAnswers.map((answer, index) => ({
        ...answer,
        correct: index === 0,
      }));
    } else if (newType === "ESSAY") {
      newAnswers = [
        {
          orderIndex: 0,
          content: "",
          correct: true,
          referenceAnswer: "",
          explanation: "",
        },
      ];
    }

    setFormData({ ...formData, questionType: newType, answers: newAnswers });
  };

  // --- HÀM LƯU DỮ LIỆU ---
  const handleSaveQuestion = async () => {
    if (!formData.content.trim()) {
      return alert("Vui lòng nhập nội dung câu hỏi");
    }

    // Logic kiểm tra (Validation) khác nhau tùy theo loại câu hỏi
    if (formData.questionType !== "ESSAY") {
      const hasCorrectOption = formData.answers.some((opt) => opt.correct);
      if (!hasCorrectOption)
        return alert(
          "Vui lòng chọn ít nhất 1 đáp án đúng cho câu hỏi trắc nghiệm",
        );
    } else {
      if (!formData.referenceAnswer.trim()) {
        const confirmEmpty = window.confirm(
          "Bạn chưa nhập đáp án tham khảo cho câu tự luận. Vẫn tiếp tục lưu?",
        );
        if (!confirmEmpty) return;
      }
    }

    try {
      const response = await questionApi.createQuestion(formData);
      console.log("Câu hỏi đã được lưu thành công:", response.data?.result);
      alert("Lưu thành công! (Xem log ở Console)");
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Lưu câu hỏi thất bại");
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  const answerRequest = {
    content: "",
    correct: false,
    orderIndex: 0,
    explanation: "",
    referenceAnswer: "",
  };

  const [formData, setFormData] = useState({
    content: "",
    questionType: "SINGLE_CHOICE",
    difficulty: "EASY",
    orderIndex: "",
    answers: [
      {
        orderIndex: 0,
        content: "",
        correct: true,
        referenceAnswer: "",
        explanation: "",
      },
      {
        orderIndex: 1,
        content: "",
        correct: false,
        referenceAnswer: "",
        explanation: "",
      },
      {
        orderIndex: 2,
        content: "",
        correct: false,
        referenceAnswer: "",
        explanation: "",
      },
      {
        orderIndex: 3,
        content: "",
        correct: false,
        referenceAnswer: "",
        explanation: "",
      },
    ],
  });

  const handleRemoveAnswer = (id) => {
    if (formData.answers.length <= 2) {
      alert("Một câu hỏi trắc nghiệm phải có ít nhất 2 đáp án!");
      return;
    }
    setFormData({
      ...formData,
      answers: formData.answers.filter((answer) => answer.orderIndex !== id),
    });
  };

  const handleAddAnswer = () => {
    setFormData((prev) => ({
      ...prev,
      answers: [
        ...prev.answers,
        { ...answerRequest, orderIndex: prev.answers.length },
      ],
    }));
  };

  const updateAnswerText = (index, field, value) => {
    setFormData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };

      return { ...prev, answers: newAnswers };
    });
  };

  // Dùng useEffect để lắng nghe mỗi khi formData thay đổi
  useEffect(() => {
    console.log("formData mới nhất:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* HEADER TẠO CÂU HỎI */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`${basePath}/quiz`)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tạo câu hỏi mới</h1>
            <p className="text-sm text-gray-500">Thêm vào Ngân hàng câu hỏi</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/quiz`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveQuestion}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2"
          >
            Lưu câu hỏi
          </button>
        </div>
      </div>

      {/* MAIN CONTENT CỦA FORM */}
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* 1. Cấu hình cơ bản (Loại câu hỏi, Độ khó) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Loại câu hỏi
            </label>
            <div className="flex gap-3 flex-wrap">
              {/* Radio: Trắc nghiệm 1 đáp án */}
              <label
                className={`flex items-center gap-2 border px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${formData.questionType === "single" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={formData.questionType === "SINGLE_CHOICE"}
                  onChange={() => handleTypeChange("SINGLE_CHOICE")}
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.questionType === "SINGLE_CHOICE" ? "border-blue-500" : "border-gray-400"}`}
                >
                  {formData.questionType === "SINGLE_CHOICE" && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className="font-medium text-sm">Một đáp án</span>
              </label>

              {/* Radio: Trắc nghiệm nhiều đáp án */}
              <label
                className={`flex items-center gap-2 border px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${formData.questionType === "multiple" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={formData.questionType === "MULTIPLE_CHOICE"}
                  onChange={() => handleTypeChange("MULTIPLE_CHOICE")}
                />
                <div
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center ${formData.questionType === "MULTIPLE_CHOICE" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}
                >
                  {formData.questionType === "MULTIPLE_CHOICE" && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm">Nhiều đáp án</span>
              </label>

              {/* Radio: Tự luận (MỚI) */}
              <label
                className={`flex items-center gap-2 border px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${formData.questionType === "ESSAY" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  className="hidden"
                  checked={formData.questionType === "ESSAY"}
                  onChange={() => handleTypeChange("ESSAY")}
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${formData.questionType === "ESSAY" ? "border-blue-500 text-blue-500" : "border-gray-400 text-transparent"}`}
                >
                  {formData.questionType === "ESSAY" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm">Tự luận</span>
              </label>
            </div>
          </div>

          {/* Ô Nhập Order Index (MỚI THÊM) */}
          <div className="w-32">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Thứ tự (Order)
            </label>
            <input
              type="number"
              min="1"
              placeholder="VD: 1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition-colors"
              value={formData.orderIndex}
              onChange={handleChange}
              name="orderIndex"
            />
          </div>

          <div className="w-1/4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Độ khó
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm"
              value={formData.difficulty}
              name="difficulty"
              onChange={handleChange}
            >
              <option value="EASY">Dễ (Nhận biết)</option>
              <option value="MEDIUM">Trung bình (Thông hiểu)</option>
              <option value="HARD">Khó (Vận dụng)</option>
            </select>
          </div>
        </div>

        {/* 2. Nội dung câu hỏi (Dùng chung cho cả 3 loại) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Nội dung câu hỏi <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="Nhập nội dung câu hỏi của bạn tại đây..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-gray-800"
            value={formData.content}
            name="content"
            onChange={handleChange}
          />
        </div>

        {/* 3. KHU VỰC ĐÁP ÁN (RENDER CÓ ĐIỀU KIỆN) */}
        {formData.questionType !== "ESSAY" ? (
          /* HIỂN THỊ CÁC LỰA CHỌN TRẮC NGHIỆM */
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-gray-700">
                Các lựa chọn đáp án
              </label>
              <span className="text-xs text-gray-500">
                Tích chọn để đánh dấu đáp án đúng
              </span>
            </div>

            {/* Trong phần render câu hỏi trắc nghiệm (formData.questionType !== "essay") */}
            <div className="space-y-4">
              {" "}
              {/* Tăng khoảng cách giữa các cụm đáp án */}
              {formData.answers.map((answer, index) => (
                <div
                  key={answer.orderIndex}
                  className={`p-4 rounded-xl border transition-all ${
                    answer.correct
                      ? "border-green-400 bg-green-50/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox/Radio chọn đáp án đúng */}
                    <div className="pt-2">
                      <input
                        type={
                          formData.questionType === "SINGLE_CHOICE"
                            ? "radio"
                            : "checkbox"
                        }
                        name="correct_answer"
                        checked={answer.correct}
                        onChange={() => setCorrectAnswer(answer.orderIndex)}
                        className={`w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer ${
                          formData.questionType === "SINGLE_CHOICE"
                            ? "rounded-full"
                            : "rounded"
                        }`}
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Hàng 1: Label (A, B, C...) và Nội dung đáp án */}
                      <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 shadow-sm">
                        <span className="bg-gray-100 px-4 py-2 border-r border-gray-200 text-sm text-gray-600 font-bold font-mono uppercase flex items-center">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          placeholder={`Nhập nội dung lựa chọn...`}
                          className="w-full px-4 py-2 outline-none text-sm text-gray-800 bg-transparent"
                          value={answer.content}
                          onChange={(e) =>
                            updateAnswerText(index, "content", e.target.value)
                          }
                        />
                      </div>

                      {/* Hàng 2: Ô nhập giải thích cho riêng đáp án này */}
                      <div className="relative">
                        <textarea
                          rows="1"
                          placeholder="Giải thích ngắn gọn cho lựa chọn này (không bắt buộc)..."
                          className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg outline-none focus:border-blue-400 focus:bg-white text-xs text-gray-600 bg-gray-50/50 resize-none"
                          value={answer.explanation || ""}
                          onChange={(e) =>
                            updateAnswerText(
                              index,
                              "explanation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Nút xóa đáp án */}
                    <button
                      onClick={() => handleRemoveAnswer(answer.orderIndex)}
                      className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAddAnswer()}
              className="mt-4 text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-1.5 px-2 py-1 rounded transition-colors"
            >
              <span>+</span> Thêm lựa chọn
            </button>
          </div>
        ) : (
          /* HIỂN THỊ KHUNG NHẬP ĐÁP ÁN THAM KHẢO CHO TỰ LUẬN */
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500 animate-fade-in">
            <div className="mb-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Đáp án tham khảo / Tiêu chí chấm điểm (Rubric)
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Học viên sẽ trả lời bằng cách gõ văn bản. Nhập từ khóa hoặc
                  câu trả lời mẫu để tiện cho việc chấm điểm sau này.
                </p>
              </div>
            </div>

            <textarea
              rows="4"
              placeholder="Ví dụ: Học viên cần nhắc đến các ý chính sau: 1... 2... 3..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none text-sm text-gray-800 bg-gray-50 focus:bg-white transition-colors"
              value={formData.referenceAnswer}
              onChange={(e) =>
                updateAnswerText(0, "referenceAnswer", e.target.value)
              }
            />

            {/* 4. Giải thích (Tùy chọn - Dùng chung) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Giải thích chi tiết (Tùy chọn)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Nội dung này sẽ hiển thị cho học viên sau khi họ nộp bài để họ
                hiểu rõ hơn.
              </p>
              <textarea
                rows="2"
                placeholder="Giải thích thêm về câu hỏi hoặc đáp án..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none text-sm text-gray-800"
                value={formData.answers[0].explanation || ""}
                onChange={(e) =>
                  updateAnswerText(0, "explanation", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
