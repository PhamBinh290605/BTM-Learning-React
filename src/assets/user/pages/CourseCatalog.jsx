import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";

// import { getCourses } from "../../../api/courses";

const CourseCatalog = () => {
  const navigate = useNavigate();

  // ─── MOCK DATA ───
  const ALL_COURSES = [
    { id: 1, title: "Lập trình ReactJS & Next.js Fullstack 2026", instructor: "Minh Hoàng", category: "Công nghệ thông tin", price: 599000, rating: 4.8, students: 12400, reviewCount: 2840, color: "from-blue-500 to-cyan-400", level: "Trung cấp" },
    { id: 2, title: "Thiết kế UI/UX chuyên nghiệp với Figma", instructor: "Thu Hà", category: "Thiết kế đồ họa", price: 0, rating: 4.9, students: 8500, reviewCount: 1920, color: "from-purple-500 to-pink-500", level: "Cơ bản" },
    { id: 3, title: "Python cho Data Science & Machine Learning", instructor: "Quang Đức", category: "Khoa học dữ liệu", price: 799000, rating: 4.7, students: 6200, reviewCount: 1540, color: "from-emerald-500 to-teal-500", level: "Nâng cao" },
    { id: 4, title: "Digital Marketing A-Z cho người mới", instructor: "Thanh Tùng", category: "Marketing", price: 399000, rating: 4.6, students: 9800, reviewCount: 2100, color: "from-orange-400 to-red-500", level: "Cơ bản" },
    { id: 5, title: "Làm chủ Docker, Kubernetes & CI/CD", instructor: "Văn Nam", category: "Công nghệ thông tin", price: 699000, rating: 4.8, students: 4300, reviewCount: 980, color: "from-gray-600 to-gray-800", level: "Nâng cao" },
    { id: 6, title: "Tiếng Anh giao tiếp chuyên ngành IT", instructor: "Ngọc Anh", category: "Ngoại ngữ", price: 299000, rating: 4.5, students: 15600, reviewCount: 3400, color: "from-amber-400 to-orange-500", level: "Cơ bản" },
    { id: 7, title: "Node.js & Express Backend Masterclass", instructor: "Minh Hoàng", category: "Công nghệ thông tin", price: 499000, rating: 4.7, students: 5600, reviewCount: 1200, color: "from-green-600 to-emerald-500", level: "Trung cấp" },
    { id: 8, title: "Adobe Photoshop từ A đến Z", instructor: "Bảo Khanh", category: "Thiết kế đồ họa", price: 349000, rating: 4.4, students: 7800, reviewCount: 1680, color: "from-sky-500 to-blue-600", level: "Cơ bản" },
    { id: 9, title: "Flutter & Dart - Ứng dụng di động", instructor: "Phúc Thịnh", category: "Công nghệ thông tin", price: 649000, rating: 4.6, students: 3200, reviewCount: 720, color: "from-cyan-500 to-blue-500", level: "Trung cấp" },
  ];

  const CATEGORIES = ["Tất cả", "Công nghệ thông tin", "Thiết kế đồ họa", "Marketing", "Khoa học dữ liệu", "Ngoại ngữ"];
  const LEVELS = ["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao"];
  const PRICE_FILTERS = ["Tất cả", "Miễn phí", "Có phí"];
  const SORT_OPTIONS = [
    { value: "popular", label: "Phổ biến nhất" },
    { value: "rating", label: "Đánh giá cao" },
    { value: "newest", label: "Mới nhất" },
    { value: "price-asc", label: "Giá thấp → cao" },
    { value: "price-desc", label: "Giá cao → thấp" },
  ];

  // ─── STATE ───
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("popular");

  // ─── FILTERED & SORTED ───
  const filteredCourses = useMemo(() => {
    let result = ALL_COURSES;

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "Tất cả") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedLevel !== "Tất cả") {
      result = result.filter((c) => c.level === selectedLevel);
    }

    if (selectedPrice === "Miễn phí") {
      result = result.filter((c) => c.price === 0);
    } else if (selectedPrice === "Có phí") {
      result = result.filter((c) => c.price > 0);
    }

    switch (sortBy) {
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        result = [...result].sort((a, b) => b.students - a.students);
        break;
    }

    return result;
  }, [searchTerm, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setSelectedLevel("Tất cả");
    setSelectedPrice("Tất cả");
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-900/50 dark:to-violet-900/50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Khám phá khóa học
          </h1>
          <p className="text-white/70 mb-6">
            Tìm kiếm và lọc trong hơn 12,000 khóa học chất lượng cao
          </p>
          <div className="max-w-xl">
            <SearchBar variant="compact" onSearch={setSearchTerm} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Bộ lọc
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Danh mục
                </h4>
                <div className="space-y-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Trình độ
                </h4>
                <div className="space-y-1.5">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedLevel === level
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Giá
                </h4>
                <div className="space-y-1.5">
                  {PRICE_FILTERS.map((price) => (
                    <button
                      key={price}
                      onClick={() => setSelectedPrice(price)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedPrice === price
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Hiển thị{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {filteredCourses.length}
                </span>{" "}
                khóa học
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Không tìm thấy khóa học
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
