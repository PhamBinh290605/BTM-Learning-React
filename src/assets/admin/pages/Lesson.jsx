import React, { useState } from "react";

const CreateLesson = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [lessonData, setLessonData] = useState({
    title: "",
    objective: "",
    duration: 15,
    allowComments: true,
    isRequired: true,
  });

  // Quản lý loại nội dung đang được chọn: 'video', 'text', hoặc 'document'
  const [contentType, setContentType] = useState("video");
  const [videoUrl, setVideoUrl] = useState("");

  // --- HÀM XỬ LÝ LƯU ---
  const handleSave = () => {
    if (!lessonData.title.trim()) {
      alert("Vui lòng nhập tên bài học!");
      return;
    }
    console.log("Dữ liệu bài học:", { ...lessonData, contentType, videoUrl });
    alert("Đã lưu bài học thành công!");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Khóa học: React & Next.js</span>
            <span>/</span>
            <span>Chương 1: Mở đầu</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Tạo bài học</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {lessonData.title || "Bài học chưa có tên"}
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Hủy bỏ
          </button>
          <button className="px-4 py-2 bg-white border border-[#1a2b4c] text-[#1a2b4c] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Lưu nháp
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm flex items-center gap-2"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Xuất bản
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-6xl mx-auto px-8 pt-8 flex gap-8 items-start">
        {/* CỘT TRÁI: NỘI DUNG CHÍNH (70%) */}
        <div className="flex-[7] space-y-6">
          {/* 1. Thông tin cơ bản */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên bài học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Bài 1 - Giới thiệu về React Hook..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-gray-800 font-medium"
                  value={lessonData.title}
                  onChange={(e) =>
                    setLessonData({ ...lessonData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mục tiêu bài học (Tóm tắt)
                </label>
                <textarea
                  rows="2"
                  placeholder="Sau bài học này, học viên sẽ nắm được..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-shadow resize-none text-sm text-gray-700"
                  value={lessonData.objective}
                  onChange={(e) =>
                    setLessonData({ ...lessonData, objective: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* 2. Trình biên soạn Nội dung (Content Editor) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Thanh Tabs chọn loại nội dung */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
              <button
                onClick={() => setContentType("video")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${contentType === "video" ? "bg-white shadow-sm border border-gray-200 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Video bài giảng
              </button>
              <button
                onClick={() => setContentType("text")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${contentType === "text" ? "bg-white shadow-sm border border-gray-200 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                Bài đọc (Text)
              </button>
              <button
                onClick={() => setContentType("document")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${contentType === "document" ? "bg-white shadow-sm border border-gray-200 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                Tài liệu PDF/Slide
              </button>
            </div>

            {/* Vùng nhập liệu động dựa theo Tab */}
            <div className="p-6">
              {/* TAB 1: VIDEO */}
              {contentType === "video" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Đường dẫn Video (YouTube, Vimeo...)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Tải lên file mp4
                      </button>
                    </div>
                  </div>

                  {/* Khung mô phỏng Video Preview */}
                  <div className="w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-2 opacity-50"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      Bản xem trước Video sẽ hiển thị tại đây
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: TEXT EDITOR */}
              {contentType === "text" && (
                <div className="animate-fade-in border border-gray-200 rounded-lg overflow-hidden">
                  {/* Thanh công cụ giả lập của Rich Text Editor */}
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2 flex-wrap">
                    <select className="border-none bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer">
                      <option>Normal Text</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 font-serif font-bold w-8">
                      B
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 font-serif italic w-8">
                      I
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 font-serif underline w-8">
                      U
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
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
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    className="w-full h-80 p-4 outline-none resize-y text-gray-800"
                    placeholder="Bắt đầu soạn thảo bài giảng của bạn..."
                  ></textarea>
                </div>
              )}

              {/* TAB 3: DOCUMENT UPLOAD */}
              {contentType === "document" && (
                <div className="animate-fade-in">
                  <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer cursor-pointer">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Kéo thả tài liệu vào đây
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Hỗ trợ định dạng PDF, PPTX, DOCX (Tối đa 50MB)
                    </p>
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
                      Chọn file từ máy tính
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CÀI ĐẶT & TÀI LIỆU ĐÍNH KÈM (30%) */}
        <div className="flex-[3] space-y-6">
          {/* Box Cài đặt hiển thị */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Cài đặt bài học
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Thời lượng dự kiến
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-2 outline-none focus:border-blue-500"
                    value={lessonData.duration}
                    onChange={(e) =>
                      setLessonData({
                        ...lessonData,
                        duration: Number(e.target.value),
                      })
                    }
                  />
                  <span className="absolute right-4 top-2 text-gray-400 text-sm font-medium">
                    phút
                  </span>
                </div>
              </div>

              {/* Các Toggle Switch */}
              <div className="pt-2 border-t border-gray-100 space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
                    Bắt buộc hoàn thành
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={lessonData.isRequired}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          isRequired: e.target.checked,
                        })
                      }
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${lessonData.isRequired ? "bg-[#1a2b4c]" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${lessonData.isRequired ? "transform translate-x-4" : ""}`}
                    ></div>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
                    Cho phép bình luận
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={lessonData.allowComments}
                      onChange={(e) =>
                        setLessonData({
                          ...lessonData,
                          allowComments: e.target.checked,
                        })
                      }
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${lessonData.allowComments ? "bg-[#1a2b4c]" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${lessonData.allowComments ? "transform translate-x-4" : ""}`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Box Tài liệu đính kèm */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-gray-900">Tài liệu tham khảo</h3>
              <span className="text-xs text-gray-400 font-medium">
                Tùy chọn
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Thêm các file PDF, Source Code hoặc Link để học viên tải về.
            </p>

            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-center gap-2">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Đính kèm file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
