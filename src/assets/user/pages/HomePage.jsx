import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CourseCard from "../components/CourseCard";
import CategoryCard from "../components/CategoryCard";
import TestimonialCard from "../components/TestimonialCard";
import StatCounter from "../components/StatCounter";
import AIRecommendationsSection from "../components/AIRecommendationsSection";
import courseApi from "../../../api/courseApi";
import categoryApi from "../../../api/categoryApi";
import courseReviewApi from "../../../api/courseReviewApi";

const CATEGORY_ICON_COLOR_POOL = [
  { icon: "💻", color: "from-blue-500 to-cyan-400" },
  { icon: "🎨", color: "from-purple-500 to-pink-500" },
  { icon: "📢", color: "from-orange-400 to-red-500" },
  { icon: "💼", color: "from-emerald-500 to-teal-500" },
  { icon: "🌍", color: "from-amber-400 to-orange-500" },
  { icon: "📊", color: "from-indigo-500 to-violet-500" },
];

const COURSE_COLOR_POOL = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-400 to-red-500",
  "from-gray-600 to-gray-800",
  "from-amber-400 to-orange-500",
];

const AVATAR_COLOR_POOL = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-400 to-red-500",
  "from-indigo-500 to-violet-500",
  "from-amber-400 to-orange-500",
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        setIsLoadingCatalog(true);
        setCatalogError("");

        const [categoriesResponse, coursesResponse] = await Promise.all([
          categoryApi.getCategories(),
          courseApi.getCourses(),
        ]);

        const categoryList = Array.isArray(categoriesResponse?.data?.result)
          ? categoriesResponse.data.result
          : [];
        const courseList = Array.isArray(coursesResponse?.data?.result)
          ? coursesResponse.data.result
          : [];

        // Filter only ACTIVE/PUBLISHED courses for public display
        const activeCourses = courseList.filter(
          (course) =>
            course.status === "ACTIVE" || course.status === "PUBLISHED"
        );

        const courseCountByCategory = activeCourses.reduce(
          (accumulator, course) => {
            const categoryName = course?.category?.name || "Khác";
            accumulator[categoryName] = (accumulator[categoryName] || 0) + 1;
            return accumulator;
          },
          {}
        );

        const mappedCategories = categoryList
          .slice(0, 6)
          .map((category, index) => {
            const palette =
              CATEGORY_ICON_COLOR_POOL[index % CATEGORY_ICON_COLOR_POOL.length];

            return {
              id: category.id,
              name: category.name,
              icon: palette.icon,
              color: palette.color,
              courseCount: courseCountByCategory[category.name] || 0,
            };
          });

        const mappedCourses = [...activeCourses]
          .sort(
            (firstCourse, secondCourse) =>
              toNumber(secondCourse.totalStudents) -
              toNumber(firstCourse.totalStudents)
          )
          .slice(0, 6)
          .map((course, index) => ({
            id: course.id,
            title: course.title,
            instructor: course?.instructor?.fullName || "BTM Learning",
            category: course?.category?.name || "Khóa học",
            thumbnailUrl: course.thumbnailUrl,
            price: toNumber(course.price),
            originalPrice: toNumber(course.originalPrice || course.price),
            rating: toNumber(course.avgRating),
            students: toNumber(course.totalStudents),
            reviewCount: 0,
            color: COURSE_COLOR_POOL[index % COURSE_COLOR_POOL.length],
          }));

        if (!isMounted) return;

        setCategories(mappedCategories);
        setPopularCourses(mappedCourses);

        // Fetch real 5-star reviews from popular courses
        loadTestimonials(mappedCourses.map((c) => c.id));
      } catch {
        if (!isMounted) return;
        setCatalogError(
          "Không tải được dữ liệu khóa học trang chủ. Vui lòng thử lại sau."
        );
      } finally {
        if (isMounted) {
          setIsLoadingCatalog(false);
        }
      }
    };

    const loadTestimonials = async (courseIds) => {
      try {
        // Fetch reviews from the top courses
        const reviewPromises = courseIds.slice(0, 4).map((id) =>
          courseReviewApi.getReviewsByCourse(id).catch(() => null)
        );

        const responses = await Promise.all(reviewPromises);
        const allReviews = [];

        for (const response of responses) {
          const reviews = response?.data?.result;
          if (Array.isArray(reviews)) {
            allReviews.push(...reviews);
          }
        }

        // Filter 5-star reviews with a comment, sort by newest
        const fiveStarReviews = allReviews
          .filter((r) => r.rating === 5 && r.comment && r.comment.trim())
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 3)
          .map((review, index) => ({
            name: review.userFullName || "Học viên",
            role: "Học viên BTM Learning",
            avatar: getInitials(review.userFullName),
            avatarColor:
              AVATAR_COLOR_POOL[index % AVATAR_COLOR_POOL.length],
            quote: review.comment,
            rating: 5,
          }));

        if (!isMounted) return;

        if (fiveStarReviews.length > 0) {
          setTestimonials(fiveStarReviews);
        }
      } catch {
        // Silently ignore - testimonials are not critical
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const STAT_ITEMS = [
    {
      end: 12000,
      suffix: "+",
      label: "Khóa học",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      end: 500000,
      suffix: "+",
      label: "Học viên",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      end: 1200,
      suffix: "+",
      label: "Giảng viên",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      end: 98,
      suffix: "%",
      label: "Hài lòng",
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Danh mục{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                phổ biến
              </span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Khám phá các lĩnh vực học tập đa dạng với hàng nghìn khóa học
              chất lượng cao
            </p>
          </div>

          {!!catalogError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {catalogError}
            </div>
          )}

          {isLoadingCatalog && !categories.length && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`home-category-skeleton-${index}`}
                  className="h-44 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
                />
              ))}
            </div>
          )}

          {!isLoadingCatalog && !categories.length && !catalogError && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-slate-800/60 dark:text-slate-300">
              Hiện chưa có danh mục nào khả dụng.
            </div>
          )}

          {!!categories.length && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onClick={() => navigate("/courses")}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                Khóa học{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  nổi bật
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Được đánh giá cao nhất bởi hàng nghìn học viên
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Xem tất cả
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {isLoadingCatalog && !popularCourses.length && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`home-course-skeleton-${index}`}
                  className="h-80 rounded-2xl border border-slate-200 bg-white animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
                />
              ))}
            </div>
          )}

          {!isLoadingCatalog && !popularCourses.length && !catalogError && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-slate-800/60 dark:text-slate-300">
              Hiện chưa có khóa học nổi bật để hiển thị.
            </div>
          )}

          {!!popularCourses.length && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {popularCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(`/course/${course.id}`)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Xem tất cả khóa học
            </button>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <AIRecommendationsSection />

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Được tin tưởng bởi{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                hàng triệu
              </span>{" "}
              người
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Những con số ấn tượng minh chứng cho chất lượng của nền tảng
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STAT_ITEMS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                Học viên{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  nói gì
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Đánh giá 5 sao mới nhất từ cộng đồng học viên BTMLearning
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {testimonials.map((t, idx) => (
                <TestimonialCard key={`testimonial-${idx}`} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
            Bắt đầu hành trình học tập
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              ngay hôm nay
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            Đăng ký miễn phí và truy cập hàng nghìn khóa học chất lượng cao.
            Không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth/register")}
              className="px-8 py-3.5 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-2xl shadow-black/20 active:scale-95"
            >
              Đăng ký miễn phí
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="px-8 py-3.5 bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Khám phá khóa học
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
