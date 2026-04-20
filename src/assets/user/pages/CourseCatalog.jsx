import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";
import courseApi from "../../../api/courseApi";
import categoryApi from "../../../api/categoryApi";

const COURSE_COLOR_POOL = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-400 to-red-500",
  "from-gray-600 to-gray-800",
  "from-amber-400 to-orange-500",
  "from-green-600 to-emerald-500",
  "from-sky-500 to-blue-600",
  "from-cyan-500 to-blue-500",
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeLevel = (level) => {
  if (!level) return "Tất cả trình độ";

  const normalized = String(level).toUpperCase();
  if (normalized === "BEGINNER") return "Cơ bản";
  if (normalized === "INTERMEDIATE") return "Trung cấp";
  if (normalized === "ADVANCED") return "Nâng cao";

  return String(level);
};

const CourseCatalog = () => {
  const navigate = useNavigate();

  const LEVELS = ["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao", "Tất cả trình độ"];
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
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCatalogData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseApi.getCourses(),
          categoryApi.getCategories(),
        ]);

        const courseList = Array.isArray(coursesResponse?.data?.result)
          ? coursesResponse.data.result
          : [];
        const categoryList = Array.isArray(categoriesResponse?.data?.result)
          ? categoriesResponse.data.result
          : [];

        const mappedCourses = courseList.map((course, index) => ({
          id: course.id,
          title: course.title,
          instructor: course?.instructor?.fullName || "BTM Learning",
          category: course?.category?.name || "Khóa học",
          thumbnailUrl: course.thumbnailUrl,
          price: toNumber(course.price),
          originalPrice: toNumber(course.originalPrice || course.price),
          rating: toNumber(course.avgRating),
          students: toNumber(course.totalStudents),
          reviewCount: toNumber(course.totalStudents),
          color: COURSE_COLOR_POOL[index % COURSE_COLOR_POOL.length],
          level: normalizeLevel(course.level),
          updatedAt: course.updateAt || course.createAt,
        }));

        const categoryNames = categoryList
          .map((category) => category?.name)
          .filter(Boolean);

        if (!isMounted) return;

        setAllCourses(mappedCourses);
        setCategories(["Tất cả", ...categoryNames]);
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không tải được danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCatalogData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── FILTERED & SORTED ───
  const filteredCourses = useMemo(() => {
    let result = allCourses;

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
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
        );
        break;
      case "popular":
      default:
        result = [...result].sort((a, b) => b.students - a.students);
        break;
    }

    return result;
  }, [allCourses, searchTerm, selectedCategory, selectedLevel, selectedPrice, sortBy]);

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
                  {categories.map((cat) => (
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

            {!!errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`catalog-skeleton-${index}`}
                    className="h-80 rounded-2xl border border-slate-200 bg-white animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
                  />
                ))}
              </div>
            )}

            {/* Course Grid */}
            {!isLoading && filteredCourses.length === 0 ? (
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
            ) : !isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => navigate(`/course/${course.id}`)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;
