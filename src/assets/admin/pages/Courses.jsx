/* eslint-disable react-hooks/set-state-in-effect */
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import courseApi from "../../../api/courseApi";

const COLOR_PALETTE = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-green-400 to-emerald-600",
  "from-orange-400 to-red-500",
  "from-gray-600 to-gray-800",
];

const mapStatusForUi = (status) => {
  if (status === "ACTIVE" || status === "PUBLISHED") return "published";
  if (status === "ARCHIVED" || status === "INACTIVE") return "archived";
  return "draft";
};

const CourseManagement = () => {
  // --- 1. MOCK DATA: DANH SÁCH KHÓA HỌC ---
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Lập trình ReactJS & Next.js Thực chiến",
      category: "Công nghệ thông tin",
      price: 599000,
      status: "published",
      students: 1240,
      rating: 4.8,
      updatedAt: "16/04/2026",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      title: "Thiết kế UI/UX với Figma cơ bản",
      category: "Thiết kế đồ họa",
      price: 0,
      status: "published",
      students: 850,
      rating: 4.9,
      updatedAt: "14/04/2026",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Tiếng Anh giao tiếp cho IT",
      category: "Ngoại ngữ",
      price: 299000,
      status: "draft",
      students: 0,
      rating: 0,
      updatedAt: "15/04/2026",
      color: "from-green-400 to-emerald-600",
    },
    {
      id: 4,
      title: "Marketing cơ bản cho Developer",
      category: "Marketing",
      price: 199000,
      status: "archived",
      students: 320,
      rating: 4.5,
      updatedAt: "01/04/2026",
      color: "from-orange-400 to-red-500",
    },
    {
      id: 5,
      title: "Làm chủ Docker & CI/CD",
      category: "Công nghệ thông tin",
      price: 799000,
      status: "draft",
      students: 0,
      rating: 0,
      updatedAt: "16/04/2026",
      color: "from-gray-600 to-gray-800",
    },
  ]);

  // --- 2. STATE: BỘ LỌC VÀ TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // --- 3. HÀM XỬ LÝ LỌC DỮ LIỆU ---
  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" || course.status === filterStatus;
    const matchCategory =
      filterCategory === "all" || course.category.includes(filterCategory);
    return matchSearch && matchStatus && matchCategory;
  });

  // --- 4. HÀM XÓA KHÓA HỌC ---
  const handleDelete = async (id, title) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}" không?`)
    ) {
      try {
        await courseApi.deleteCourse(id);
        setCourses((prev) => prev.filter((course) => course.id !== id));
      } catch (error) {
        console.error("Delete course failed:", error?.response?.data || error);
        alert(error?.response?.data?.message || "Xóa khóa học thất bại");
      }
    }
  };

  // Helper format tiền tệ
  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return price.toLocaleString("vi-VN") + " đ";
  };

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";
  const [categories, setCategories] = useState([]);

  const fetchCourses = useCallback(async () => {
    try {
      const [coursesResponse, categoriesResponse] = await Promise.all([
        courseApi.getCourses(),
        categoryApi.getCategories(),
      ]);

      const fetchedCourses = coursesResponse?.data?.result || [];
      setCourses(
        fetchedCourses.map((course, index) => ({
          id: course.id,
          title: course.title,
          category: course.category?.name || "Chưa phân loại",
          price: Number(course.price || 0),
          status: mapStatusForUi(course.status),
          students: Number(course.totalStudents || 0),
          rating: Number(course.avgRating || 0),
          updatedAt: course.updateAt
            ? new Date(course.updateAt).toLocaleDateString("vi-VN")
            : "--",
          color: COLOR_PALETTE[index % COLOR_PALETTE.length],
        }))
      );
      setCategories(categoriesResponse?.data?.result || []);
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data || error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleNavigateToUpdate = (id) => {
    navigate(`${basePath}/courses/update/${id}`);
  };

  const handleAddNewCourse = async () => {
    try {
      const categoryId = categories[0]?.id;

      if (!categoryId) {
        alert("Vui lòng tạo danh mục trước khi tạo khóa học.");
        return;
      }

      const payload = {
        title: "Khóa học mới",
        slug: `khoa-hoc-${Date.now()}`,
        description: "Mô tả khóa học",
        price: 0,
        status: "DRAFT",
        level: "BEGINNER",
        avgRating: 0,
        totalStudents: 0,
        publishDate: null,
        fileUploadId: null,
        categoryId,
      };

      const response = await courseApi.createCourse(payload);
      const courseId = response?.data?.result?.id;

      if (courseId) {
        handleNavigateToUpdate(courseId);
      }
    } catch (error) {
      console.error("Failed to create course:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Tạo khóa học thất bại");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Quản lý Khóa học
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem, chỉnh sửa và quản lý nội dung đào tạo của bạn.
          </p>
        </div>
        <div>
          <button
            onClick={() => handleAddNewCourse()}
            className="bg-[#1a2b4c] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tạo khóa học mới
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        {/* THỐNG KÊ NHANH (Quick Stats) */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Tổng số khóa học
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {courses.length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Đang xuất bản</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {courses.filter((c) => c.status === "published").length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0">
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
              <p className="text-sm text-gray-500 font-medium">Bản nháp</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {courses.filter((c) => c.status === "draft").length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tổng học viên</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {courses
                  .reduce((acc, curr) => acc + curr.students, 0)
                  .toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* TOOLBAR: SEARCH & FILTER */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center gap-4">
          {/* Ô Tìm kiếm */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Bộ lọc */}
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đang xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU (DATA TABLE) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Khóa học</th>
                  <th className="px-6 py-4">Giá</th>
                  <th className="px-6 py-4 text-center">Học viên</th>
                  <th className="px-6 py-4 text-center">Đánh giá</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy khóa học nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Cột 1: Thông tin khóa học */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {/* Giả lập Thumbnail */}
                          <div
                            className={`w-16 h-12 rounded-lg bg-gradient-to-br ${course.color} shadow-inner shrink-0 flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition-opacity`}
                          >
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
                                strokeWidth={1.5}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors line-clamp-1">
                              {course.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {course.category}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className="text-xs text-gray-400">
                                Cập nhật: {course.updatedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Giá */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${course.price === 0 ? "text-green-600" : "text-gray-900"}`}
                        >
                          {formatPrice(course.price)}
                        </span>
                      </td>

                      {/* Cột 3: Học viên */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {course.students.toLocaleString()}
                        </span>
                      </td>

                      {/* Cột 4: Đánh giá (Star Rating) */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {course.rating > 0 ? (
                          <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-700">
                            <span>{course.rating}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-yellow-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-medium">
                            Chưa có
                          </span>
                        )}
                      </td>

                      {/* Cột 5: Trạng thái (Badges) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {course.status === "published" && (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-700">
                            Đang xuất bản
                          </span>
                        )}
                        {course.status === "draft" && (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-600">
                            Bản nháp
                          </span>
                        )}
                        {course.status === "archived" && (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-orange-100 text-orange-700">
                            Đã lưu trữ
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Hành động (Buttons) */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleNavigateToUpdate(course.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa khóa học"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa khóa học"
                            onClick={() =>
                              handleDelete(course.id, course.title)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors ml-1"
                            title="Tùy chọn khác"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (Phân trang giả lập) */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Đang hiển thị{" "}
              <span className="font-bold text-gray-900">
                {filteredCourses.length}
              </span>{" "}
              khóa học
            </span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-400 cursor-not-allowed">
                Trước
              </button>
              <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 font-bold rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm text-gray-600 font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
