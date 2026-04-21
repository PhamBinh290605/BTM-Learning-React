import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import questionApi from "../../../api/questionApi";
import quizApi from "../../../api/quizApi";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Tất cả độ khó" },
  { value: "EASY", label: "Dễ" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HARD", label: "Khó" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "SINGLE_CHOICE", label: "Một đáp án" },
  { value: "MULTIPLE_CHOICE", label: "Nhiều đáp án" },
  { value: "TRUE_FALSE", label: "Đúng/Sai" },
  { value: "SHORT_ANSWER", label: "Trả lời ngắn" },
  { value: "ESSAY", label: "Tự luận" },
];

const DIFF_COLORS = {
  EASY: "text-green-600 bg-green-100",
  MEDIUM: "text-amber-600 bg-amber-100",
  HARD: "text-red-600 bg-red-100",
};

const QuizSystem = () => {
  const [quizInfo, setQuizInfo] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 70,
  });

  const [questionBank, setQuestionBank] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [randomCount, setRandomCount] = useState(5);
  const [randomDifficulty, setRandomDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [toast, setToast] = useState(null);

  const [isLoadingBank, setIsLoadingBank] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  const [aiRequest, setAiRequest] = useState({
    topic: "",
    context: "",
    questionCount: 5,
    difficulty: "MEDIUM",
    questionType: "SINGLE_CHOICE",
  });
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiPreview, setAiPreview] = useState([]);
  const [importedAiIndices, setImportedAiIndices] = useState(new Set());
  const [isImportingAll, setIsImportingAll] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  const fetchQuestionBank = async () => {
    try {
      setIsLoadingBank(true);
      const response = await questionApi.searchQuestions({
        pageNo: 0,
        pageSize: 200,
      });

      const result = response?.data?.result?.content || [];
      setQuestionBank(result);
    } catch (error) {
      console.error("Failed to fetch question bank:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Không thể tải ngân hàng câu hỏi");
    } finally {
      setIsLoadingBank(false);
    }
  };

  useEffect(() => {
    fetchQuestionBank();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredQuestionBank = useMemo(() => {
    let filtered = questionBank;
    if (searchTerm.trim()) {
      const kw = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((q) => q.content?.toLowerCase().includes(kw));
    }
    if (filterType) filtered = filtered.filter((q) => q.questionType === filterType);
    if (filterDifficulty) filtered = filtered.filter((q) => q.difficulty === filterDifficulty);
    return filtered;
  }, [questionBank, searchTerm, filterType, filterDifficulty]);

  const selectedQuestions = useMemo(() => {
    const byId = new Map(questionBank.map((question) => [question.id, question]));
    return selectedQuestionIds
      .map((id) => byId.get(id))
      .filter(Boolean);
  }, [questionBank, selectedQuestionIds]);

  const quizStats = useMemo(() => {
    const easy = selectedQuestions.filter((q) => q.difficulty === "EASY").length;
    const medium = selectedQuestions.filter((q) => q.difficulty === "MEDIUM").length;
    const hard = selectedQuestions.filter((q) => q.difficulty === "HARD").length;
    return { easy, medium, hard, total: selectedQuestions.length };
  }, [selectedQuestions]);

  const toggleSelect = (id) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((questionId) => questionId !== id) : [...prev, id]
    );
  };

  // Random with difficulty filter
  const handleRandomize = () => {
    if (!questionBank.length) return;

    let pool = [...questionBank];

    // Filter by difficulty if selected
    if (randomDifficulty) {
      pool = pool.filter((q) => q.difficulty === randomDifficulty);
    }

    if (pool.length === 0) {
      alert(`Không có câu hỏi nào với độ khó "${randomDifficulty || "Tất cả"}".`);
      return;
    }

    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(randomCount, pool.length));
    setSelectedQuestionIds(selected.map((question) => question.id));
  };

  // Delete question from bank
  const handleDeleteQuestion = async (questionId, event) => {
    event.stopPropagation();

    const confirmed = window.confirm("Bạn có chắc muốn xóa câu hỏi này khỏi ngân hàng?");
    if (!confirmed) return;

    try {
      setDeletingQuestionId(questionId);
      await questionApi.deleteQuestion(questionId);

      // Remove from selectedQuestionIds if it's selected
      setSelectedQuestionIds((prev) => prev.filter((id) => id !== questionId));

      // Refresh bank
      await fetchQuestionBank();
    } catch (error) {
      console.error("Delete question failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Xóa câu hỏi thất bại.");
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const handleGenerateAiQuiz = async () => {
    if (!aiRequest.topic.trim()) {
      alert("Vui lòng nhập chủ đề để AI tạo câu hỏi.");
      return;
    }

    try {
      setIsGeneratingAi(true);
      setImportedAiIndices(new Set());

      const payload = {
        topic: aiRequest.topic.trim(),
        context: aiRequest.context?.trim() || null,
        questionCount: Number(aiRequest.questionCount || 5),
        difficulty: aiRequest.difficulty,
        questionType: aiRequest.questionType,
      };

      const response = await quizApi.generateAiQuiz(payload);
      setAiPreview(response?.data?.result?.questions || []);
    } catch (error) {
      console.error("AI quiz generation failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "AI chưa tạo được câu hỏi, vui lòng thử lại.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleImportAiQuestion = async (question, index) => {
    try {
      const answers = Array.isArray(question.answers)
        ? question.answers.map((answer, i) => ({
          content: answer.content,
          correct: !!answer.correct,
          orderIndex: i,
          explanation: answer.explanation || "",
          referenceAnswer: answer.referenceAnswer || "",
        }))
        : [];

      const payload = {
        content: question.content,
        questionType: question.questionType,
        difficulty: question.difficulty,
        orderIndex: 0,
        answers,
      };

      const response = await questionApi.createQuestion(payload);
      const createdId = response?.data?.result?.id;
      if (createdId) {
        setSelectedQuestionIds((prev) => (prev.includes(createdId) ? prev : [...prev, createdId]));
      }

      setImportedAiIndices((prev) => new Set([...prev, index]));

      await fetchQuestionBank();
      return true;
    } catch (error) {
      console.error("Import AI question failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Không thể lưu câu hỏi AI vào ngân hàng.");
      return false;
    }
  };

  // Auto-import ALL AI questions and add to selected
  const handleImportAllAiQuestions = async () => {
    if (aiPreview.length === 0) return;

    const unimported = aiPreview
      .map((q, i) => ({ question: q, index: i }))
      .filter(({ index }) => !importedAiIndices.has(index));

    if (unimported.length === 0) {
      alert("Tất cả câu hỏi đã được lưu vào ngân hàng.");
      return;
    }

    try {
      setIsImportingAll(true);
      setImportProgress({ current: 0, total: unimported.length });

      for (let i = 0; i < unimported.length; i++) {
        const { question, index } = unimported[i];
        setImportProgress({ current: i + 1, total: unimported.length });
        await handleImportAiQuestion(question, index);
      }

      alert(`Đã lưu ${unimported.length} câu hỏi vào ngân hàng và thêm vào đề.`);
    } catch (error) {
      console.error("Import all failed:", error);
    } finally {
      setIsImportingAll(false);
      setImportProgress({ current: 0, total: 0 });
    }
  };

  const handlePublishQuiz = async () => {
    if (!quizInfo.title.trim()) {
      showToast("Vui lòng nhập tiêu đề bài kiểm tra.", "error");
      return;
    }

    if (!selectedQuestionIds.length) {
      showToast("Vui lòng chọn ít nhất 1 câu hỏi.", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const totalQuestions = selectedQuestionIds.length;
      const passScore = Math.max(
        1,
        Math.ceil((Number(quizInfo.passingScore || 70) / 100) * totalQuestions)
      );

      const payload = {
        title: quizInfo.title.trim(),
        description: quizInfo.description || "",
        timeLimitMin: Number(quizInfo.duration || 30),
        passScore,
        aiGenerated: aiPreview.length > 0,
        shuffleQuestions: false,
        shuffleAnswers: false,
        manualQuestions: selectedQuestionIds.map((questionId, index) => ({
          questionId,
          score: 1,
          sortOrder: index,
        })),
      };

      await quizApi.createQuiz(payload);
      showToast("Tạo bài kiểm tra thành công!");
      setTimeout(() => navigate(`${basePath}/dashboard`), 800);
    } catch (error) {
      console.error("Create quiz failed:", error?.response?.data || error);
      showToast(error?.response?.data?.message || "Tạo bài kiểm tra thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveQuestion = (fromIdx, direction) => {
    const newIds = [...selectedQuestionIds];
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= newIds.length) return;
    [newIds[fromIdx], newIds[toIdx]] = [newIds[toIdx], newIds[fromIdx]];
    setSelectedQuestionIds(newIds);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.msg}
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {quizInfo.title || "Bài kiểm tra chưa có tên"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Xây dựng đề thi từ ngân hàng câu hỏi và AI.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/dashboard`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => navigate(`${basePath}/quiz/questions`)}
            className="px-4 py-2 bg-white border border-[#335aa8] text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Tạo câu hỏi thủ công
          </button>
          <button
            onClick={handlePublishQuiz}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Đang xuất bản..." : "Xuất bản"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-8">
        {/* Quiz info + settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex gap-8">
          <div className="w-2/3 space-y-4 border-r border-gray-100 pr-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề bài kiểm tra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tiêu đề"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                value={quizInfo.title}
                onChange={(event) =>
                  setQuizInfo((prev) => ({ ...prev, title: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handlePublishQuiz();
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                rows="3"
                placeholder="Mô tả ngắn về bài kiểm tra"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 resize-none"
                value={quizInfo.description}
                onChange={(event) =>
                  setQuizInfo((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="w-1/3 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cài đặt</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                value={quizInfo.duration}
                onChange={(event) =>
                  setQuizInfo((prev) => ({ ...prev, duration: Number(event.target.value) }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đạt (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                value={quizInfo.passingScore}
                onChange={(event) =>
                  setQuizInfo((prev) => ({ ...prev, passingScore: Number(event.target.value) }))
                }
              />
            </div>
            <p className="text-xs text-gray-500">
              Điểm đạt sẽ được quy đổi theo số câu hỏi đã chọn.
            </p>
          </div>
        </div>

        {/* AI Question Generation */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Tạo câu hỏi bằng AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              placeholder="Chủ đề (VD: React Hooks nâng cao)"
              value={aiRequest.topic}
              onChange={(event) =>
                setAiRequest((prev) => ({ ...prev, topic: event.target.value }))
              }
            />
            <input
              type="number"
              min={1}
              max={20}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              placeholder="Số lượng câu"
              value={aiRequest.questionCount}
              onChange={(event) =>
                setAiRequest((prev) => ({ ...prev, questionCount: Number(event.target.value) }))
              }
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              value={aiRequest.difficulty}
              onChange={(event) =>
                setAiRequest((prev) => ({ ...prev, difficulty: event.target.value }))
              }
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              value={aiRequest.questionType}
              onChange={(event) =>
                setAiRequest((prev) => ({ ...prev, questionType: event.target.value }))
              }
            >
              <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
              <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
              <option value="TRUE_FALSE">TRUE_FALSE</option>
              <option value="SHORT_ANSWER">SHORT_ANSWER</option>
              <option value="ESSAY">ESSAY</option>
            </select>
            <textarea
              rows={2}
              className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 resize-none"
              placeholder="Ngữ cảnh thêm cho AI (không bắt buộc)"
              value={aiRequest.context}
              onChange={(event) =>
                setAiRequest((prev) => ({ ...prev, context: event.target.value }))
              }
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              AI sẽ tạo câu hỏi và tự động lưu vào ngân hàng + thêm vào đề khi bấm "Lưu tất cả".
            </p>
            <button
              onClick={handleGenerateAiQuiz}
              disabled={isGeneratingAi}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-70"
            >
              {isGeneratingAi ? "Đang tạo..." : "Tạo câu hỏi AI"}
            </button>
          </div>

          {/* AI Preview */}
          {aiPreview.length > 0 && (
            <div className="mt-5 border border-blue-100 rounded-lg p-4 bg-blue-50/40 space-y-3">
              {/* Import all button */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-blue-800">
                  AI đã tạo {aiPreview.length} câu hỏi
                  {importedAiIndices.size > 0 && (
                    <span className="ml-2 text-emerald-600">
                      ({importedAiIndices.size}/{aiPreview.length} đã lưu)
                    </span>
                  )}
                </span>
                <button
                  onClick={handleImportAllAiQuestions}
                  disabled={isImportingAll || importedAiIndices.size === aiPreview.length}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {isImportingAll
                    ? `Đang lưu ${importProgress.current}/${importProgress.total}...`
                    : importedAiIndices.size === aiPreview.length
                      ? "✓ Đã lưu tất cả"
                      : "Lưu tất cả & Thêm vào đề"}
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-3">
                {aiPreview.map((question, index) => {
                  const isImported = importedAiIndices.has(index);

                  return (
                    <div
                      key={`${question.content}-${index}`}
                      className={`border rounded-lg p-3 transition-colors ${isImported
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-white border-blue-100"
                        }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{question.content}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {question.questionType} • {question.difficulty}
                          </div>
                        </div>
                        {isImported ? (
                          <span className="text-xs font-bold text-emerald-600 whitespace-nowrap flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Đã lưu
                          </span>
                        ) : (
                          <button
                            onClick={() => handleImportAiQuestion(question, index)}
                            disabled={isImportingAll}
                            className="text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap disabled:opacity-50"
                          >
                            + Lưu câu này
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Question Bank + Selected Questions */}
        <div className="flex gap-8">
          {/* Question Bank */}
          <div className="w-1/2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Ngân hàng câu hỏi</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                {questionBank.length} câu
              </span>
            </div>

            <input
              type="text"
              className="mb-3 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 w-full"
              placeholder="Tìm nhanh câu hỏi theo nội dung..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="flex gap-2 mb-4">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500">
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500">
                {DIFFICULTY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 max-h-[500px]">
              {isLoadingBank ? (
                <div className="text-sm text-gray-500">Đang tải ngân hàng câu hỏi...</div>
              ) : filteredQuestionBank.length === 0 ? (
                <div className="text-sm text-gray-500">Không có câu hỏi phù hợp.</div>
              ) : (
                filteredQuestionBank.map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all group/q relative ${selectedQuestionIds.includes(question.id)
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2" onClick={() => toggleSelect(question.id)}>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 text-sm leading-relaxed">{question.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {question.questionType} •{" "}
                          <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${DIFF_COLORS[question.difficulty] || ""}`}>
                            {question.difficulty}
                          </span>
                          {question.answers?.length > 0 && <span className="ml-1">• {question.answers.length} đáp án</span>}
                        </p>
                        {/* Expand answers */}
                        {expandedQuestionId === question.id && question.answers && (
                          <div className="mt-2 space-y-1">
                            {question.answers.map((a, ai) => (
                              <div key={ai} className={`text-xs px-2 py-1 rounded ${a.correct ? "bg-green-50 text-green-700 font-medium" : "text-gray-500"}`}>
                                {String.fromCharCode(65 + ai)}. {a.content} {a.correct && "✓"}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Expand button */}
                        <button onClick={(e) => { e.stopPropagation(); setExpandedQuestionId(expandedQuestionId === question.id ? null : question.id); }}
                          className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="Xem đáp án">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expandedQuestionId === question.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteQuestion(question.id, e)}
                          disabled={deletingQuestionId === question.id}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover/q:opacity-100"
                          title="Xóa câu hỏi"
                        >
                          {deletingQuestionId === question.id ? (
                            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>

                        {/* Selection indicator */}
                        {selectedQuestionIds.includes(question.id) && (
                          <span className="text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel: Random + Selected Questions */}
          <div className="w-1/2 space-y-6">
            {/* Random section with difficulty filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">Lấy ngẫu nhiên</h3>
                  <p className="text-xs text-gray-500 mt-1">Tự động chọn nhanh từ ngân hàng</p>
                </div>
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Độ khó</label>
                  <select
                    value={randomDifficulty}
                    onChange={(event) => setRandomDifficulty(event.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                  >
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-20">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(questionBank.length, 1)}
                    value={randomCount}
                    onChange={(event) => setRandomCount(Number(event.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-center outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleRandomize}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                  >
                    Trộn đề
                  </button>
                </div>
              </div>
              {randomDifficulty && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Sẽ chỉ lấy câu hỏi có độ khó: {DIFFICULTY_OPTIONS.find((o) => o.value === randomDifficulty)?.label}
                </p>
              )}
            </div>

            {/* Selected Questions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Câu hỏi trong đề</h2>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                  Đã chọn: {selectedQuestionIds.length}
                </span>
              </div>

              {/* Stats bar */}
              {quizStats.total > 0 && (
                <div className="flex gap-2 mb-3 text-[10px] font-bold">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Dễ: {quizStats.easy}</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">TB: {quizStats.medium}</span>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">Khó: {quizStats.hard}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Tổng điểm: {quizStats.total}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {selectedQuestions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm">Chưa có câu hỏi nào được chọn</p>
                  </div>
                ) : (
                  selectedQuestions.map((question, index) => (
                    <div key={question.id}
                      className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                      <span className="text-gray-400 font-bold mt-0.5">#{index + 1}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{question.content}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {question.questionType} • <span className={`font-semibold ${DIFF_COLORS[question.difficulty] || ""} px-1 rounded text-[10px]`}>{question.difficulty}</span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveQuestion(index, -1)} disabled={index === 0}
                          className="text-gray-400 hover:text-blue-500 p-0.5 disabled:opacity-30" title="Lên">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => moveQuestion(index, 1)} disabled={index === selectedQuestions.length - 1}
                          className="text-gray-400 hover:text-blue-500 p-0.5 disabled:opacity-30" title="Xuống">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                      <button onClick={() => toggleSelect(question.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Bỏ chọn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
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
