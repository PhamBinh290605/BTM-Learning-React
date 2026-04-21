import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import questionApi from "../../../api/questionApi";

const QUESTION_TYPES = [
  { value: "SINGLE_CHOICE", label: "Một đáp án", icon: "○" },
  { value: "MULTIPLE_CHOICE", label: "Nhiều đáp án", icon: "☑" },
  { value: "TRUE_FALSE", label: "Đúng / Sai", icon: "✓✗" },
  { value: "SHORT_ANSWER", label: "Trả lời ngắn", icon: "⌨" },
  { value: "ESSAY", label: "Tự luận", icon: "📝" },
];

const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "Dễ (Nhận biết)", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "MEDIUM", label: "Trung bình (Thông hiểu)", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "HARD", label: "Khó (Vận dụng)", color: "text-red-600 bg-red-50 border-red-200" },
];

const DEFAULT_ANSWERS = [
  { orderIndex: 0, content: "", correct: true, explanation: "", referenceAnswer: "" },
  { orderIndex: 1, content: "", correct: false, explanation: "", referenceAnswer: "" },
  { orderIndex: 2, content: "", correct: false, explanation: "", referenceAnswer: "" },
  { orderIndex: 3, content: "", correct: false, explanation: "", referenceAnswer: "" },
];

const TRUE_FALSE_ANSWERS = [
  { orderIndex: 0, content: "Đúng", correct: true, explanation: "", referenceAnswer: "" },
  { orderIndex: 1, content: "Sai", correct: false, explanation: "", referenceAnswer: "" },
];

