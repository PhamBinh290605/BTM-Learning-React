import StarRating from "./StarRating";

const CourseCard = ({ course, onClick }) => {
  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-slate-800/60 dark:backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-2xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div
        className={`h-44 bg-gradient-to-br ${course.color || "from-indigo-500 to-violet-500"} relative overflow-hidden`}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-[11px] font-semibold text-white tracking-wide">
          {course.category}
        </span>

        {/* Free badge */}
        {course.price === 0 && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 rounded-full text-[11px] font-bold text-white shadow-lg shadow-emerald-500/30">
            Miễn phí
          </span>
        )}

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
            <svg
              className="w-6 h-6 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Decorative gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-[15px] text-slate-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {course.instructor}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-sm font-bold text-amber-500">
            {course.rating}
          </span>
          <StarRating rating={course.rating} size="xs" />
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({(course.reviewCount || course.students || 0).toLocaleString()})
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100 dark:border-white/[0.06]">
          <span
            className={`text-lg font-extrabold ${
              course.price === 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {formatPrice(course.price)}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {(course.students || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
