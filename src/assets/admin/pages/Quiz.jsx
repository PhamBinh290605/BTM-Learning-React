import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import questionApi from "../../../api/questionApi";
import quizApi from "../../../api/quizApi";

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
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoadingBank, setIsLoadingBank] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiRequest, setAiRequest] = useState({
    topic: "",
    context: "",
    questionCount: 5,
    difficulty: "MEDIUM",
    questionType: "SINGLE_CHOICE",
  });
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiPreview, setAiPreview] = useState([]);

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
        pageSize: 100,
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

  const filteredQuestionBank = useMemo(() => {
    if (!searchTerm.trim()) return questionBank;

    const keyword = searchTerm.trim().toLowerCase();
    return questionBank.filter((question) =>
      question.content?.toLowerCase().includes(keyword)
    );
  }, [questionBank, searchTerm]);

  const selectedQuestions = useMemo(() => {
    const byId = new Map(questionBank.map((question) => [question.id, question]));
    return selectedQuestionIds
      .map((id) => byId.get(id))
      .filter(Boolean);
  }, [questionBank, selectedQuestionIds]);

  const toggleSelect = (id) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((questionId) => questionId !== id) : [...prev, id]
    );
  };

  const handleRandomize = () => {
    if (!questionBank.length) return;

    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(randomCount, questionBank.length));
    setSelectedQuestionIds(selected.map((question) => question.id));
  };

  const handleGenerateAiQuiz = async () => {
    if (!aiRequest.topic.trim()) {
      alert("Vui lòng nhập chủ đề để AI tạo câu hỏi.");
      return;
    }

    try {
      setIsGeneratingAi(true);

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

  const handleImportAiQuestion = async (question) => {
    try {
      const answers = Array.isArray(question.answers)
        ? question.answers.map((answer, index) => ({
            content: answer.content,
            correct: !!answer.correct,
            orderIndex: index,
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

      await fetchQuestionBank();
    } catch (error) {
      console.error("Import AI question failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Không thể lưu câu hỏi AI vào ngân hàng.");
    }
  };

  const handlePublishQuiz = async () => {
    if (!quizInfo.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài kiểm tra.");
      return;
    }

    if (!selectedQuestionIds.length) {
      alert("Vui lòng chọn ít nhất 1 câu hỏi.");
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
      alert("Tạo bài kiểm tra thành công.");
      navigate(`${basePath}/dashboard`);
    } catch (error) {
      console.error("Create quiz failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Tạo bài kiểm tra thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
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
              AI chỉ tạo bản nháp. Bạn cần lưu câu hỏi vào ngân hàng trước khi thêm vào đề.
            </p>
            <button
              onClick={handleGenerateAiQuiz}
              disabled={isGeneratingAi}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-70"
            >
              {isGeneratingAi ? "Đang tạo..." : "Tạo câu hỏi AI"}
            </button>
          </div>

          {aiPreview.length > 0 && (
            <div className="mt-5 border border-blue-100 rounded-lg p-4 bg-blue-50/40 space-y-3 max-h-64 overflow-y-auto">
              {aiPreview.map((question, index) => (
                <div key={`${question.content}-${index}`} className="bg-white border border-blue-100 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-800">{question.content}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {question.questionType} • {question.difficulty}
                  </div>
                  <button
                    onClick={() => handleImportAiQuestion(question)}
                    className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    + Lưu vào ngân hàng câu hỏi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="w-1/2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Ngân hàng câu hỏi</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                {questionBank.length} câu
              </span>
            </div>

            <input
              type="text"
              className="mb-4 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              placeholder="Tìm nhanh câu hỏi theo nội dung..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="space-y-3 overflow-y-auto pr-2 max-h-[500px]">
              {isLoadingBank ? (
                <div className="text-sm text-gray-500">Đang tải ngân hàng câu hỏi...</div>
              ) : filteredQuestionBank.length === 0 ? (
                <div className="text-sm text-gray-500">Không có câu hỏi phù hợp.</div>
              ) : (
                filteredQuestionBank.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => toggleSelect(question.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedQuestionIds.includes(question.id)
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-medium text-gray-700 text-sm leading-relaxed">{question.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {question.questionType} • {question.difficulty}
                        </p>
                      </div>
                      {selectedQuestionIds.includes(question.id) && (
                        <span className="text-blue-600 mt-0.5">
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
                ))
              )}
            </div>
          </div>

          <div className="w-1/2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">Lấy ngẫu nhiên</h3>
                <p className="text-xs text-gray-500 mt-1">Tự động chọn nhanh từ ngân hàng</p>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min="1"
                  max={Math.max(questionBank.length, 1)}
                  value={randomCount}
                  onChange={(event) => setRandomCount(Number(event.target.value))}
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

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Câu hỏi trong đề</h2>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                  Đã chọn: {selectedQuestionIds.length}
                </span>
              </div>

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
                    <div
                      key={question.id}
                      className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100 group"
                    >
                      <span className="text-gray-400 font-bold mt-0.5">#{index + 1}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{question.content}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {question.questionType} • {question.difficulty}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSelect(question.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                        title="Bỏ chọn"
                      >
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
