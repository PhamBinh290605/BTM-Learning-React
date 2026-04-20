import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAIRecommendedCourses } from "../../../api/aiAssistant";

const formatPrice = (price) => {
  if (price === 0) return "Miễn phí";
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
};

const AIRecommendationsSection = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getAIRecommendedCourses({ limit: 10 });

        if (!isMounted) return;
        setRecommendedCourses(data);
      } catch (error) {
        if (!isMounted) return;

        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setErrorMessage("Đăng nhập để xem gợi ý AI cá nhân hóa.");
        } else {
          setErrorMessage("Không tải được gợi ý AI. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300 mb-4">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Cá nhân hoá theo lịch sử học tập
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Top 10 khoá học được AI đề xuất
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              Hệ thống phân tích các khoá bạn đã xem, tiến độ và chủ đề quan tâm để gợi ý lộ trình học tiếp theo phù hợp nhất.
            </p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Xem toàn bộ catalogue
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
              >
                <div className="h-4 w-14 rounded bg-slate-200 dark:bg-white/10 mb-4" />
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-white/10 mb-3" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-white/5 mb-2" />
                <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !!errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && !recommendedCourses.length && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 dark:border-white/[0.08] dark:bg-slate-800/60 dark:text-slate-300">
            Hiện chưa có gợi ý phù hợp. Hãy hoàn thành thêm vài bài học để AI cá nhân hóa tốt hơn.
          </div>
        )}

        {!isLoading && !errorMessage && !!recommendedCourses.length && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendedCourses.map((course, index) => (
              <article
                key={course.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-white/[0.08] dark:bg-slate-800/60"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} text-white flex items-center justify-center text-lg font-extrabold shadow-lg shadow-black/15`}>
                      #{index + 1}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {course.score}% match
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {course.instructor} • {course.level} • {course.category}
                    </p>

                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {course.reason}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-amber-500">{course.rating}</span>
                        <span>({(course.reviewCount || 0).toLocaleString("vi-VN")} đánh giá)</span>
                      </div>

                      <span className={`text-sm font-extrabold ${course.price === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                        {formatPrice(course.price)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-400"
                      >
                        Xem chi tiết
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIRecommendationsSection;
