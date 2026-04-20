import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import fileUploadApi from "../../../api/fileUploadApi";
import lessonApi from "../../../api/lessonApi";

const LESSON_TYPES = [
  { value: "VIDEO", label: "Video bài giảng" },
  { value: "DOCUMENT", label: "Tài liệu" },
  { value: "QUIZ", label: "Bài kiểm tra" },
];

const CreateLesson = () => {
  const [searchParams] = useSearchParams();
  const courseId = Number(searchParams.get("courseId"));
  const sectionId = Number(searchParams.get("sectionId"));
  const defaultType = (searchParams.get("type") || "VIDEO").toUpperCase();

  const [lessonData, setLessonData] = useState({
    title: "",
    duration: 15,
    isPreview: false,
    lessonType: LESSON_TYPES.some((item) => item.value === defaultType) ? defaultType : "VIDEO",
    quizId: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  const hasValidContext = useMemo(() => Number.isFinite(courseId) && Number.isFinite(sectionId), [courseId, sectionId]);

  const resolveFileType = () => {
    if (lessonData.lessonType === "VIDEO") return "VIDEO";
    return "DOCUMENT";
  };

  const handleSave = async () => {
    if (!hasValidContext) {
      alert("Thiếu courseId hoặc sectionId. Vui lòng quay lại màn tạo khóa học.");
      return;
    }

    if (!lessonData.title.trim()) {
      alert("Vui lòng nhập tên bài học.");
      return;
    }

    let fileUploadId = null;

    try {
      setIsSaving(true);

      if (lessonData.lessonType === "VIDEO" || lessonData.lessonType === "DOCUMENT") {
        if (!selectedFile) {
          alert("Vui lòng chọn file trước khi lưu bài học.");
          return;
        }

        const uploadResponse = await fileUploadApi.uploadFiles({
          files: [selectedFile],
          fileType: resolveFileType(),
          folderName: "btm-learning/lessons",
        });

        const uploaded = uploadResponse?.data?.result || [];
        fileUploadId = uploaded[0]?.id;

        if (!fileUploadId) {
          throw new Error("File upload did not return file id");
        }
      }

      if (lessonData.lessonType === "QUIZ" && !lessonData.quizId) {
        alert("Vui lòng nhập quizId để tạo bài học quiz.");
        return;
      }

      const payload = {
        title: lessonData.title.trim(),
        orderIndex: 0,
        lessonType: lessonData.lessonType,
        durationSeconds: Number(lessonData.duration || 0) * 60,
        isPreview: lessonData.isPreview,
        sectionId,
        courseId,
        fileUploadId,
        quizId: lessonData.lessonType === "QUIZ" ? Number(lessonData.quizId) : null,
      };

      await lessonApi.createLesson(payload);
      alert("Đã tạo bài học thành công.");
      navigate(`${basePath}/courses/update/${courseId}`);
    } catch (error) {
      console.error("Create lesson failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Tạo bài học thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {lessonData.title || "Tạo bài học mới"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Course #{courseId || "--"} • Section #{sectionId || "--"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/courses/update/${courseId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSaving ? "Đang lưu..." : "Lưu bài học"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-8 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lessonData.title}
              onChange={(event) => setLessonData((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              placeholder="VD: Bài 1 - Giới thiệu"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Loại bài học</label>
              <select
                value={lessonData.lessonType}
                onChange={(event) => setLessonData((prev) => ({ ...prev, lessonType: event.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              >
                {LESSON_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Thời lượng (phút)</label>
              <input
                type="number"
                min={1}
                value={lessonData.duration}
                onChange={(event) =>
                  setLessonData((prev) => ({ ...prev, duration: Number(event.target.value) }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={lessonData.isPreview}
                  onChange={(event) =>
                    setLessonData((prev) => ({ ...prev, isPreview: event.target.checked }))
                  }
                />
                Cho phép xem thử
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          {lessonData.lessonType === "QUIZ" ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Quiz ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={lessonData.quizId}
                onChange={(event) =>
                  setLessonData((prev) => ({ ...prev, quizId: event.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                placeholder="Nhập ID bài kiểm tra đã tạo"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tạo quiz trước tại màn Bài kiểm tra, sau đó dán quizId vào đây.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tệp nội dung <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept={lessonData.lessonType === "VIDEO" ? "video/*" : ".pdf,.ppt,.pptx,.doc,.docx"}
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                File sẽ được upload và liên kết vào bài học tự động.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