const QuestionEditor = () => {
  const [searchParams] = useSearchParams();
  const questionIdParam = searchParams.get("questionId");
  const isEditMode = !!questionIdParam;

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor") ? "/instructor" : "/admin";

  const [formData, setFormData] = useState({
    content: "",
    questionType: "SINGLE_CHOICE",
    difficulty: "EASY",
    orderIndex: 0,
    answers: [...DEFAULT_ANSWERS],
    referenceAnswer: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load existing question when editing
  useEffect(() => {
    if (!isEditMode) return;
    const loadQuestion = async () => {
      try {
        setIsLoading(true);
        const resp = await questionApi.searchQuestions({ pageNo: 0, pageSize: 500 });
        const questions = resp?.data?.result?.content || [];
        const q = questions.find((item) => item.id === Number(questionIdParam));
        if (q) {
          setFormData({
            content: q.content || "",
            questionType: q.questionType || "SINGLE_CHOICE",
            difficulty: q.difficulty || "EASY",
            orderIndex: q.orderIndex || 0,
            answers: q.answers?.length > 0
              ? q.answers.map((a, i) => ({ ...a, orderIndex: a.orderIndex ?? i }))
              : [...DEFAULT_ANSWERS],
            referenceAnswer: q.answers?.[0]?.referenceAnswer || "",
          });
        }
      } catch (err) {
        console.error("Load question failed:", err);
        showToast("Không thể tải câu hỏi", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestion();
  }, [isEditMode, questionIdParam]);

  const handleTypeChange = (newType) => {
    let newAnswers;
    if (newType === "TRUE_FALSE") {
      newAnswers = [...TRUE_FALSE_ANSWERS];
    } else if (newType === "ESSAY" || newType === "SHORT_ANSWER") {
      newAnswers = [{ orderIndex: 0, content: "", correct: true, referenceAnswer: "", explanation: "" }];
    } else if (newType === "SINGLE_CHOICE") {
      newAnswers = formData.answers.length >= 2
        ? formData.answers.map((a, i) => ({ ...a, correct: i === 0 }))
        : [...DEFAULT_ANSWERS];
    } else {
      newAnswers = formData.answers.length >= 2 ? [...formData.answers] : [...DEFAULT_ANSWERS];
    }
    setFormData((prev) => ({ ...prev, questionType: newType, answers: newAnswers }));
  };

  const setCorrectAnswer = (idx) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((a) => {
        if (prev.questionType === "SINGLE_CHOICE" || prev.questionType === "TRUE_FALSE") {
          return { ...a, correct: a.orderIndex === idx };
        }
        return a.orderIndex === idx ? { ...a, correct: !a.correct } : a;
      }),
    }));
  };

  const updateAnswerField = (index, field, value) => {
    setFormData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      return { ...prev, answers: newAnswers };
    });
  };

  const handleAddAnswer = () => {
    setFormData((prev) => ({
      ...prev,
      answers: [...prev.answers, { orderIndex: prev.answers.length, content: "", correct: false, explanation: "", referenceAnswer: "" }],
    }));
  };

  const handleRemoveAnswer = (idx) => {
    if (formData.answers.length <= 2) {
      showToast("Cần ít nhất 2 đáp án!", "error");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.filter((a) => a.orderIndex !== idx).map((a, i) => ({ ...a, orderIndex: i })),
    }));
  };

  const handleSave = async () => {
    if (!formData.content.trim()) return showToast("Vui lòng nhập nội dung câu hỏi", "error");

    const isChoice = formData.questionType === "SINGLE_CHOICE" || formData.questionType === "MULTIPLE_CHOICE" || formData.questionType === "TRUE_FALSE";
    if (isChoice) {
      const emptyAnswers = formData.answers.filter((a) => !a.content.trim());
      if (emptyAnswers.length > 0) return showToast("Vui lòng nhập nội dung cho tất cả đáp án", "error");
      if (!formData.answers.some((a) => a.correct)) return showToast("Vui lòng chọn ít nhất 1 đáp án đúng", "error");
      if (formData.questionType === "MULTIPLE_CHOICE" && formData.answers.filter((a) => a.correct).length < 2) {
        return showToast("Câu nhiều đáp án cần ít nhất 2 đáp án đúng", "error");
      }
    }

    try {
      setIsSaving(true);
      const payload = {
        content: formData.content.trim(),
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        orderIndex: Number(formData.orderIndex) || 0,
        answers: formData.answers.map((a, i) => ({
          content: a.content,
          correct: a.correct,
          orderIndex: i,
          explanation: a.explanation || "",
          referenceAnswer: formData.questionType === "ESSAY" || formData.questionType === "SHORT_ANSWER"
            ? formData.referenceAnswer || ""
            : a.referenceAnswer || "",
        })),
      };

      if (isEditMode) {
        await questionApi.updateQuestion(Number(questionIdParam), payload);
        showToast("Cập nhật câu hỏi thành công!");
      } else {
        await questionApi.createQuestion(payload);
        showToast("Tạo câu hỏi thành công!");
      }
      setTimeout(() => navigate(`${basePath}/quiz`), 800);
    } catch (err) {
      console.error("Save failed:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Lưu câu hỏi thất bại", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndNew = async () => {
    if (!formData.content.trim()) return showToast("Vui lòng nhập nội dung câu hỏi", "error");

    const isChoice = formData.questionType === "SINGLE_CHOICE" || formData.questionType === "MULTIPLE_CHOICE" || formData.questionType === "TRUE_FALSE";
    if (isChoice) {
      if (formData.answers.some((a) => !a.content.trim())) return showToast("Nhập nội dung cho tất cả đáp án", "error");
      if (!formData.answers.some((a) => a.correct)) return showToast("Chọn ít nhất 1 đáp án đúng", "error");
    }

    try {
      setIsSaving(true);
      const payload = {
        content: formData.content.trim(),
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        orderIndex: Number(formData.orderIndex) || 0,
        answers: formData.answers.map((a, i) => ({
          content: a.content,
          correct: a.correct,
          orderIndex: i,
          explanation: a.explanation || "",
          referenceAnswer: formData.questionType === "ESSAY" || formData.questionType === "SHORT_ANSWER"
            ? formData.referenceAnswer || "" : a.referenceAnswer || "",
        })),
      };
      await questionApi.createQuestion(payload);
      showToast("Đã lưu! Tạo câu hỏi tiếp...");
      setFormData({
        content: "",
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        orderIndex: 0,
        answers: formData.questionType === "TRUE_FALSE" ? [...TRUE_FALSE_ANSWERS]
          : (formData.questionType === "ESSAY" || formData.questionType === "SHORT_ANSWER")
            ? [{ orderIndex: 0, content: "", correct: true, referenceAnswer: "", explanation: "" }]
            : [...DEFAULT_ANSWERS],
        referenceAnswer: "",
      });
    } catch (err) {
      showToast(err?.response?.data?.message || "Lưu thất bại", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const isChoiceType = ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(formData.questionType);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-sm text-gray-500">Đang tải câu hỏi...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-slide-in ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`${basePath}/quiz`)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isEditMode ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}</h1>
            <p className="text-sm text-gray-500">Thêm vào Ngân hàng câu hỏi</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {showPreview ? "Ẩn xem trước" : "👁 Xem trước"}
          </button>
          {!isEditMode && (
            <button onClick={handleSaveAndNew} disabled={isSaving}
              className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-70">
              Lưu & Tạo tiếp
            </button>
          )}
          <button onClick={handleSave} disabled={isSaving}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70">
            {isSaving ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu câu hỏi"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8 flex gap-6">
        {/* Main form */}
        <div className={`${showPreview ? "w-3/5" : "w-full"} space-y-6 transition-all`}>
          {/* Question type + difficulty */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-3">Loại câu hỏi</label>
            <div className="flex gap-2 flex-wrap mb-5">
              {QUESTION_TYPES.map((t) => (
                <button key={t.value} onClick={() => handleTypeChange(t.value)}
                  className={`flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.questionType === t.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Độ khó</label>
                <div className="flex gap-2">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button key={d.value} onClick={() => setFormData((p) => ({ ...p, difficulty: d.value }))}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        formData.difficulty === d.value ? d.color + " ring-1" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Question content */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </label>
            <textarea rows="4" placeholder="Nhập nội dung câu hỏi..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 resize-none text-gray-800"
              value={formData.content} onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))} />
          </div>

          {/* Answers section */}
          {isChoiceType ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-gray-700">Các lựa chọn đáp án</label>
                <span className="text-xs text-gray-500">
                  {formData.questionType === "SINGLE_CHOICE" ? "Chọn 1 đáp án đúng" :
                   formData.questionType === "TRUE_FALSE" ? "Chọn đáp án đúng" : "Chọn nhiều đáp án đúng"}
                </span>
              </div>
              <div className="space-y-3">
                {formData.answers.map((answer, index) => (
                  <div key={answer.orderIndex}
                    className={`p-4 rounded-xl border transition-all ${
                      answer.correct ? "border-green-400 bg-green-50/60" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className="pt-2">
                        <input
                          type={formData.questionType === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                          name="correct_answer" checked={answer.correct}
                          onChange={() => setCorrectAnswer(answer.orderIndex)}
                          className="w-5 h-5 text-green-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 shadow-sm">
                          <span className="bg-gray-100 px-4 py-2 border-r border-gray-200 text-sm text-gray-600 font-bold font-mono flex items-center">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <input type="text" placeholder="Nhập nội dung lựa chọn..."
                            className="w-full px-4 py-2 outline-none text-sm text-gray-800"
                            value={answer.content}
                            disabled={formData.questionType === "TRUE_FALSE"}
                            onChange={(e) => updateAnswerField(index, "content", e.target.value)} />
                        </div>
                        <textarea rows="1" placeholder="Giải thích cho lựa chọn này (không bắt buộc)..."
                          className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg outline-none focus:border-blue-400 text-xs text-gray-600 bg-gray-50/50 resize-none"
                          value={answer.explanation || ""}
                          onChange={(e) => updateAnswerField(index, "explanation", e.target.value)} />
                      </div>
                      {formData.questionType !== "TRUE_FALSE" && (
                        <button onClick={() => handleRemoveAnswer(answer.orderIndex)}
                          className="mt-2 text-gray-400 hover:text-red-500 transition-colors p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {formData.questionType !== "TRUE_FALSE" && (
                <button onClick={handleAddAnswer}
                  className="mt-4 text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors">
                  <span className="text-lg">+</span> Thêm lựa chọn
                </button>
              )}
            </div>
          ) : (
            /* Essay / Short Answer */
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
              <div className="mb-4 flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">
                    {formData.questionType === "SHORT_ANSWER" ? "Đáp án mẫu" : "Đáp án tham khảo / Rubric"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.questionType === "SHORT_ANSWER"
                      ? "Nhập đáp án chính xác mà học viên cần trả lời."
                      : "Nhập hướng dẫn chấm điểm hoặc câu trả lời mẫu."}
                  </p>
                </div>
              </div>
              <textarea rows="4" placeholder="Nhập đáp án tham khảo..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none text-sm text-gray-800 bg-gray-50 focus:bg-white transition-colors"
                value={formData.referenceAnswer || ""}
                onChange={(e) => setFormData((p) => ({ ...p, referenceAnswer: e.target.value }))} />
              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Giải thích chi tiết (Tùy chọn)</label>
                <textarea rows="2" placeholder="Giải thích thêm..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none text-sm text-gray-800"
                  value={formData.answers[0]?.explanation || ""}
                  onChange={(e) => updateAnswerField(0, "explanation", e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="w-2/5 sticky top-24">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span>👁</span> Xem trước (Góc nhìn học viên)
              </h3>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    formData.difficulty === "EASY" ? "bg-green-100 text-green-700" :
                    formData.difficulty === "MEDIUM" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>{formData.difficulty}</span>
                  <span className="text-xs text-gray-400">{QUESTION_TYPES.find((t) => t.value === formData.questionType)?.label}</span>
                </div>
                <p className="text-base font-medium text-gray-900 mb-4 leading-relaxed">
                  {formData.content || "Nội dung câu hỏi sẽ hiển thị ở đây..."}
                </p>
                {isChoiceType ? (
                  <div className="space-y-2">
                    {formData.answers.map((a, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        a.correct ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 bg-white border-gray-300 text-gray-500">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm text-gray-700">{a.content || "..."}</span>
                        {a.correct && <span className="ml-auto text-green-600 text-xs font-bold">✓ Đúng</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 italic">
                      {formData.questionType === "SHORT_ANSWER" ? "Học viên nhập câu trả lời ngắn tại đây..." : "Học viên viết bài tự luận tại đây..."}
                    </p>
                    {formData.referenceAnswer && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-bold text-gray-500 mb-1">Đáp án tham khảo:</p>
                        <p className="text-xs text-gray-600">{formData.referenceAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default QuestionEditor;
