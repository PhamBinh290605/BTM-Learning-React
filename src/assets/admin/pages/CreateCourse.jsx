import React, { useState } from "react";

const CreateCourse = () => {
  // --- 1. STATE: THÔNG TIN CƠ BẢN ---
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    category: "it",
    level: "beginner",
    isFree: false,
    price: "",
    description: "",
  });

  // --- 2. STATE: KHUNG CHƯƠNG TRÌNH HỌC (CURRICULUM) ---
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: "Chương 1: Giới thiệu tổng quan",
      isExpanded: true,
      lessons: [
        { id: 101, title: "Giới thiệu về khóa học", type: "video" },
        { id: 102, title: "Cài đặt môi trường", type: "document" },
      ],
    },
  ]);

  // --- HÀM XỬ LÝ CHƯƠNG TRÌNH HỌC ---
  const handleAddChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: `Chương ${chapters.length + 1}: Tên chương mới`,
      isExpanded: true,
      lessons: [],
    };
    setChapters([...chapters, newChapter]);
  };

  const handleDeleteChapter = (chapterId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa toàn bộ chương này và các bài học bên trong không?",
    );
    if (confirmDelete) {
      setChapters(chapters.filter((chap) => chap.id !== chapterId));
    }
  };

  // Hàm Lưu Từng Chương (MỚI)
  const handleSaveChapter = (chapterId) => {
    const chapterToSave = chapters.find((chap) => chap.id === chapterId);

    // Ở đây bạn sẽ gọi API gửi chapterToSave lên Backend
    console.log("Đã lưu dữ liệu chương:", chapterToSave);

    // Hiển thị thông báo (Có thể thay bằng thư viện Toast như react-toastify)
    alert(`Đã lưu "${chapterToSave.title}" thành công!`);
  };

  const handleAddLesson = (chapterId, type) => {
    setChapters(
      chapters.map((chap) => {
        if (chap.id === chapterId) {
          return {
            ...chap,
            lessons: [
              ...chap.lessons,
              { id: Date.now(), title: "Bài học mới", type: type },
            ],
          };
        }
        return chap;
      }),
    );
  };

  const toggleChapter = (chapterId) => {
    setChapters(
      chapters.map((chap) =>
        chap.id === chapterId
          ? { ...chap, isExpanded: !chap.isExpanded }
          : chap,
      ),
    );
  };

  const updateChapterTitle = (id, newTitle) => {
    setChapters(
      chapters.map((chap) =>
        chap.id === id ? { ...chap, title: newTitle } : chap,
      ),
    );
  };

  const updateLessonTitle = (chapterId, lessonId, newTitle) => {
    setChapters(
      chapters.map((chap) => {
        if (chap.id === chapterId) {
          return {
            ...chap,
            lessons: chap.lessons.map((les) =>
              les.id === lessonId ? { ...les, title: newTitle } : les,
            ),
          };
        }
        return chap;
      }),
    );
  };

  // --- HÀM LƯU TỔNG THỂ KHÓA HỌC ---
  const handleSaveAll = () => {
    if (!courseInfo.title.trim()) return alert("Vui lòng nhập tên khóa học!");
    console.log("Course Data:", { courseInfo, chapters });
    alert("Xuất bản khóa học thành công!");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Quản lý đào tạo</span>
            <span>/</span>
            <span>Khóa học</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Tạo khóa học mới</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {courseInfo.title || "Khóa học chưa có tên"}
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
            onClick={handleSaveAll}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm"
          >
            Xuất bản khóa học
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 flex gap-8 items-start">
        {/* CỘT TRÁI: THÔNG TIN CƠ BẢN (60%) */}
        <div className="flex-[6] space-y-6">
          {/* Section 1: Thông tin chung */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              1. Thông tin chung
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên khóa học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Lập trình ReactJS từ cơ bản đến nâng cao"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                  value={courseInfo.title}
                  onChange={(e) =>
                    setCourseInfo({ ...courseInfo, title: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                    value={courseInfo.category}
                    onChange={(e) =>
                      setCourseInfo({ ...courseInfo, category: e.target.value })
                    }
                  >
                    <option value="it">Công nghệ thông tin</option>
                    <option value="design">Thiết kế đồ họa</option>
                    <option value="marketing">Marketing & Kinh doanh</option>
                    <option value="language">Ngoại ngữ</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Trình độ
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                    value={courseInfo.level}
                    onChange={(e) =>
                      setCourseInfo({ ...courseInfo, level: e.target.value })
                    }
                  >
                    <option value="beginner">Cơ bản (Người mới bắt đầu)</option>
                    <option value="intermediate">
                      Trung bình (Đã có nền tảng)
                    </option>
                    <option value="advanced">Nâng cao (Chuyên gia)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded font-serif font-bold text-gray-700 w-7">
                      B
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded font-serif italic text-gray-700 w-7">
                      I
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded font-serif underline text-gray-700 w-7">
                      U
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
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
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    rows="4"
                    placeholder="Khóa học này cung cấp kiến thức về..."
                    className="w-full p-4 outline-none resize-y text-sm text-gray-800"
                    value={courseInfo.description}
                    onChange={(e) =>
                      setCourseInfo({
                        ...courseInfo,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 mt-4 w-1/4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                value={courseInfo.status}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, status: e.target.value })
                }
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đang xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </div>
          </div>

          {/* Section 2: Giá bán */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                2. Giá bán
              </h2>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={courseInfo.isFree}
                    onChange={(e) =>
                      setCourseInfo({
                        ...courseInfo,
                        isFree: e.target.checked,
                        price: e.target.checked ? "0" : "",
                      })
                    }
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${courseInfo.isFree ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${courseInfo.isFree ? "transform translate-x-4" : ""}`}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Khóa học miễn phí
                </span>
              </label>

              {!courseInfo.isFree && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Giá bán (VNĐ)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="VD: 599000"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                      value={courseInfo.price}
                      onChange={(e) =>
                        setCourseInfo({ ...courseInfo, price: e.target.value })
                      }
                    />
                    <span className="absolute right-4 top-2.5 text-gray-400 font-medium">
                      đ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="w-1/2">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                3. Ảnh đại diện
              </h2>
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center hover:bg-gray-100 cursor-pointer transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400 mb-2"
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
                <p className="text-sm font-bold text-blue-600 mb-1">
                  Tải ảnh lên
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP (Tỉ lệ 16:9)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG CHƯƠNG TRÌNH HỌC (CURRICULUM - 40%) */}
        <div className="flex-[4] space-y-4 sticky top-24">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Chương trình học
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Xây dựng cấu trúc khóa học
                </p>
              </div>
              <button
                onClick={handleAddChapter}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>+</span> Thêm chương
              </button>
            </div>

            {/* Danh sách các Chương (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {chapters.map((chap, index) => (
                <div
                  key={chap.id}
                  className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-sm"
                >
                  {/* Chapter Header */}
                  <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between group">
                    <div className="flex items-center gap-2 flex-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 cursor-move"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8h16M4 16h16"
                        />
                      </svg>

                      <input
                        type="text"
                        className="font-bold text-gray-800 bg-transparent outline-none flex-1 border-b border-transparent focus:border-blue-400 text-sm py-1"
                        value={chap.title}
                        onChange={(e) =>
                          updateChapterTitle(chap.id, e.target.value)
                        }
                      />
                    </div>

                    <button
                      onClick={() => toggleChapter(chap.id)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform ${chap.isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Chapter Content (Lessons & Actions) */}
                  {chap.isExpanded && (
                    <div className="p-3 space-y-3">
                      {/* Danh sách bài học */}
                      <div className="space-y-2">
                        {chap.lessons.length === 0 ? (
                          <p className="text-xs text-center text-gray-400 py-2">
                            Chưa có nội dung nào.
                          </p>
                        ) : (
                          chap.lessons.map((les) => (
                            <div
                              key={les.id}
                              className="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-200 shadow-sm group"
                            >
                              {/* Icon type */}
                              {les.type === "video" ? (
                                <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                  </svg>
                                </div>
                              ) : les.type === "quiz" ? (
                                <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 100-2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}

                              <input
                                type="text"
                                className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none border-b border-transparent focus:border-blue-400"
                                value={les.title}
                                onChange={(e) =>
                                  updateLessonTitle(
                                    chap.id,
                                    les.id,
                                    e.target.value,
                                  )
                                }
                              />

                              <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Nút thêm nội dung */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddLesson(chap.id, "video")}
                          className="flex-1 py-1.5 border border-dashed border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-white hover:text-blue-600 transition-colors"
                        >
                          + Bài học
                        </button>
                        <button
                          onClick={() => handleAddLesson(chap.id, "quiz")}
                          className="flex-1 py-1.5 border border-dashed border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-white hover:text-purple-600 transition-colors"
                        >
                          + Bài thi
                        </button>
                      </div>

                      {/* THANH CÔNG CỤ QUẢN LÝ CHƯƠNG (MỚI THÊM) */}
                      <div className="flex justify-end items-center gap-2 pt-3 mt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleDeleteChapter(chap.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Xóa chương
                        </button>
                        <button
                          onClick={() => handleSaveChapter(chap.id)}
                          className="px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded transition-colors flex items-center gap-1.5"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                          Lưu chương này
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
